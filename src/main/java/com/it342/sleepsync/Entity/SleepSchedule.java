package com.it342.sleepsync.Entity;

import java.time.LocalTime;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
public class SleepSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean isActive;
    private boolean isStaff;
    private String sleepGoals;
    private LocalTime sleepTime;
    private LocalTime wakeTime;
    private LocalTime preferredWakeTime;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // Ensure column name matches `userId` in `User`
    private User user;

    // Getters
    public Long getId() {
        return id;
    }

    public boolean getIsActive() {
        return isActive;
    }

    public boolean getIsStaff() {
        return isStaff;
    }

    public String getSleepGoals() {
        return sleepGoals;
    }

    public LocalTime getSleepTime() {
        return sleepTime;
    }

    public LocalTime getWakeTime() {
        return wakeTime;
    }

    public LocalTime getPreferredWakeTime() {
        return preferredWakeTime;
    }

    public User getUser() {
        return user;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }

    public void setIsStaff(boolean isStaff) {
        this.isStaff = isStaff;
    }

    public void setSleepGoals(String sleepGoals) {
        this.sleepGoals = sleepGoals;
    }

    public void setSleepTime(LocalTime sleepTime) {
        this.sleepTime = sleepTime;
    }

    public void setWakeTime(LocalTime wakeTime) {
        this.wakeTime = wakeTime;
    }

    public void setPreferredWakeTime(LocalTime preferredWakeTime) {
        this.preferredWakeTime = preferredWakeTime;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // No-args constructor
    public SleepSchedule() {
    }
}