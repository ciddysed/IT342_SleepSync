import React from 'react';

const AlarmForm = ({ editMode, alarmData, onSave, onCancel, alarmSounds }) => {
    const [formData, setFormData] = React.useState(alarmData);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="alarm-form">
            <h3>{editMode ? 'Edit Alarm' : 'Add New Alarm'}</h3>
            <div className="form-group">
                <label>Time:</label>
                <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Date:</label>
                <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Label:</label>
                <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => handleChange('label', e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Sound:</label>
                <select
                    value={formData.sound}
                    onChange={(e) => handleChange('sound', e.target.value)}
                >
                    {alarmSounds.map(sound => (
                        <option key={sound.id} value={sound.id}>
                            {sound.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-actions">
                <button onClick={() => onSave(formData)} className="save-btn">Save</button>
                <button onClick={onCancel} className="cancel-btn">Cancel</button>
            </div>
        </div>
    );
};

export default AlarmForm;
