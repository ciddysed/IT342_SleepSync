package com.it342.sleepsync.Entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class SleepTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trackingId;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    private LocalDate date;
    private String sleepTime; // Changed from sleepQuality
    private String wakeTime; // Changed from sleepStages
    private Double sleepDuration; // Retained as is
    private Integer scheduleId;

    @Column(columnDefinition = "TEXT")
    private String tasks; // Stores tasks as a JSON string

    // Getters
    public Long getTrackingId() {
        return trackingId;
    }

    public User getUser() {
        return user;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getSleepTime() {
        return sleepTime;
    }

    public String getWakeTime() {
        return wakeTime;
    }

    public Double getSleepDuration() {
        return sleepDuration;
    }

    public Integer getScheduleId() {
        return scheduleId;
    }

    public String getTasks() {
        return tasks;
    }

    // Setters
    public void setTrackingId(Long trackingId) {
        this.trackingId = trackingId;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setSleepTime(String sleepTime) {
        this.sleepTime = sleepTime;
    }

    public void setWakeTime(String wakeTime) {
        this.wakeTime = wakeTime;
    }

    public void setSleepDuration(Double sleepDuration) {
        this.sleepDuration = sleepDuration;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
    }

    public void setTasks(String tasks) {
        this.tasks = tasks;
    }

    // No-args constructor
    public SleepTrack() {
    }
}