package com.it342.sleepsync.Entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ProgressTracking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long progressId;

    private LocalDate date;
    private String goal;
    private Double progressValue;

    // Getters
    public Long getProgressId() {
        return progressId;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getGoal() {
        return goal;
    }

    public Double getProgressValue() {
        return progressValue;
    }

    // Setters
    public void setProgressId(Long progressId) {
        this.progressId = progressId;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public void setProgressValue(Double progressValue) {
        this.progressValue = progressValue;
    }

    // No-args constructor
    public ProgressTracking() {
    }
}
