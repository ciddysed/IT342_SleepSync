package com.it342.sleepsync.Entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userID;

    @Column(unique = true, nullable = false)
    private String email;

    private String firstName;
    private String lastName;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<SleepTrack> sleepTracks;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<RelaxationRoutine> relaxationRoutines;

    // Getters
    public Long getUserID() {
        return userID;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public List<SleepTrack> getSleepTracks() {
        return sleepTracks;
    }

    public List<RelaxationRoutine> getRelaxationRoutines() {
        return relaxationRoutines;
    }

    // Setters
    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setSleepTracks(List<SleepTrack> sleepTracks) {
        this.sleepTracks = sleepTracks;
    }

    public void setRelaxationRoutines(List<RelaxationRoutine> relaxationRoutines) {
        this.relaxationRoutines = relaxationRoutines;
    }

    // No-args constructor
    public User() {
    }
}
