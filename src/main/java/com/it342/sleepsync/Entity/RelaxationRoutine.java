package com.it342.sleepsync.Entity;

import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class RelaxationRoutine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long routineID;

    private String routineType;
    private LocalTime routineStartTime;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    // Getters
    public Long getRoutineID() {
        return routineID;
    }

    public String getRoutineType() {
        return routineType;
    }

    public LocalTime getRoutineStartTime() {
        return routineStartTime;
    }

    public User getUser() {
        return user;
    }

    // Setters
    public void setRoutineID(Long routineID) {
        this.routineID = routineID;
    }

    public void setRoutineType(String routineType) {
        this.routineType = routineType;
    }

    public void setRoutineStartTime(LocalTime routineStartTime) {
        this.routineStartTime = routineStartTime;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // No-args constructor
    public RelaxationRoutine() {
    }
}
