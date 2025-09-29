import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ROWS = ["Off Duty", "Sleeper Berth", "Driving", "On Duty Not Driving"];
const ROW_HEIGHT = 50;
const HOURS = 24;

function mapEventType(type) {
    switch (type) {
        case "drive":
            return "Driving";
        case "sleep":
            return "Sleeper Berth";
        case "break":
            return "Off Duty";
        case "pickup":
        case "dropoff":
        case "fuel":
            return "On Duty Not Driving";
        default:
            return "On Duty Not Driving";
    }
}

function renderDay(day) {
    const svgWidth = 1200; // logical coordinate width
    const height = ROWS.length * ROW_HEIGHT + 300;
    const paddingLeft = 120;
    const pxPerHour = (svgWidth - paddingLeft - 20) / HOURS;

    // Convert events to segments
    const segments = [];
    day.events.forEach((ev) => {
        const row = ROWS.indexOf(mapEventType(ev.type));
        if (row === -1) return;
        const start = ev.start % 24;
        const end = Math.min(24, start + ev.duration);
        segments.push({ row, start, end, type: ev.type, where: ev.where });
    });

    return (
        <div
            key={day.date}
            id={`log-page-${day.date}`}
            className="log-sheet bg-white p-4 border rounded-md mb-12"
        >
            <svg
                viewBox={`0 0 ${svgWidth} ${height}`}
                width="100%"
                height="auto"
                preserveAspectRatio="xMinYMin meet"
                className="bg-white"
            >
                {/* --- HEADER --- */}
                <text x={20} y={20} fontWeight="bold" fontSize="16">
                    DRIVER’S DAILY LOG (24 hours)
                </text>
                <text x={svgWidth - 200} y={20} fontSize="12">
                    Date: {day.date}
                </text>

                <text x={20} y={40} fontSize="12">
                    From: {day.from || "________"}
                </text>
                <text x={300} y={40} fontSize="12">
                    To: {day.to || "________"}
                </text>
                <text x={20} y={60} fontSize="12">
                    Total Miles Driving Today: {day.totalMilesDriving || "___"}
                </text>
                <text x={300} y={60} fontSize="12">
                    Total Mileage Today: {day.totalMileage || "___"}
                </text>
                <text x={20} y={80} fontSize="12">
                    Carrier: {day.carrier || "________"}
                </text>
                <text x={300} y={80} fontSize="12">
                    Main Office: {day.mainOffice || "________"}
                </text>
                <text x={20} y={100} fontSize="12">
                    Truck/Trailer: {day.truck || "___"} / {day.trailer || "___"}
                </text>
                <text x={300} y={100} fontSize="12">
                    Home Terminal: {day.terminal || "___"}
                </text>

                {/* --- GRID ROWS --- */}
                {ROWS.map((label, i) => {
                    const y = 140 + i * ROW_HEIGHT;
                    return (
                        <g key={i}>
                            <line
                                x1={paddingLeft}
                                x2={svgWidth - 20}
                                y1={y}
                                y2={y}
                                stroke="black"
                                strokeWidth={1}
                            />
                            <text
                                x={10}
                                y={y + ROW_HEIGHT / 2}
                                alignmentBaseline="middle"
                                fontSize="12"
                            >
                                {label}
                            </text>
                        </g>
                    );
                })}

                {/* --- HOUR LINES --- */}
                {Array.from({ length: HOURS + 1 }).map((_, h) => {
                    const x = paddingLeft + h * pxPerHour;
                    return (
                        <g key={h}>
                            <line
                                x1={x}
                                x2={x}
                                y1={140}
                                y2={140 + ROWS.length * ROW_HEIGHT}
                                stroke="#000"
                                strokeWidth={0.5}
                            />
                            <text x={x} y={135} textAnchor="middle" fontSize="10">
                                {h}
                            </text>
                        </g>
                    );
                })}

                {/* --- DUTY SEGMENTS --- */}
                {segments.map((seg, idx) => {
                    const y = 140 + seg.row * ROW_HEIGHT;
                    const x1 = paddingLeft + seg.start * pxPerHour;
                    const x2 = paddingLeft + seg.end * pxPerHour;

                    return (
                        <g key={idx}>
                            <line
                                x1={x1}
                                x2={x2}
                                y1={y}
                                y2={y}
                                stroke="black"
                                strokeWidth={2}
                            />
                            {idx > 0 && segments[idx - 1].row !== seg.row && (
                                <line
                                    x1={x1}
                                    x2={x1}
                                    y1={140 + segments[idx - 1].row * ROW_HEIGHT}
                                    y2={y}
                                    stroke="black"
                                    strokeWidth={2}
                                />
                            )}
                            {seg.where && (
                                <text x={x1 + 4} y={y - 6} fontSize="10" fill="gray">
                                    {seg.type} @ {seg.where}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* --- REMARKS --- */}
                <rect
                    x={20}
                    y={height - 180}
                    width={svgWidth - 40}
                    height={40}
                    fill="none"
                    stroke="black"
                />
                <text x={30} y={height - 160} fontSize="12">
                    <tspan fontWeight="bold">Remarks: </tspan>
                    <tspan>{day.remarks || ""}</tspan>
                </text>

                {/* --- SHIPPING DOCS --- */}
                <rect
                    x={20}
                    y={height - 130}
                    width={svgWidth - 40}
                    height={40}
                    fill="none"
                    stroke="black"
                />
                <text x={30} y={height - 110} fontSize="12">
                    <tspan>DV/Manifest No: {day.manifestNo || ""}</tspan>
                </text>
                <text x={30} y={height - 90} fontSize="12">
                    <tspan>Shipper & Commodity: {day.shipper || ""}</tspan>
                </text>

                {/* --- RECAP TABLE --- */}
                <g transform={`translate(20, ${height - 70})`}>
                    <rect
                        x={0}
                        y={0}
                        width={svgWidth - 40}
                        height={50}
                        fill="none"
                        stroke="black"
                    />
                    <text x={10} y={20} fontSize="11">
                        70 hr / 8 Day Recap – On Duty Hrs Today:{" "}
                        {day.recap?.onDutyToday || 0}
                    </text>
                    <text x={10} y={40} fontSize="11">
                        Total Last 8 Days: {day.recap?.total8 || 0}, Available Tomorrow:{" "}
                        {day.recap?.available || 0}
                    </text>
                </g>

                {/* --- FOOTER --- */}
                <text x={20} y={height - 5} fontSize="12">
                    Driver’s Signature: ________________________
                </text>
                <text x={400} y={height - 5} fontSize="12">
                    Co-Driver: ________________________
                </text>
                <text x={750} y={height - 5} fontSize="12">
                    Shipping Doc/Bill No: _______________
                </text>
            </svg>
        </div>
    );
}

export default function LogSVG({ logs }) {
    const [page, setPage] = useState(0);

    if (!logs?.days) return null;

    const exportPDF = async () => {
        const pdf = new jsPDF("p", "pt", "a4");

        for (let i = 0; i < logs.days.length; i++) {
            const node = document.getElementById(`log-page-${logs.days[i].date}`);
            if (!node) continue;

            const canvas = await html2canvas(node, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        }

        pdf.save("driver_logs.pdf");
    };

    return (
        <div className="space-y-8">
            {/* current page */}
            {renderDay(logs.days[page])}

            {/* hidden pages for export */}
            <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                {logs.days.map((day, i) =>
                    i === page ? null : <div key={i}>{renderDay(day)}</div>
                )}
            </div>

            {/* navigation */}
            <div className="flex items-center justify-between mt-4">
                <button
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                >
                    Prev
                </button>
                <span>
          Page {page + 1} / {logs.days.length}
        </span>
                <button
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    disabled={page === logs.days.length - 1}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </button>
            </div>

            {/* export */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={exportPDF}
                    className="px-6 py-2 bg-blue-600 text-white rounded shadow"
                >
                    Export All Logs to PDF
                </button>
            </div>
        </div>
    );
}
