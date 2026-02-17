"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationConfig, NavItem } from "@/lib/navigation-config";
import { useState } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 rounded-md shadow-md md:hidden"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="h-full overflow-y-auto p-4">
                    <Link href="/" className="block text-2xl font-bold mb-8 px-2">
                        Vaje Fizika
                    </Link>
                    <nav>
                        {navigationConfig.map((item) => (
                            <NavGroup key={item.slug} item={item} level={0} />
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
}

function NavGroup({ item, level }: { item: NavItem; level: number }) {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(true); // Default expanded for now

    const hasChildren = item.children && item.children.length > 0;
    // Construct full path logic would go here, but for now we assume structure matches config
    // Simplified for this iteration: we don't have full path in config, so we might need to pass parent slug
    // For the top level, slug is just /slug. For nested, it's /parent/slug.
    // Let's adjust to pass full path down.

    return (
        <div className="mb-2">
            {hasChildren ? (
                <div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${level === 0 ? "text-base" : "text-gray-600 dark:text-gray-400"
                            }`}
                    >
                        {hasChildren && (
                            <span className="mr-1">
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </span>
                        )}
                        {item.title}
                    </button>
                    {isExpanded && (
                        <div className="ml-4 mt-1 border-l border-gray-200 dark:border-gray-800 pl-2">
                            {item.children!.map((child) => (
                                <NavLink
                                    key={child.slug}
                                    item={child}
                                    parentPath={`/${item.slug}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <NavLink item={item} parentPath="" />
            )}
        </div>
    );
}

function NavLink({ item, parentPath }: { item: NavItem; parentPath: string }) {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(true);

    const fullPath = `${parentPath}/${item.slug}`;
    const isActive = pathname === fullPath;
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
        return (
            <div className="mb-1">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                    <span className="mr-1">
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                    {item.title}
                </button>
                {isExpanded && (
                    <div className="ml-3 mt-1 border-l border-gray-200 dark:border-gray-800 pl-2">
                        {item.children!.map((child) => (
                            <NavLink
                                key={child.slug}
                                item={child}
                                parentPath={fullPath}
                            />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <Link
            href={fullPath}
            className={`block px-2 py-1.5 text-sm rounded-md transition-colors ${isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
        >
            {item.title}
        </Link>
    );
}
