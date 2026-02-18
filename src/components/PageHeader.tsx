"use client";

import Link from "next/link";
import { ChevronRight, Printer } from "lucide-react";

interface PageHeaderProps {
    title: string;
    slug: string[];
    onPrint?: () => void;
}

export function PageHeader({ title, slug, onPrint }: PageHeaderProps) {
    const handlePrint = () => {
        if (onPrint) {
            onPrint();
            return;
        }
        const filename = slug[slug.length - 1];
        window.open(`/pdfs/${filename}.pdf`, '_blank');
    };

    return (
        <header className="mb-8 no-print">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4 overflow-x-auto whitespace-nowrap pb-1">
                <Link href="/" className="hover:text-blue-600">Domov</Link>
                <ChevronRight size={14} />
                {slug.map((part, index) => (
                    <div key={part} className="flex items-center gap-2">
                        <Link
                            href={`/${slug.slice(0, index + 1).join('/')}`}
                            className={`hover:text-blue-600 capitalize ${index === slug.length - 1 ? 'text-gray-900 dark:text-gray-100 font-medium' : ''}`}
                        >
                            {part.replace(/-/g, ' ')}
                        </Link>
                        {index < slug.length - 1 && <ChevronRight size={14} />}
                    </div>
                ))}
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 m-0">
                    {title}
                </h1>

                <button
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm w-fit"
                >
                    <Printer size={18} />
                    <span>Prenesi PDF</span>
                </button>
            </div>

            <hr className="mt-8 border-gray-200 dark:border-gray-800" />
        </header>
    );
}
