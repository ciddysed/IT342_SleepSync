import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/user/sleep-schedule");
    };

    const handleNavigateToRecordSleep = () => {
        navigate("/user/record-sleep");
    };

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(to bottom right, #1a202c, #2d3748)" }}>
            <div style={{ backgroundColor: "#2d3748", padding: "2rem", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", textAlign: "center" }}>
                <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white", marginBottom: "1rem" }}>Welcome to SleepSync</h1>
                <p style={{ color: "#cbd5e0", fontSize: "1rem", marginBottom: "2rem" }}>Manage your sleep schedule efficiently.</p>
                <button
                    onClick={handleNavigate}
                    style={{ padding: "0.75rem 1.5rem", backgroundColor: "#3182ce", color: "white", fontWeight: "bold", borderRadius: "5px", cursor: "pointer", border: "none", marginBottom: "1rem" }}
                >
                    Go to Sleep Schedule
                </button>
                <button
                    onClick={handleNavigateToRecordSleep}
                    style={{ padding: "0.75rem 1.5rem", backgroundColor: "#38a169", color: "white", fontWeight: "bold", borderRadius: "5px", cursor: "pointer", border: "none" }}
                >
                    Start Record Sleep
                </button>
            </div>
        </div>
    );
};

export default Landing;
