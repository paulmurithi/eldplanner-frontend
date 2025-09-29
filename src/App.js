import React, { useState } from "react";
import TripForm from "./components/TripForm";
import MapView from "./components/MapView";
import LogSVG from "./components/LogSVG";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function App() {
    const [result, setResult] = useState(null);

    const exportAllLogsToPDF = async () => {
        // Create PDF in landscape orientation
        const doc = new jsPDF("landscape", "pt", "a4");
        const logContainers = document.querySelectorAll(".log-sheet");

        for (let i = 0; i < logContainers.length; i++) {
            const element = logContainers[i];

            // Render to canvas with higher resolution
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
            });

            const imgData = canvas.toDataURL("image/png");

            // PDF page dimensions
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Scale image to fit full width of landscape page
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const yOffset = (pageHeight - imgHeight) / 2; // center vertically if shorter

            if (i > 0) doc.addPage();
            doc.addImage(imgData, "PNG", 0, yOffset, imgWidth, imgHeight);
        }

        doc.save("driver_logs.pdf");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* TripForm + Summary */}
                <div className="w-full md:w-1/5">
                    <TripForm onResult={setResult} />
                    {result && (
                        <div className="mt-6 bg-white shadow-md rounded-xl p-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Route summary
                            </h3>
                            <p className="text-gray-600 mt-2">
                                Distance:{" "}
                                <span className="font-medium">
                  {result.distance_miles.toFixed(1)}
                </span>{" "}
                                miles, Duration:{" "}
                                <span className="font-medium">
                  {result.duration_hours.toFixed(2)}h
                </span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Map + Logs */}
                <div className="flex-1 flex flex-col gap-6">
                    {result && (
                        <MapView
                            routeGeoJson={result.route_geojson}
                            logs={result.logs}
                        />
                    )}
                    {result && (
                        <div className="bg-white shadow-md rounded-xl p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Driver Logs
                            </h3>

                            {/* Horizontal scroll wrapper */}
                            <div className="overflow-x-auto">
                                <div className="min-w-[500px] space-y-6">
                                    {(Array.isArray(result.logs)
                                            ? result.logs
                                            : [result.logs]
                                    ).map((log, idx) => (
                                        <div
                                            key={idx}
                                            className="log-sheet bg-white p-4 border rounded-md"
                                        >
                                            <LogSVG logs={log} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Export all logs in one PDF */}
                            <div className="mt-4">
                                <button
                                    onClick={exportAllLogsToPDF}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                                >
                                    Export All Logs as PDF
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
