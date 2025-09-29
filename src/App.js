import React, { useState } from "react";
import TripForm from "./components/TripForm";
import MapView from "./components/MapView";
import LogSVG from "./components/LogSVG";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function App() {
    const [result, setResult] = useState(null);

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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
