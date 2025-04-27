import React from 'react';
import { Edit, BellRing, BellOff } from 'lucide-react';

const AlarmList = ({ alarms, onEdit, onDelete, onToggle }) => {
    return (
        <div className="alarms-list">
            {alarms.length === 0 ? (
                <p className="no-alarms">No alarms set. Add an alarm to get started.</p>
            ) : (
                alarms.map(alarm => (
                    <div key={alarm.id} className={`alarm-item ${alarm.active ? 'active' : 'inactive'}`}>
                        <div className="alarm-info">
                            <span className="alarm-time">{alarm.time}</span>
                            <span className="alarm-label">{alarm.label}</span>
                        </div>
                        <div className="alarm-controls">
                            <button onClick={() => onEdit(alarm)}><Edit size={20} /></button>
                            <button onClick={() => onToggle(alarm.id)}>
                                {alarm.active ? <BellRing size={20} /> : <BellOff size={20} />}
                            </button>
                            <button onClick={() => onDelete(alarm.id)}>Delete</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default AlarmList;
