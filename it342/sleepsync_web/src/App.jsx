import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./user/login";
import Register from "./user/register";
import UserSleepSchedule from "./user/usersleepsched";
import Landing from "./user/landing";
import RecordSleep from "./user/RecordSleep";
import UserSleepProgress from "./user/UserSleepProgress"; // Import UserSleepProgress
import AlarmClock from "./user/components/AlarmClock";
import SmartAlarm from "./user/SmartAlarm"; // Import SmartAlarm
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user/sleep-schedule" element={<ProtectedRoute><UserSleepSchedule /></ProtectedRoute>} />
                <Route path="/user/landing" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
                <Route path="/user/record-sleep" element={<ProtectedRoute><RecordSleep /></ProtectedRoute>} />
                <Route path="/user/sleep-progress" element={<ProtectedRoute><UserSleepProgress /></ProtectedRoute>} /> {/* Add UserSleepProgress path */}
                <Route path="/user/alarm-clock" element={<AlarmClock />} />
                <Route path="/user/smart-alarm" element={<ProtectedRoute><SmartAlarm /></ProtectedRoute>} /> {/* Add SmartAlarm route */}
                <Route path="*" element={<div>Page not found</div>} /> {/* Fallback route */}
            </Routes>
        </Router>
    );
};

export default App;
