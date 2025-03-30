package com.it342.sleepsync.Controller;

import com.it342.sleepsync.Entity.SleepSchedule;
import com.it342.sleepsync.Service.SleepScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sleep-schedules")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from the frontend
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "sleepTracks"})
public class SleepScheduleController {

    @Autowired
    private SleepScheduleService sleepScheduleService;

    // Admin: Get all sleep schedules
    @GetMapping
    public List<SleepSchedule> getAllSleepSchedules() {
        return sleepScheduleService.getAllSleepSchedules();
    }

    // Admin: Get a sleep schedule by ID
    @GetMapping("/{id}")
    public ResponseEntity<SleepSchedule> getSleepScheduleById(@PathVariable Long id) {
        Optional<SleepSchedule> sleepSchedule = sleepScheduleService.getSleepScheduleById(id);
        return sleepSchedule.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Admin: Create a new sleep schedule
    @PostMapping
    public SleepSchedule createSleepSchedule(@RequestBody SleepSchedule sleepSchedule) {
        return sleepScheduleService.saveSleepSchedule(sleepSchedule);
    }

    // Admin: Delete a sleep schedule by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSleepSchedule(@PathVariable Long id) {
        sleepScheduleService.deleteSleepSchedule(id);
        return ResponseEntity.noContent().build();
    }

    // User: Get all sleep schedules for a specific user
    @GetMapping("/user/{userId}")
    public List<SleepSchedule> getSleepSchedulesByUserId(@PathVariable Long userId) {
        return sleepScheduleService.getSleepSchedulesByUser(userId);
    }

    // User: Create a sleep schedule for the logged-in user
    @PostMapping("/user/{userId}")
    public ResponseEntity<SleepSchedule> createSleepScheduleForUser(@PathVariable Long userId, @RequestBody SleepSchedule sleepSchedule) {
        SleepSchedule createdSchedule = sleepScheduleService.addSleepScheduleForUser(userId, sleepSchedule);
        return ResponseEntity.status(201).body(createdSchedule);
    }

    // User: Update a sleep schedule for the logged-in user
    @PutMapping("/user/{userId}/{scheduleId}")
    public ResponseEntity<SleepSchedule> updateSleepScheduleForUser(
            @PathVariable Long userId,
            @PathVariable Long scheduleId,
            @RequestBody SleepSchedule sleepScheduleDetails) {
        SleepSchedule updatedSchedule = sleepScheduleService.updateSleepScheduleForUser(userId, scheduleId, sleepScheduleDetails);
        return ResponseEntity.ok(updatedSchedule);
    }

    // User: Delete a sleep schedule for the logged-in user
    @DeleteMapping("/user/{userId}/{scheduleId}")
    public ResponseEntity<Void> deleteSleepScheduleForUser(@PathVariable Long userId, @PathVariable Long scheduleId) {
        sleepScheduleService.deleteSleepScheduleForUser(userId, scheduleId);
        return ResponseEntity.noContent().build();
    }
}