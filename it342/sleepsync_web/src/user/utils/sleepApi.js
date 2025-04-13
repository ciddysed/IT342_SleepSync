export const recordSleepTime = async ({ sleepDate, wakeDate, sleepTime, wakeTime, userId }) => {
    const sleepDateTime = new Date(`${sleepDate}T${sleepTime}:00`);
    let wakeDateTime = new Date(`${wakeDate}T${wakeTime}:00`);
    if (wakeDateTime <= sleepDateTime) wakeDateTime.setDate(wakeDateTime.getDate() + 1);

    const duration = (wakeDateTime - sleepDateTime) / (1000 * 60 * 60);
    const sleepTrackData = { sleep_time: sleepTime, wake_time: wakeTime, date: sleepDate, wake_date: wakeDate, sleep_duration: duration };

    try {
        const response = await fetch(`http://localhost:8080/sleep-tracks/record_sleep_time/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sleepTrackData),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status === "success") {
                return { success: true, taskCards: data.task_cards, duration };
            } else {
                return { success: false, errorMessage: "Failed to record sleep time." };
            }
        } else {
            return { success: false, errorMessage: "An error occurred while recording sleep time." };
        }
    } catch (error) {
        console.error("Error recording sleep time:", error);
        return { success: false, errorMessage: "An error occurred while recording sleep time." };
    }
};

export const fetchSleepRecords = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8080/sleep-tracks/${userId}`);
        if (response.ok) {
            const data = await response.json();
            return { success: true, records: data };
        } else {
            return { success: false, errorMessage: "An error occurred while fetching sleep records." };
        }
    } catch (error) {
        console.error("Error fetching sleep records:", error);
        return { success: false, errorMessage: "An error occurred while fetching sleep records." };
    }
};

export const deleteSleepRecord = async (recordId) => {
    try {
        const response = await fetch(`http://localhost:8080/sleep-tracks/${recordId}`, { method: "DELETE" });
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, errorMessage: "An error occurred while deleting the record." };
        }
    } catch (error) {
        console.error("Error deleting sleep record:", error);
        return { success: false, errorMessage: "An error occurred while deleting the record." };
    }
};
