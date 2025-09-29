import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import api from "../api"; // ✅ api.js in src/
import DriverLog from "./DriverLog";

export default function DriverLogBook() {
    const [logs, setLogs] = useState([]);
    const [currentLogIndex, setCurrentLogIndex] = useState(0);
    const ref = useRef();

    const handlePrint = useReactToPrint({
        content: () => ref.current,
        documentTitle: `DriverLog-${logs[currentLogIndex]?.date || "log"}`,
    });

    useEffect(() => {
        async function fetchLogs() {
            try {
                const res = await api.post("/plan-trip", {
                    current_location: "new york",
                    pickup_location: "michigan",
                    dropoff_location: "minneapolis",
                    cycle_used: 20,
                });
                setLogs(res.data.logs || []);
            } catch (err) {
                console.error("Failed to load logs", err);
            }
        }
        fetchLogs();
    }, []);

    if (logs.length === 0) {
        return <div className="p-4">Loading logs...</div>;
    }

    const currentLog = logs[currentLogIndex];

    return (
        <div className="p-4 space-y-4">
            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    onClick={() => setCurrentLogIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={currentLogIndex === 0}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    ← Previous
                </button>
                <button
                    onClick={() =>
                        setCurrentLogIndex((prev) =>
                            Math.min(prev + 1, logs.length - 1)
                        )
                    }
                    disabled={currentLogIndex === logs.length - 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next →
                </button>
            </div>

            {/* Print */}
            <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Print / Save as PDF
            </button>

            {/* Current Log */}
            <DriverLog ref={ref} log={currentLog} />
        </div>
    );
}
