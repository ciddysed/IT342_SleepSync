import React, { useState, useEffect, useCallback } from "react";
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

    const fetchSleepSchedule = useCallback(async (userId) => {
        console.log("Fetching sleep schedule for userId:", userId); // Log userId before API call
        try {
            const response = await fetch(`https://sleepsync-app-latest.onrender.com/api/sleep-schedules/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched sleep schedule data:", data); // Log fetched data for verification
                if (data.length > 0) {
                    setSleepSchedule(data[0]); // Assuming only one schedule per user
                    setIsEditing(true);
                } else {
                    console.log("No sleep schedule found. Creating a new one."); // Log creation of new schedule
                    await createDefaultSleepSchedule(userId); // Create a default sleep schedule
                }
            } else {
                console.error("Failed to fetch sleep schedule. Status:", response.status);
            }
        } catch (error) {
            console.error("Error fetching sleep schedule:", error);
        }
    }, []); // Empty dependency array ensures the function is stable

    useEffect(() => {
        // Check if the user is logged in
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId || storedUserId === "undefined" || storedUserId === null) { // Handle undefined or null userId
            console.error("Invalid userId retrieved from localStorage:", storedUserId); // Log error
            localStorage.removeItem("userId"); // Clear invalid userId from localStorage
            navigate("/login"); // Redirect to login if not logged in
        } else {
            console.log("Retrieved userId from localStorage:", storedUserId); // Log userId for verification
            setUserId(storedUserId);
            fetchSleepSchedule(storedUserId); // Call the stable function
        }
    }, [navigate, fetchSleepSchedule]); // Add fetchSleepSchedule to the dependency array

    const createDefaultSleepSchedule = async (userId) => {
        const defaultSchedule = {
            isActive: true,
            isStaff: false,
            sleepGoals: "Default sleep goal",
            sleepTime: "22:00",
            wakeTime: "06:00",
            preferredWakeTime: "06:30",
        };
        try {
            const response = await fetch(`https://sleepsync-app-latest.onrender.com/api/sleep-schedules/user/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(defaultSchedule),
            });
            if (response.ok) {
                const createdSchedule = await response.json();
                console.log("Created default sleep schedule:", createdSchedule); // Log created schedule
                setSleepSchedule(createdSchedule);
                setIsEditing(true);
            } else {
                console.error("Failed to create default sleep schedule. Status:", response.status);
            }
        } catch (error) {
            console.error("Error creating default sleep schedule:", error);
        }
    };

    const recordSleepTime = async (userId, sleepTime, wakeTime) => {
        const sleepTrackData = {
            userId,
            sleepTime,
            wakeTime,
        };

        try {
            const response = await fetch("http://localhost:8080/sleep-tracks/record_sleep_time", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sleepTrackData),
            });

            if (response.ok) {
                console.log("Sleep time recorded successfully.");
            } else {
                console.error("Failed to record sleep time. Status:", response.status);
            }
        } catch (error) {
            console.error("Error recording sleep time:", error);
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
                // Call recordSleepTime after successfully saving the schedule
                await recordSleepTime(userId, sleepSchedule.sleepTime, sleepSchedule.wakeTime);
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
