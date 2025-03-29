import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Ensure useNavigate is imported

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Hook for navigation

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;
        try {
            const response = await fetch(
                `http://localhost:8080/users/login?username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
                { method: "GET" }
            );
            if (response.ok) {
                const userData = await response.json();
                localStorage.setItem("userId", userData.userID); // Store userId in localStorage
                setError("");
                navigate("/user/sleep-schedule"); // Navigate to sleep schedule page
            } else if (response.status === 401) {
                setError("Invalid username or password.");
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(to bottom right, #1a202c, #2d3748)" }}>
            <div style={{ backgroundColor: "#2d3748", padding: "2rem", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", width: "400px" }}>
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}>SleepSync</h1>
                </div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "white", marginBottom: "1rem", textAlign: "center" }}>Welcome Back</h2>
                {error && <p style={{ color: "#f56565", fontSize: "0.875rem", marginBottom: "1rem", textAlign: "center" }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                        <label style={{ color: "white", display: "block", marginBottom: "0.25rem" }}>Email:</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "0.5rem", borderRadius: "5px", backgroundColor: "#4a5568", color: "white", border: "none", outline: "none" }}
                        />
                    </div>
                    <div>
                        <label style={{ color: "white", display: "block", marginBottom: "0.25rem" }}>Password:</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "0.5rem", borderRadius: "5px", backgroundColor: "#4a5568", color: "white", border: "none", outline: "none" }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{ width: "100%", padding: "0.75rem", backgroundColor: "#3182ce", color: "white", fontWeight: "bold", borderRadius: "5px", cursor: "pointer", border: "none", textAlign: "center" }}
                    >
                        &#10148; Login
                    </button>
                </form>
                <p style={{ color: "#cbd5e0", fontSize: "0.875rem", marginTop: "1rem", textAlign: "center" }}>
                    Don't have an account? <Link to="./user/register" style={{ color: "#63b3ed", textDecoration: "underline" }}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
