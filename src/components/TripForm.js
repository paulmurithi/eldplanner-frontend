import React, { useState } from "react";
import api from "../api";

export default function TripForm({ onResult }) {
    const [current, setCurrent] = useState("");
    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [cycle, setCycle] = useState(0);

    async function submit(e) {
        e.preventDefault();
        try {
            const payload = {
                current_location: current.trim(),
                pickup_location: pickup.trim(),
                dropoff_location: dropoff.trim(),
                current_cycle_used_hours: cycle === "" ? 0 : Number(cycle),
            };
            const r = await api.post("/plan-trip/", payload);
            onResult(r.data.result);
        } catch (err) {
            console.error("Request failed:", err.response?.data || err.message);
            alert("Error: " + JSON.stringify(err.response?.data || err.message));
        }
    }

    return (
        <form
            onSubmit={submit}
            className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-4"
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Plan a New Trip
            </h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current location
                </label>
                <input
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., New York, NY"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup location
                </label>
                <input
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., Michigan"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dropoff location
                </label>
                <input
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., Minneapolis"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current cycle used (hours)
                </label>
                <input
                    type="number"
                    value={cycle}
                    onChange={(e) => setCycle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
                Plan Trip
            </button>
        </form>
    );
}
