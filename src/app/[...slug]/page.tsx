import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { notFound } from 'next/navigation';
import { Solution } from '@/components/Solution';
import { EquationBox, EqRow } from '@/components/EquationBox';
import { Graph } from '@/components/Graph';
import { Problem } from '@/components/Problem';
import { ProblemSet } from '@/components/ProblemSet';
import { PageHeader } from '@/components/PageHeader';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export default async function ProblemPage({ params }: PageProps) {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), 'content', ...slug) + '.mdx';

    if (!fs.existsSync(filePath)) {
        notFound();
    }

    const source = fs.readFileSync(filePath, 'utf8');

    const { content, frontmatter } = await compileMDX<{ title: string }>({
        source,
        components: {
            Solution,
            EquationBox,
            EqRow,
            Graph,
            Problem,
            ProblemSet,
        },
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remarkMath],
                rehypePlugins: [rehypeKatex],
            },
        },
    });

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader title={frontmatter.title} slug={slug} />
            <div className="prose dark:prose-invert max-w-none">
                {content}
            </div>
            <footer className="mt-20 py-8 border-t border-gray-100 dark:border-gray-800 text-center text-gray-400 text-sm no-print">
                © {new Date().getFullYear()} Vaje Fizika - Vse pravice pridržane.
            </footer>
        </div>
    );
}
