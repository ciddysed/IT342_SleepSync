// filepath: src/user/UserSleepProgress.jsx
import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";

// Register Chart.js modules
ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    annotationPlugin
);

const UserSleepProgress = () => {
    const userId = localStorage.getItem("userId");
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [sleepData, setSleepData] = useState([]);

    const MONTHS = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Fetch available years
    useEffect(() => {
        const fetchYears = async () => {
            if (!userId) return;
            try {
                const res = await fetch(`http://localhost:8080/sleep-tracks/user/${userId}/years`);
                if (res.ok) setYears(await res.json());
                else console.error("Failed to fetch years:", await res.text());
            } catch (err) {
                console.error("Error fetching years:", err);
            }
        };
        fetchYears();
    }, [userId]);

    // Fetch sleep data by year and month
    useEffect(() => {
        const fetchSleepData = async () => {
            if (!userId) return;
            try {
                const res = await fetch(`http://localhost:8080/sleep-tracks/user/${userId}?year=${selectedYear}&month=${selectedMonth + 1}`);
                if (res.ok) setSleepData(await res.json());
                else console.error("Failed to fetch sleep data:", await res.text());
            } catch (err) {
                console.error("Error fetching sleep data:", err);
            }
        };
        fetchSleepData();
    }, [userId, selectedYear, selectedMonth]);

    // Chart configuration
    const chartData = {
        datasets: [{
            label: "Sleep Duration (hours)",
            data: sleepData.map(entry => ({
                x: new Date(entry.date).getDate(),
                y: entry.sleepDuration,
            })),
            borderColor: "#4bc0c0",
            backgroundColor: "rgba(75,192,192,0.2)",
            fill: true,
            tension: 0.3,
        }],
    };

    const annotations = [7, 14, 21].reduce((acc, day, idx) => {
        acc[`week${idx + 1}`] = {
            type: "line",
            xMin: day,
            xMax: day,
            borderColor: "rgba(0, 0, 0, 0.3)",
            borderWidth: 1,
            label: {
                content: `WEEK ${idx + 2}`,
                enabled: true,
                position: "start",
                backgroundColor: "rgba(255,255,255,0.8)",
                color: "#333",
                font: {
                    size: 12,
                    weight: "bold",
                },
            },
        };
        return acc;
    }, {});

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: "linear",
                min: 1,
                max: 28,
                title: { display: true, text: "Day of Month" },
                ticks: { stepSize: 1 },
                grid: {
                    color: context => [7, 14, 21].includes(context.tick.value)
                        ? "rgba(0,0,0,0.3)"
                        : "rgba(0,0,0,0.1)",
                },
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: "Sleep Duration (hrs)" },
            },
        },
        plugins: {
            legend: { display: true },
            annotation: { annotations },
        },
    };

    return (
        <div style={styles.container}>
            {/* Backgrounds */}
            <div style={styles.bgBase} />
            <div style={styles.bgGradient} />
            <div style={styles.bgStars} />
            <style>{animations}</style>

            {/* Chart Box */}
            <div style={styles.chartWrapper}>
                <h1 style={styles.title}>User Sleep Progress</h1>

                <div style={styles.filters}>
                    <label htmlFor="year-select">Year:</label>
                    <select id="year-select" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <ul style={styles.monthTabs}>
                    {MONTHS.map((month, index) => (
                        <li
                            key={index}
                            style={{
                                ...styles.monthItem,
                                fontWeight: selectedMonth === index ? "bold" : "normal",
                                textDecoration: selectedMonth === index ? "underline" : "none"
                            }}
                            onClick={() => setSelectedMonth(index)}
                        >
                            {month}
                        </li>
                    ))}
                </ul>

                <div style={{ height: 400 }}>
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

// 💅 Styling
const styles = {
    container: {
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        margin: 0,
        position: "relative",
        overflow: "hidden",
        color: "white",
    },
    bgBase: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "radial-gradient(circle at 50% 50%, #2c1810 0%, #1a1a2e 100%)",
        zIndex: -3,
    },
    bgGradient: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: `
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(255,255,255,0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
        zIndex: -2,
        animation: "drift 30s infinite linear",
    },
    bgStars: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: `
            radial-gradient(1.5px 1.5px at 20px 30px, white, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 40px 70px, #ffd700, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 50px 160px, white, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 90px 40px, #ffd700, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 130px 80px, white, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 160px 120px, #ffd700, rgba(0,0,0,0))`,
        zIndex: -1,
        animation: "twinkle 4s infinite",
    },
    chartWrapper: {
        maxWidth: "800px",
        width: "90%",
        margin: "auto",
        position: "relative",
        top: "10%",
        background: "rgba(255, 255, 255, 0.1)",
        padding: "50px",
        borderRadius: "25px",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        animation: "fadeIn 1s ease-in-out",
        zIndex: 1,
    },
    title: {
        textAlign: "center",
        marginBottom: "30px",
        fontSize: "2.2rem",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    },
    filters: {
        marginBottom: "20px",
        textAlign: "center",
    },
    monthTabs: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        listStyle: "none",
        padding: 0,
        margin: "10px 0 20px",
        gap: "10px",
    },
    monthItem: {
        cursor: "pointer",
        padding: "5px 10px",
        borderRadius: "8px",
        transition: "all 0.2s",
    },
};

const animations = `
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
`;

export default UserSleepProgress;
