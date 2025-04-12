// SleepModal.jsx
import React from 'react';

const SleepModal = ({ isModalOpen, closeModal, activeTab, setActiveTab, renderTabContent }) => {
    if (!isModalOpen) return null;
    
    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Your Sleep Progress</h2>
                    <span className="close" onClick={closeModal}>&times;</span>
                </div>
                
                <div className="tabs">
                    <button 
                        className={`tab-button ${activeTab === 'durationOverTime' ? 'active' : ''}`}
                        onClick={() => setActiveTab('durationOverTime')}
                    >
                        Duration Overview
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'durationTrend' ? 'active' : ''}`}
                        onClick={() => setActiveTab('durationTrend')}
                    >
                        Sleep Trends
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'patternOverview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('patternOverview')}
                    >
                        Sleep Patterns
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'analysisReport' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analysisReport')}
                    >
                        Analysis
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'sleepRecords' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sleepRecords')}
                    >
                        Records
                    </button>
                </div>
                
                <div className="tab-content">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default SleepModal;