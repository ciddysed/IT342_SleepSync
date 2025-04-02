import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./user/login";
import Register from "./user/register";
import UserSleepSchedule from "./user/usersleepsched";
import Landing from "./user/landing";
import RecordSleep from "./user/RecordSleep";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user/sleep-schedule" element={<UserSleepSchedule />} />
                <Route path="/user/landing" element={<Landing />} />
                <Route path="/user/record-sleep" element={<RecordSleep />} />
                <Route path="*" element={<div>Page not found</div>} /> {/* Fallback route */}
            </Routes>
        </Router>
    );
};

export default App;
