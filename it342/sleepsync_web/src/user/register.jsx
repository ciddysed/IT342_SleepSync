import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
    });

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
            } else {
                const errorData = await response.json();
                console.error("Error response:", errorData);
                alert("Registration failed.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="dynamic-gradient">
            <div style={{ backgroundColor: "#2d3748", padding: "2rem", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", width: "400px" }}>
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}>SleepSync</h1>
                </div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "white", marginBottom: "1rem", textAlign: "center" }}>Create an Account</h2>
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
                        <label style={{ color: "white", display: "block", marginBottom: "0.25rem" }}>First Name:</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Enter your first name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "0.5rem", borderRadius: "5px", backgroundColor: "#4a5568", color: "white", border: "none", outline: "none" }}
                        />
                    </div>
                    <div>
                        <label style={{ color: "white", display: "block", marginBottom: "0.25rem" }}>Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Enter your last name"
                            value={formData.lastName}
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
                        &#10148; Register
                    </button>
                </form>
                <p style={{ color: "#cbd5e0", fontSize: "0.875rem", marginTop: "1rem", textAlign: "center" }}>
                    Already have an account? <Link to="/login" style={{ color: "#63b3ed", textDecoration: "underline" }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
