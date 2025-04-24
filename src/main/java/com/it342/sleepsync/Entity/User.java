package com.it342.sleepsync.Entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "\"user\"") // Escaping the table name to avoid conflict with PostgreSQL reserved keywords
@JsonInclude(JsonInclude.Include.NON_NULL) // Include only non-null fields in JSON
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userID;

    @Column(unique = true, nullable = false) // Ensure email is unique and not null
    private String email;

    private String firstName;
    private String lastName;

    @Column(nullable = false) // Ensure password is not null
    private String password;

    @JsonIgnore
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<SleepTrack> sleepTracks;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<RelaxationRoutine> relaxationRoutines;

    // Constructor with userID
    public User(Long userID) {
        this.userID = userID;
    }

    // No-args constructor
    public User() {
    }

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

    public String getPassword() {
        return password;
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

    public void setPassword(String password) {
        this.password = password;
    }

    public void setSleepTracks(List<SleepTrack> sleepTracks) {
        this.sleepTracks = sleepTracks;
    }

    public void setRelaxationRoutines(List<RelaxationRoutine> relaxationRoutines) {
        this.relaxationRoutines = relaxationRoutines;
    }
}
