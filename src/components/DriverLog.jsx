import React from "react";
import LogSVG from "./LogSVG";

const DriverLog = React.forwardRef(({ log }, ref) => (
    <div
        ref={ref}
        className="w-[210mm] h-[297mm] mx-auto p-6 bg-white text-black border border-gray-400"
    >
        {/* Header */}
        <div className="flex justify-between mb-2">
            <h1 className="text-lg font-bold">DRIVER’S DAILY LOG</h1>
            <div>Date: {log.date}</div>
        </div>

        {/* Info fields */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <div>From: {log.from}</div>
            <div>To: {log.to}</div>
            <div>Total Miles Driving Today: {log.miles}</div>
            <div>Total Mileage Today: {log.totalMileage}</div>
            <div>Carrier: {log.carrier}</div>
            <div>Main Office: {log.office}</div>
            <div>Truck/Trailer: {log.truck}/{log.trailer}</div>
            <div>Home Terminal: {log.terminal}</div>
        </div>

        {/* Log grid */}
        <div className="mb-4">
            <LogSVG entries={log.entries} />
        </div>

        {/* Remarks */}
        <div className="text-sm mb-2">Remarks: {log.remarks}</div>

        {/* Other info */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <div>DV/Manifest No: {log.manifest}</div>
            <div>Shipper & Commodity: {log.commodity}</div>
        </div>

        {/* 70 hr recap */}
        <div className="text-sm mb-4">
            70 hr / 8 Day Recap – On Duty Hrs Today: {log.onDutyToday}
            <br />
            Total Last 8 Days: {log.total8days}, Available Tomorrow: {log.availableTomorrow}
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 text-sm mt-6">
            <div>Driver’s Signature: ____________________________</div>
            <div>Co-Driver: ____________________________</div>
            <div>Shipping Doc/Bill No: {log.shippingDoc}</div>
        </div>
    </div>
));

export default DriverLog;
