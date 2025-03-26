package com.it342.sleepsync.Entity;

import java.time.LocalDate;

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
    private Double sleepDuration;
    private String sleepQuality;
    private String sleepStages;
    private Integer scheduleId;

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

    public Double getSleepDuration() {
        return sleepDuration;
    }

    public String getSleepQuality() {
        return sleepQuality;
    }

    public String getSleepStages() {
        return sleepStages;
    }

    public Integer getScheduleId() {
        return scheduleId;
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

    public void setSleepDuration(Double sleepDuration) {
        this.sleepDuration = sleepDuration;
    }

    public void setSleepQuality(String sleepQuality) {
        this.sleepQuality = sleepQuality;
    }

    public void setSleepStages(String sleepStages) {
        this.sleepStages = sleepStages;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
    }

    // No-args constructor
    public SleepTrack() {
    }
}
