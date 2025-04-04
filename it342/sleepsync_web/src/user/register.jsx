import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert("Registration successful!");
                navigate("/login");
            } else {
                const errorData = await response.json();
                console.error("Error response:", errorData);
                setError("Registration failed.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", margin: 0, position: "relative", overflow: "hidden",  color: "white" }}>
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

            {/* Register Container */}
            <div style={{
                maxWidth: "400px", width: "100%", margin: "auto",
                position: "absolute", top: "15%", left: "38%",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "50px", borderRadius: "25px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                animation: "fadeIn 1s ease-in-out",
                zIndex: 1
            }}>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        background: "none", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: "100%", marginBottom: "30px", gap: "8px"
                    }}
                >
                    <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
                        <path d="M19 7h-8v8H3V7H1v10h2v3c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-3h2V7h-2zM7 19h10v-6H7v6z" />
                    </svg>
                    <span style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>SleepSync</span>
                </button>

                <h1 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2rem", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>Create an Account</h1>

                {error && <p style={{ color: "#ff6b6b", fontSize: "0.9rem", marginBottom: "1rem", textAlign: "center" }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <label style={{ color: "white", fontWeight: "500", marginBottom: "8px", display: "block" }}>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            style={{
                                width: "90%", padding: "12px 16px", background: "rgba(255,255,255,0.1)",
                                border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "white"
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ color: "white", fontWeight: "500", marginBottom: "8px", display: "block" }}>First Name:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            required
                            style={{
                                width: "90%", padding: "12px 16px", background: "rgba(255,255,255,0.1)",
                                border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "white"
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ color: "white", fontWeight: "500", marginBottom: "8px", display: "block" }}>Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                            required
                            style={{
                                width: "90%", padding: "12px 16px", background: "rgba(255,255,255,0.1)",
                                border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "white"
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ color: "white", fontWeight: "500", marginBottom: "8px", display: "block" }}>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            style={{
                                width: "90%", padding: "12px 16px", background: "rgba(255,255,255,0.1)",
                                border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "white"
                            }}
                        />
                    </div>
                    <button type="submit" style={{
                        padding: "14px", background: "rgba(255,255,255,0.1)", color: "white",
                        border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "1.1rem", fontWeight: "500"
                    }}>
                        <i className="fas fa-user-plus" style={{ marginRight: "8px" }}></i>
                        Register
                    </button>
                </form>

                <div style={{
                    marginTop: "25px", textAlign: "center", padding: "15px",
                    background: "rgba(255,255,255,0.1)", borderRadius: "10px", color: "white"
                }}>
                    <p>Already have an account? <Link to="/login" style={{
                        color: "white", textDecoration: "none", fontWeight: "500", padding: "4px 8px", borderRadius: "4px"
                    }}>Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;