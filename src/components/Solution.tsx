"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

export function Solution({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="my-6 border border-blue-200 dark:border-blue-900 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left"
            >
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                    <Lightbulb size={20} />
                    <span>{isOpen ? "Skrij rešitev" : "Pokaži rešitev"}</span>
                </div>
                {isOpen ? (
                    <ChevronUp size={20} className="text-blue-500" />
                ) : (
                    <ChevronDown size={20} className="text-blue-500" />
                )}
            </button>
            {isOpen && (
                <div className="p-4 bg-white dark:bg-gray-950 border-t border-blue-100 dark:border-blue-900">
                    <div className="prose dark:prose-invert max-w-none">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}
