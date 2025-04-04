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
        <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", margin: 0, position: "relative", overflow: "hidden", backgroundColor: "#1a1a2e", color: "white" }}>
            {/* Background Layers */}
            <div style={{
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                background: "radial-gradient(circle at 50% 50%, #2c1810 0%, #1a1a2e 100%)",
                zIndex: -2
            }} />
            <div style={{
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                background: `
                    radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 0%, transparent 50%),
                    radial-gradient(circle at 70% 60%, rgba(255,255,255,0.05) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
                zIndex: -1,
                animation: "drift 30s infinite linear"
            }} />
            <div style={{
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                background: `
                    radial-gradient(1.5px 1.5px at 20px 30px, white, rgba(0,0,0,0)),
                    radial-gradient(1.5px 1.5px at 40px 70px, #ffd700, rgba(0,0,0,0)),
                    radial-gradient(1.5px 1.5px at 50px 160px, white, rgba(0,0,0,0)),
                    radial-gradient(1.5px 1.5px at 90px 40px, #ffd700, rgba(0,0,0,0)),
                    radial-gradient(1.5px 1.5px at 130px 80px, white, rgba(0,0,0,0)),
                    radial-gradient(1.5px 1.5px at 160px 120px, #ffd700, rgba(0,0,0,0))`,
                zIndex: -1,
                animation: "twinkle 4s infinite"
            }} />

            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 0.3; }
                }
                @keyframes drift {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(100%); }
                }
                `}
            </style>

            {/* Landing Container */}
            <div style={{
                maxWidth: "400px", width: "100%", margin: "auto",
                position: "absolute", top: "20%", left: "38%",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "50px", borderRadius: "25px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                animation: "fadeIn 1s ease-in-out",
                zIndex: 1, textAlign: "center"
            }}>
                <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px", textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
                    Welcome to SleepSync
                </h1>
                <p style={{ color: "#d3d3d3", fontSize: "1rem", marginBottom: "30px" }}>
                    Manage your sleep schedule efficiently.
                </p>

                <button
                    onClick={handleNavigate}
                    style={{
                        padding: "14px", width: "100%", background: "rgba(255,255,255,0.1)",
                        color: "white", fontWeight: "500", borderRadius: "10px",
                        border: "none", cursor: "pointer", fontSize: "1rem", marginBottom: "15px"
                    }}
                >
                    Go to Sleep Schedule
                </button>

                <button
                    onClick={handleNavigateToRecordSleep}
                    style={{
                        padding: "14px", width: "100%", background: "rgba(255,255,255,0.1)",
                        color: "white", fontWeight: "500", borderRadius: "10px",
                        border: "none", cursor: "pointer", fontSize: "1rem"
                    }}
                >
                    Start Record Sleep
                </button>
            </div>
        </div>
    );
};

export default Landing;