import React, { useMemo, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// compute approximate position of event along polyline
function getEventPosition(event, coords, tripDurationHours) {
    if (!coords || coords.length === 0) return null;

    const ratio = Math.min(1, event.start / tripDurationHours);
    const idx = Math.floor(ratio * (coords.length - 1));
    const [lon, lat] = coords[idx];
    return [lat, lon];
}

function FitBounds({ coords }) {
    const map = useMap();
    useEffect(() => {
        if (coords.length > 0) {
            const bounds = L.latLngBounds(coords.map((c) => [c[1], c[0]]));
            map.fitBounds(bounds, { padding: [30, 30] });
        }
    }, [coords, map]);
    return null;
}

export default function MapView({ routeGeoJson, logs }) {
    const { coords, startPos, events, tripDurationHours } = useMemo(() => {
        if (!routeGeoJson) return { coords: [], startPos: null, events: [], tripDurationHours: 1 };

        const coords = routeGeoJson.coordinates;
        const startPos = [coords[0][1], coords[0][0]];

        const allEvents = logs?.days?.flatMap((d) => d.events) || [];

        const tripDurationHours = Math.max(...allEvents.map((e) => e.start + e.duration), 1);

        return { coords, startPos, events: allEvents, tripDurationHours };
    }, [routeGeoJson, logs]);

    if (!routeGeoJson) {
        return <div className="text-gray-500">No route yet</div>;
    }

    return (
        <div className="w-full h-[520px] rounded-xl shadow-lg overflow-hidden">
            <MapContainer center={startPos} zoom={6} style={{ height: "100%", width: "100%" }}>
                {/* Free OpenStreetMap tiles */}
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Route polyline */}
                <Polyline positions={coords.map((c) => [c[1], c[0]])} color="#2563EB" weight={4} />

                {/* Ensure full route is visible */}
                <FitBounds coords={coords} />

                {/* Start marker */}
                <Marker position={startPos}>
                    <Tooltip direction="top" offset={[0, -10]} opacity={1}>Start</Tooltip>
                </Marker>

                {events
                    .filter((ev) => ev.type !== "drive")
                    .map((ev, idx) => {
                        const pos = getEventPosition(ev, coords, tripDurationHours);
                        if (!pos) return null;

                        return (
                            <Marker key={idx} position={pos}>
                                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                                    {ev.type} {ev.where ? `@ ${ev.where}` : ""} <br />
                                    {ev.duration}h, {ev.miles.toFixed(1)} mi
                                </Tooltip>
                            </Marker>
                        );
                    })}
            </MapContainer>
        </div>
    );
}
