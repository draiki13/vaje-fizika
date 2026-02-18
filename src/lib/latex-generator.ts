import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkMath from 'remark-math';
import { visit } from 'unist-util-visit';
import fs from 'fs';
import path from 'path';

// Helper to escape special LaTeX characters
function escapeLatex(text: string): string {
    return text
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\$/g, '\\$') // We handle math separately, so escape loose $
        .replace(/&/g, '\\&')
        .replace(/#/g, '\\#')
        .replace(/\^/g, '\\textasciicircum{}')
        .replace(/_/g, '\\_')
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/%/g, '\\%');
}

export async function generateLatex(slug: string[]): Promise<string> {
    const filePath = path.join(process.cwd(), 'content', ...slug) + '.mdx';
    if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Extract frontmatter manually (simple regex)
    const titleMatch = fileContent.match(/title:\s*"(.*?)"/);
    const sectionMatch = fileContent.match(/section:\s*"(.*?)"/);
    const subsectionMatch = fileContent.match(/subsection:\s*"(.*?)"/);

    const title = titleMatch ? titleMatch[1] : 'Physics Problems';
    const section = sectionMatch ? sectionMatch[1] : '';
    const subsection = subsectionMatch ? subsectionMatch[1] : '';

    // Strip frontmatter to avoid it appearing in the body
    const cleanContent = fileContent.replace(/^---[\s\S]*?---/, '');

    // Parse MDX
    const processor = unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkMdx);

    const tree = processor.parse(cleanContent);

    // Let's use the recursive function approach directly
    const latexBody = processNode(tree);

    return `
\\documentclass[12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{pgfplots}
\\pgfplotsset{compat=1.18}
\\usepackage{geometry}
\\usepackage{array}
\\geometry{a4paper, margin=1in}
\\usepackage{parskip}

\\title{${title}}
\\author{${section} --- ${subsection}}
\\date{}

\\begin{document}

\\maketitle

${latexBody}

\\end{document}
`;
}

function processNode(node: any): string {
    if (node.type === 'root') {
        return node.children.map(processNode).join('\n');
    }

    if (node.type === 'mdxJsxFlowElement') {
        if (node.name === 'Problem') {
            const titleAttr = node.attributes.find((attr: any) => attr.name === 'title');
            const title = titleAttr ? titleAttr.value : 'Naloga';
            const childrenLatex = node.children.map(processNode).join('').trim();
            return `\\textbf{${title}} ${childrenLatex}\n\n\\vspace{0.5cm}\n`;
        }
        if (node.name === 'Graph') {
            return generateGraphLatex(node);
        }
        if (node.name === 'Solution') {
            return ''; // Skip solutions
        }
        if (node.name === 'EquationBox') {
            const rows = node.children.filter((c: any) => c.name === 'EqRow');
            if (rows.length === 0) return node.children.map(processNode).join('\n');

            let tableRows = '';
            for (const row of rows) {
                // Find primary math node
                let primaryMathNode: any = null;
                const findPrimaryMath = (n: any): boolean => {
                    if (n.type === 'math' || n.type === 'inlineMath') {
                        primaryMathNode = n;
                        return true;
                    }
                    if (n.children) return n.children.some(findPrimaryMath);
                    return false;
                };
                findPrimaryMath(row);

                // Helper to render description without the primary math node
                const renderDescription = (n: any): string => {
                    if (n === primaryMathNode) return '';
                    if (n.type === 'paragraph') return n.children.map(renderDescription).join('');
                    if (n.type === 'text') return escapeLatex(n.value);
                    if (n.type === 'inlineMath') return `$${n.value}$`;
                    if (n.type === 'math') return `\\[${n.value}\\]`;
                    if (n.type === 'strong' || n.type === 'emphasis') return n.children.map(renderDescription).join('');
                    if (n.children) return n.children.map(renderDescription).join('');
                    return '';
                };

                const descLatex = row.children.map(renderDescription).join('').trim().replace(/\n/g, ' ');
                const mathLatex = primaryMathNode ? `$\\displaystyle ${primaryMathNode.value}$` : '';

                tableRows += `${mathLatex} & ${descLatex} \\\\ \\hline\n`;
            }

            return `
\\begin{center}
\\renewcommand{\\arraystretch}{2}
\\begin{tabular}{|>{\\centering\\arraybackslash}m{0.35\\textwidth}|m{0.55\\textwidth}|}
\\hline
${tableRows}
\\end{tabular}
\\end{center}
\\vspace{1cm}
`;
        }
        if (node.name === 'ProblemSet') {
            return node.children.map(processNode).join('\n');
        }
        if (node.name === 'EqRow') {
            return ''; // Handled by EquationBox
        }
    }

    if (node.type === 'paragraph') {
        return node.children.map(processNode).join('') + '\n\n';
    }

    if (node.type === 'text') {
        return escapeLatex(node.value);
    }

    if (node.type === 'inlineMath') {
        return `$${node.value}$`;
    }

    if (node.type === 'math') {
        return `\\[${node.value}\\]`;
    }

    if (node.type === 'list') {
        const env = node.ordered ? 'enumerate' : 'itemize';
        const items = node.children.map(processNode).join('');
        return `\\begin{${env}}\n${items}\\end{${env}}\n`;
    }

    if (node.type === 'listItem') {
        return `\\item ${node.children.map(processNode).join('')}\n`;
    }

    if (node.type === 'strong') {
        return node.children.map(processNode).join('');
    }

    if (node.type === 'emphasis') {
        return `\\textit{${node.children.map(processNode).join('')}}`;
    }

    // Fallback for other nodes
    if (node.children) {
        return node.children.map(processNode).join('');
    }

    return '';
}

function generateGraphLatex(node: any): string {
    const dataAttr = node.attributes.find((attr: any) => attr.name === 'data');
    const xKeyAttr = node.attributes.find((attr: any) => attr.name === 'xKey');
    const yKeyAttr = node.attributes.find((attr: any) => attr.name === 'yKey');
    const xLabelAttr = node.attributes.find((attr: any) => attr.name === 'xLabel');
    const yLabelAttr = node.attributes.find((attr: any) => attr.name === 'yLabel');
    const titleAttr = node.attributes.find((attr: any) => attr.name === 'title');
    const typeAttr = node.attributes.find((attr: any) => attr.name === 'type');

    if (!dataAttr || !dataAttr.value) return '';

    try {
        const data = new Function('return ' + dataAttr.value.value)();
        const xKey = xKeyAttr ? xKeyAttr.value : 'x';
        const yKey = yKeyAttr ? yKeyAttr.value : 'y';
        const xLabel = xLabelAttr ? xLabelAttr.value : xKey;
        const yLabel = yLabelAttr ? yLabelAttr.value : yKey;
        const graphTitle = titleAttr ? titleAttr.value : '';
        const type = typeAttr ? typeAttr.value : 'linear';

        let coords = '';
        data.forEach((point: any) => {
            coords += `(${point[xKey]},${point[yKey]}) `;
        });

        // Handle step graphs (const plot)
        let plotOptions = 'color=blue, mark=*';
        if (type === 'step' || type === 'stepAfter') {
            plotOptions += ', const plot';
        }

        return `
\\begin{center}
\\begin{tikzpicture}
\\begin{axis}[
    title={${graphTitle}},
    xlabel={${xLabel}},
    ylabel={${yLabel}},
    grid=major,
    width=10cm,
    height=6cm
]
\\addplot[${plotOptions}] coordinates {
    ${coords}
};
\\end{axis}
\\end{tikzpicture}
\\end{center}
`;
    } catch (e) {
        return '';
    }
}
