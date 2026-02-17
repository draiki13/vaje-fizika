"use client";

import { useState, Children, isValidElement } from "react";
import { ChevronLeft, ChevronRight, Printer } from "lucide-react";

export function ProblemSet({ children }: { children: React.ReactNode }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter children to only include valid React elements (ignoring text/whitespace)
    const problems = Children.toArray(children).filter((child) =>
        isValidElement(child)
    );

    const totalProblems = problems.length;

    const nextProblem = () => {
        if (currentIndex < totalProblems - 1) {
            setCurrentIndex(currentIndex + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevProblem = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrint = () => {
        // Get current slug from window location
        const path = window.location.pathname;
        const parts = path.split('/').filter(Boolean);
        const filename = parts[parts.length - 1];

        // Link to the pre-generated static PDF
        window.open(`/pdfs/${filename}.pdf`, '_blank');
    };

    return (
        <div className="mt-8">
            {/* Navigation Bar - Hidden in Print */}
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6 shadow-sm sticky top-4 z-10 no-print">
                <button
                    onClick={prevProblem}
                    disabled={currentIndex === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${currentIndex === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm"
                        }`}
                >
                    <ChevronLeft size={20} />
                    <span className="hidden sm:inline">Prejšnja</span>
                </button>

                <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                        Naloga {currentIndex + 1} od {totalProblems}
                    </span>
                </div>

                <button
                    onClick={nextProblem}
                    disabled={currentIndex === totalProblems - 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${currentIndex === totalProblems - 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm"
                        }`}
                >
                    <span className="hidden sm:inline">Naslednja</span>
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Problems Container */}
            <div className="min-h-[400px]">
                {problems.map((problem, index) => (
                    <div
                        key={index}
                        className={`problem-container ${index === currentIndex ? 'block animate-in fade-in slide-in-from-bottom-4 duration-300' : 'hidden'}`}
                    >
                        {problem}
                    </div>
                ))}
            </div>
        </div>
    );
}
