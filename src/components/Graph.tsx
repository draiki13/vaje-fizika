"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Label
} from "recharts";

interface GraphProps {
    data: any[];
    xKey: string;
    yKey: string;
    xLabel?: string;
    yLabel?: string;
    title?: string;
    color?: string;
    type?: "basis" | "basisClosed" | "basisOpen" | "linear" | "linearClosed" | "natural" | "monotoneX" | "monotoneY" | "monotone" | "step" | "stepBefore" | "stepAfter";
}

export function Graph({
    data,
    xKey,
    yKey,
    xLabel = "t [s]",
    yLabel,
    title,
    color = "#2563eb",
    type = "linear",
}: GraphProps) {
    return (
        <div className="my-8 w-full h-[300px] bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            {title && (
                <h4 className="text-center font-medium mb-4 text-gray-700 dark:text-gray-300">
                    {title}
                </h4>
            )}
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
                    <XAxis
                        dataKey={xKey}
                        type="number"
                        domain={['auto', 'auto']}
                        className="text-xs"
                    >
                        <Label value={xLabel} offset={0} position="bottom" />
                    </XAxis>
                    <YAxis className="text-xs">
                        <Label value={yLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                    </YAxis>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--color-background)',
                            borderColor: 'var(--color-border)',
                            borderRadius: '0.5rem'
                        }}
                    />
                    <Line
                        type={type}
                        dataKey={yKey}
                        stroke={color}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
