import Chart from 'chart.js/auto';

export const renderCharts = (sleepRecords, sleepChartRef, sleepLineChartRef, sleepAreaChartRef) => {
    const dates = sleepRecords.map(record => record.date);
    const durations = sleepRecords.map(record => Number(record.sleepDuration).toFixed(1));

    // Destroy existing charts if they exist
    [sleepChartRef, sleepLineChartRef, sleepAreaChartRef].forEach(ref => ref.current?.destroy());

    // Bar chart
    const sleepChartEl = document.getElementById('sleepChart');
    if (sleepChartEl) {
        const ctx = sleepChartEl.getContext('2d');
        sleepChartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Sleep Duration (hours)',
                    data: durations,
                    backgroundColor: 'rgba(107, 78, 113, 0.6)',
                    borderColor: 'rgba(107, 78, 113, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Hours' } },
                    x: { title: { display: true, text: 'Date' } }
                },
                plugins: {
                    title: { display: true, text: 'Sleep Duration by Date' }
                }
            }
        });
    }

    // Line chart
    const sleepLineChartEl = document.getElementById('sleepLineChart');
    if (sleepLineChartEl) {
        const ctx = sleepLineChartEl.getContext('2d');
        sleepLineChartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Sleep Duration Trend',
                    data: durations,
                    backgroundColor: 'rgba(107, 78, 113, 0.2)',
                    borderColor: 'rgba(107, 78, 113, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointBackgroundColor: 'rgba(107, 78, 113, 1)',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Hours' } },
                    x: { title: { display: true, text: 'Date' } }
                },
                plugins: {
                    title: { display: true, text: 'Sleep Duration Trend Over Time' }
                }
            }
        });
    }

    // Area chart
    const sleepAreaChartEl = document.getElementById('sleepAreaChart');
    if (sleepAreaChartEl) {
        const ctx = sleepAreaChartEl.getContext('2d');
        const optimalData = durations.map(d => (d >= 7 && d <= 9 ? d : null));
        const lowData = durations.map(d => (d < 7 ? d : null));
        const highData = durations.map(d => (d > 9 ? d : null));

        sleepAreaChartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    { label: 'Optimal Sleep (7-9h)', data: optimalData, backgroundColor: 'rgba(75, 192, 192, 0.4)', borderColor: 'rgba(75, 192, 192, 1)', fill: true },
                    { label: 'Sleep Deficit (<7h)', data: lowData, backgroundColor: 'rgba(255, 99, 132, 0.4)', borderColor: 'rgba(255, 99, 132, 1)', fill: true },
                    { label: 'Oversleep (>9h)', data: highData, backgroundColor: 'rgba(54, 162, 235, 0.4)', borderColor: 'rgba(54, 162, 235, 1)', fill: true }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Hours' }, suggestedMin: 4, suggestedMax: 12 },
                    x: { title: { display: true, text: 'Date' } }
                },
                plugins: {
                    title: { display: true, text: 'Sleep Quality Overview' }
                }
            }
        });
    }
};

export const calculateAverageTime = (times) => {
    if (!times || times.length === 0) return "N/A";
    const totalMinutes = times.reduce((total, time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return total + hours * 60 + minutes;
    }, 0);
    const avgMinutes = totalMinutes / times.length;
    const avgHours = Math.floor(avgMinutes / 60) % 24;
    const avgMins = Math.round(avgMinutes % 60);
    return `${String(avgHours).padStart(2, '0')}:${String(avgMins).padStart(2, '0')}`;
};
