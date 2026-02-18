import fs from 'fs';
import path from 'path';
import Link from 'next/link';
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
import { navigationConfig, NavItem } from '@/lib/navigation-config';
import { ChevronRight, Folder, FileText } from 'lucide-react';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export default async function ProblemPage({ params }: PageProps) {
    const { slug } = await params;
    const contentDir = path.join(process.cwd(), 'content');
    const folderPath = path.join(contentDir, ...slug);
    const mdxPath = folderPath + '.mdx';

    // 1. Handle MDX File
    if (fs.existsSync(mdxPath) && fs.statSync(mdxPath).isFile()) {
        const source = fs.readFileSync(mdxPath, 'utf8');
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

    // 2. Handle Directory (Discovery Dashboard)
    // Find the item in navigationConfig that matches this slug path
    let currentLevel: NavItem[] | undefined = navigationConfig;
    let foundItem: NavItem | undefined;

    for (const segment of slug) {
        foundItem = currentLevel?.find(item => item.slug === segment);
        currentLevel = foundItem?.children;
    }

    if (foundItem && foundItem.children && foundItem.children.length > 0) {
        return (
            <div className="max-w-5xl mx-auto py-8 px-4">
                <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
                    <Link href="/" className="hover:text-blue-600">Domov</Link>
                    {slug.map((segment, i) => (
                        <div key={segment} className="flex items-center">
                            <ChevronRight size={14} className="mx-2 flex-shrink-0" />
                            <Link
                                href={`/${slug.slice(0, i + 1).join('/')}`}
                                className={`hover:text-blue-600 capitalize ${i === slug.length - 1 ? 'text-gray-900 dark:text-gray-100 font-semibold' : ''}`}
                            >
                                {segment.replace(/-/g, ' ')}
                            </Link>
                        </div>
                    ))}
                </nav>

                <h1 className="text-4xl font-extrabold mb-12 text-gray-900 dark:text-white">
                    {foundItem.title}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {foundItem.children.map((child) => {
                        const isFolder = child.children && child.children.length > 0;
                        const childPath = `/${slug.join('/')}/${child.slug}`;

                        return (
                            <Link
                                key={child.slug}
                                href={childPath}
                                className="group p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl ${isFolder ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'bg-gray-50 text-gray-600 dark:bg-gray-800'}`}>
                                        {isFolder ? <Folder size={20} /> : <FileText size={20} />}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {child.title}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {isFolder ? `${child.children?.length} področij` : 'Poglej naloge'}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    // 3. Not Found
    notFound();
}
