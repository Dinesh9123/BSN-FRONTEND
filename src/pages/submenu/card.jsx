import React from "react";

export default function Cards({ reports, onCardClick }) {
    return (
        <div className="dashboard-container">
            {reports.map((report, index) => (
                <div
                    className="card"
                    key={index}
                    onClick={() => onCardClick(report)}
                    style={{ cursor: "pointer" }}
                >
                    <div className={`icon ${report.color || "blue"}`}>
                        <i className={report.icon}></i>
                    </div>

                    <h3>{report.name}</h3>

                    <span>{report.name}</span>
                </div>
            ))}
        </div>
    );
}