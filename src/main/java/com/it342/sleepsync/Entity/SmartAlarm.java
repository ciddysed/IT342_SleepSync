package com.it342.sleepsync.Entity;

import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class SmartAlarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alarmID;

    private LocalTime alarmTime;

    // Getters
    public Long getAlarmID() {
        return alarmID;
    }

    public LocalTime getAlarmTime() {
        return alarmTime;
    }

    // Setters
    public void setAlarmID(Long alarmID) {
        this.alarmID = alarmID;
    }

    public void setAlarmTime(LocalTime alarmTime) {
        this.alarmTime = alarmTime;
    }

    // No-args constructor
    public SmartAlarm() {
    }
}
