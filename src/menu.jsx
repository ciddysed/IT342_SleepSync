import React from "react";
import { useNavigate } from "react-router-dom";

const SleepSyncMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">SleepSync</h1>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-md" onClick={() => navigate('/login')}>Logout</button>
      </nav>
      
      {/* Hero Section */}
      <div className="text-center py-10">
        <h2 className="text-3xl font-semibold text-gray-800">Welcome to SleepSync</h2>
        <p className="text-gray-600 mt-2">Optimize your sleep schedule and improve your rest.</p>
      </div>
      
      {/* Menu Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-3/4">
        <button className="bg-blue-500 text-white px-6 py-4 rounded-lg text-lg w-full shadow-md hover:bg-blue-700" onClick={() => navigate('/personalized-sleep-schedule')}>
          Personalized Sleep Schedule
        </button>
        <button className="bg-blue-500 text-white px-6 py-4 rounded-lg text-lg w-full shadow-md hover:bg-blue-700" onClick={() => navigate('/sleep-tracking-analysis')}>
          Sleep Tracking & Analysis
        </button>
        <button className="bg-blue-500 text-white px-6 py-4 rounded-lg text-lg w-full shadow-md hover:bg-blue-700" onClick={() => navigate('/smart-alarm')}>
          Smart Alarm
        </button>
        <button className="bg-blue-500 text-white px-6 py-4 rounded-lg text-lg w-full shadow-md hover:bg-blue-700" onClick={() => navigate('/relaxation-wind-down')}>
          Relaxation & Wind-Down Routine
        </button>
        <button className="bg-blue-500 text-white px-6 py-4 rounded-lg text-lg w-full shadow-md hover:bg-blue-700" onClick={() => navigate('/sleep-goal-setting')}>
          Sleep Goal Setting & Progress Tracking
        </button>
        <button className="bg-blue-500 text-white px-6 py-4 rounded-lg text-lg w-full shadow-md hover:bg-blue-700" onClick={() => navigate('/personalized-sleep-tips')}>
          Personalized Sleep Tips
        </button>
      </div>
    </div>
  );
};

export default SleepSyncMenu;

// Ensure that this component is correctly imported and used in the routing configuration
