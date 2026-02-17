import { Star } from "lucide-react";

export function Problem({ children, title, difficulty = 0 }: { children: React.ReactNode; title?: string; difficulty?: number }) {
    return (
        <div className="problem-content">
            {title && (
                <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold m-0">{title}</h3>
                    {difficulty > 0 && (
                        <div className="flex gap-0.5" title={`Težavnost: ${difficulty}/2`}>
                            {[...Array(difficulty)].map((_, i) => (
                                <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                    )}
                </div>
            )}
            {children}
        </div>
    );
}
