import React from "react";

const LogSVG = ({ entries }) => {
    const hours = 24;
    const rows = ["Off Duty", "Sleeper Berth", "Driving", "On Duty Not Driving"];

    const pageWidth = 210 * 3.78; // A4 width in px
    const margin = 40;
    const labelWidth = 100;
    const availableWidth = pageWidth - margin * 2 - labelWidth;
    const cellWidth = availableWidth / hours;
    const rowHeight = 40;
    const height = rowHeight * rows.length;

    const getRowY = (duty) => {
        const index = rows.indexOf(duty);
        return 30 + index * rowHeight + rowHeight / 2;
    };

    return (
        <svg
            width={pageWidth - margin * 2}
            height={height + 30}
            className="border border-black"
        >
            {/* Hour labels */}
            <g>
                <rect x="0" y="0" width={labelWidth} height="30" fill="white" stroke="black" />
                {Array.from({ length: hours }).map((_, i) => (
                    <g key={i}>
                        <rect
                            x={labelWidth + i * cellWidth}
                            y="0"
                            width={cellWidth}
                            height="30"
                            fill="white"
                            stroke="black"
                        />
                        <text
                            x={labelWidth + i * cellWidth + cellWidth / 2}
                            y="20"
                            fontSize="10"
                            textAnchor="middle"
                        >
                            {i}
                        </text>
                    </g>
                ))}
            </g>

            {/* Rows */}
            {rows.map((row, r) => (
                <g key={r}>
                    <rect
                        x="0"
                        y={30 + r * rowHeight}
                        width={labelWidth}
                        height={rowHeight}
                        fill="white"
                        stroke="black"
                    />
                    <text
                        x={labelWidth / 2}
                        y={30 + r * rowHeight + rowHeight / 2}
                        fontSize="10"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                    >
                        {row}
                    </text>

                    {Array.from({ length: hours }).map((_, i) => (
                        <rect
                            key={i}
                            x={labelWidth + i * cellWidth}
                            y={30 + r * rowHeight}
                            width={cellWidth}
                            height={rowHeight}
                            fill="white"
                            stroke="black"
                        />
                    ))}
                </g>
            ))}

            {/* Duty lines */}
            <g stroke="red" strokeWidth="2">
                {entries?.map((entry, i) => {
                    const y = getRowY(entry.duty);
                    const x1 = labelWidth + entry.start * cellWidth;
                    const x2 = labelWidth + entry.end * cellWidth;
                    return <line key={i} x1={x1} y1={y} x2={x2} y2={y} />;
                })}
            </g>
        </svg>
    );
};

export default LogSVG;
