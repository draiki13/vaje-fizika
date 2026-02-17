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

    // Parse MDX
    const processor = unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkMdx);

    const tree = processor.parse(fileContent);

    let latexBody = '';
    let currentProblemTitle = '';
    let problemCount = 0;

    visit(tree, (node: any) => {
        // Handle JSX Elements (Problem, Graph, Solution)
        if (node.type === 'mdxJsxFlowElement') {
            if (node.name === 'Problem') {
                problemCount++;
                const titleAttr = node.attributes.find((attr: any) => attr.name === 'title');
                const problemTitle = titleAttr ? titleAttr.value : `Naloga ${problemCount}`;
                currentProblemTitle = problemTitle;

                latexBody += `\\subsection*{${problemTitle}}\n\n`;
            }
            else if (node.name === 'Graph') {
                const dataAttr = node.attributes.find((attr: any) => attr.name === 'data');
                const xKeyAttr = node.attributes.find((attr: any) => attr.name === 'xKey');
                const yKeyAttr = node.attributes.find((attr: any) => attr.name === 'yKey');
                const xLabelAttr = node.attributes.find((attr: any) => attr.name === 'xLabel');
                const yLabelAttr = node.attributes.find((attr: any) => attr.name === 'yLabel');
                const titleAttr = node.attributes.find((attr: any) => attr.name === 'title');

                if (dataAttr && dataAttr.value) {
                    try {
                        // Unsafe eval to parse the JS array string from MDX
                        // In a real app, use a safer parser.
                        const data = new Function('return ' + dataAttr.value.value)();
                        const xKey = xKeyAttr ? xKeyAttr.value : 'x';
                        const yKey = yKeyAttr ? yKeyAttr.value : 'y';
                        const xLabel = xLabelAttr ? xLabelAttr.value : xKey;
                        const yLabel = yLabelAttr ? yLabelAttr.value : yKey;
                        const graphTitle = titleAttr ? titleAttr.value : '';

                        let coords = '';
                        data.forEach((point: any) => {
                            coords += `(${point[xKey]},${point[yKey]}) `;
                        });

                        latexBody += `
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
\\addplot[color=blue, mark=*] coordinates {
    ${coords}
};
\\end{axis}
\\end{tikzpicture}
\\end{center}
`;
                    } catch (e) {
                        console.error('Error parsing graph data', e);
                    }
                }
            }
            else if (node.name === 'Solution') {
                // Skip solution content
                return 'skip';
            }
            else if (node.name === 'ProblemSet') {
                // Just a wrapper, continue
            }
        }

        // Handle Text inside Problem (but not inside Solution)
        // We need to track if we are inside a Solution node.
        // Since 'visit' is depth-first, we can't easily skip children from here unless we return 'skip'.
        // But 'visit' doesn't support skipping specific children easily in the callback for the parent.
        // Strategy: We only process text nodes if their ancestors don't include 'Solution'.
        // Actually, simpler: The 'visit' function allows us to modify the tree or skip.
        // If we encounter 'Solution', we return 'skip' to not visit its children.

        // BUT, 'visit' visits the node itself.
        // So if node.name === 'Solution', we return 'skip'.
        // This is handled above.

        // Handle Paragraphs and Text
        if (node.type === 'paragraph') {
            // We need to process children of paragraph
            // But 'visit' will visit them too.
            // We should construct latexBody incrementally.
            // This visitor approach is tricky for reconstruction.
            // Better approach: A recursive function `toLatex(node)`
        }
    });

    // Let's switch to a recursive function approach for better control
    latexBody = processNode(tree);

    return `
\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{pgfplots}
\\pgfplotsset{compat=1.18}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\usepackage{parskip}

\\title{${title}}
\\author{${section} - ${subsection}}
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
            const childrenLatex = node.children.map(processNode).join('');
            return `\\section*{${title}}\n${childrenLatex}\n\\vspace{0.5cm}\n`;
        }
        if (node.name === 'Graph') {
            return generateGraphLatex(node);
        }
        if (node.name === 'Solution') {
            return ''; // Skip solutions
        }
        if (node.name === 'ProblemSet' || node.name === 'EquationBox') {
            return node.children.map(processNode).join('\n');
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
        return `\\textbf{${node.children.map(processNode).join('')}}`;
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
