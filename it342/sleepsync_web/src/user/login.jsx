import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/users/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
                method: "GET",
            });

            if (response.ok) {
                const user = await response.json();
                if (user && user.userID) {
                    localStorage.setItem("userId", user.userID);
                    setError("");
                    navigate("/user/landing");
                } else {
                    setError("Login failed. User ID not found.");
                }
            } else if (response.status === 401) {
                setError("Invalid email or password.");
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("An error occurred. Please try again.");
        }
    };

    const handleGoogleRedirect = () => {
        window.location.href = "https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&client_id=641212688069-2tl0q9ei38toetff97rcic46agujsiab.apps.googleusercontent.com&scope=email%20profile&state=C-DQirmvwVNMjc2zdFQIDSPt6iOEpyC8SM0revx1aqA%3D&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flogin%2Foauth2%2Fcode%2Fgoogle&service=lso&o2v=2&ddm=1&flowName=GeneralOAuthFlow";
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", margin: 0, position: "relative", overflow: "hidden", color: "white" }}>
            {/* Background layers */}
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
            {/* Login Container */}
            <div style={{
                maxWidth: "400px", width: "100%", margin: "auto",
                position: "absolute", top: "25%", left: "38%",
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

                <h1 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2.2rem", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>Welcome Back</h1>

                {error && <p style={{ color: "#ff6b6b", fontSize: "0.9rem", marginBottom: "1rem", textAlign: "center" }}>{error}</p>}

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <label style={{ color: "white", fontWeight: "500", marginBottom: "8px", display: "block" }}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        <i className="fas fa-sign-in-alt" style={{ marginRight: "8px" }}></i>
                        Login
                    </button>
                </form>

                <button
                    onClick={handleGoogleRedirect}
                    style={{
                        marginTop: "20px", padding: "14px", background: "#4285F4", color: "white",
                        border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "1.1rem", fontWeight: "500",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
                    }}
                >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" alt="Google Logo" style={{ width: "20px", height: "20px" }} />
                    Sign in or Continue with Google
                </button>

                <div style={{
                    marginTop: "25px", textAlign: "center", padding: "15px",
                    background: "rgba(255,255,255,0.1)", borderRadius: "10px", color: "white"
                }}>
                    <p>Don't have an account? <Link to="/register" style={{
                        color: "white", textDecoration: "none", fontWeight: "500", padding: "4px 8px", borderRadius: "4px"
                    }}>Register here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;