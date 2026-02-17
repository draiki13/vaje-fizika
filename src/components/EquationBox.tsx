"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Sigma } from "lucide-react";

import { Children } from "react";

export function EquationBox({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="my-6 border border-amber-200 dark:border-amber-900/50 rounded-lg overflow-hidden shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors text-left no-print"
            >
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-bold">
                    <Sigma size={20} className="text-amber-600 dark:text-amber-400" />
                    <span>Enačbe</span>
                </div>
                {isOpen ? (
                    <ChevronUp size={20} className="text-amber-600 dark:text-amber-400" />
                ) : (
                    <ChevronDown size={20} className="text-amber-600 dark:text-amber-400" />
                )}
            </button>

            {isOpen && (
                <div className="p-6 bg-white dark:bg-gray-950 border-t border-amber-100 dark:border-amber-900/50">
                    <div className="flex flex-col">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}

export function EqRow({ children }: { children: React.ReactNode }) {
    const parts = Children.toArray(children).filter(child => {
        if (typeof child === 'string' && !child.trim()) return false;
        return true;
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr] gap-4 md:gap-12 items-center py-6 border-b border-amber-50 dark:border-amber-900/20 last:border-0 not-prose">
            <div className="flex justify-center text-xl md:text-2xl font-bold">
                {parts[0]}
            </div>
            <div className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                {parts.slice(1)}
            </div>
        </div>
    );
}
