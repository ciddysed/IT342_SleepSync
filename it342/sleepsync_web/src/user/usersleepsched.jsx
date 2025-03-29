import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserSleepSchedule = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [sleepSchedule, setSleepSchedule] = useState({
        isActive: true,
        isStaff: false,
        sleepGoals: "",
        sleepTime: "",
        wakeTime: "",
        preferredWakeTime: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Check if the user is logged in
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
            navigate("/login"); // Redirect to login if not logged in
        } else {
            setUserId(storedUserId);
            fetchSleepSchedule(storedUserId);
        }
    }, [navigate]);

    const fetchSleepSchedule = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/sleep-schedules/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    setSleepSchedule(data[0]); // Assuming only one schedule per user
                    setIsEditing(true);
                }
            }
        } catch (error) {
            console.error("Error fetching sleep schedule:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSleepSchedule({ ...sleepSchedule, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isEditing
                ? `http://localhost:8080/api/sleep-schedules/user/${userId}/${sleepSchedule.id}`
                : `http://localhost:8080/api/sleep-schedules/user/${userId}`;
            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sleepSchedule),
            });

            if (response.ok) {
                setMessage(isEditing ? "Sleep schedule updated successfully!" : "Sleep schedule created successfully!");
            } else {
                setMessage("Failed to save sleep schedule.");
            }
        } catch (error) {
            console.error("Error saving sleep schedule:", error);
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>{isEditing ? "Edit Sleep Schedule" : "Create Sleep Schedule"}</h2>
            {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                    <label>Sleep Goals:</label>
                    <input
                        type="text"
                        name="sleepGoals"
                        value={sleepSchedule.sleepGoals}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "0.5rem", borderRadius: "5px" }}
                    />
                </div>
                <div>
                    <label>Sleep Time:</label>
                    <input
                        type="time"
                        name="sleepTime"
                        value={sleepSchedule.sleepTime}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "0.5rem", borderRadius: "5px" }}
                    />
                </div>
                <div>
                    <label>Wake Time:</label>
                    <input
                        type="time"
                        name="wakeTime"
                        value={sleepSchedule.wakeTime}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "0.5rem", borderRadius: "5px" }}
                    />
                </div>
                <div>
                    <label>Preferred Wake Time:</label>
                    <input
                        type="time"
                        name="preferredWakeTime"
                        value={sleepSchedule.preferredWakeTime}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "0.5rem", borderRadius: "5px" }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: "0.75rem",
                        backgroundColor: "#3182ce",
                        color: "white",
                        fontWeight: "bold",
                        borderRadius: "5px",
                        cursor: "pointer",
                        border: "none",
                    }}
                >
                    {isEditing ? "Update Schedule" : "Create Schedule"}
                </button>
            </form>
        </div>
    );
};

export default UserSleepSchedule;
