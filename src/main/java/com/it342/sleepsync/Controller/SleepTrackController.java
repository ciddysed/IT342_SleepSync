package com.it342.sleepsync.Controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.it342.sleepsync.Entity.SleepTrack;
import com.it342.sleepsync.Service.SleepTrackService;

@RestController
@RequestMapping("/sleep-tracks")
@CrossOrigin(origins = "http://localhost:3000")
public class SleepTrackController {

    @Autowired
    private SleepTrackService sleepTrackService;

    @PostMapping
    public ResponseEntity<SleepTrack> createSleepTrack(@RequestBody SleepTrack sleepTrack) {
        SleepTrack createdSleepTrack = sleepTrackService.createSleepTrack(sleepTrack);
        return ResponseEntity.status(201).body(createdSleepTrack);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SleepTrack> getSleepTrackById(@PathVariable Long id) {
        return sleepTrackService.getSleepTrackById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<SleepTrack> getAllSleepTracks() {
        return sleepTrackService.getAllSleepTracks();
    }

    @PutMapping("/{id}")
    public ResponseEntity<SleepTrack> updateSleepTrack(@PathVariable Long id, @RequestBody SleepTrack sleepTrackDetails) {
        SleepTrack updatedSleepTrack = sleepTrackService.updateSleepTrack(id, sleepTrackDetails);
        return ResponseEntity.ok(updatedSleepTrack);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSleepTrack(@PathVariable Long id) {
        sleepTrackService.deleteSleepTrack(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/record_sleep_time")
    public ResponseEntity<?> recordSleepTime(@RequestBody Map<String, String> payload) {
        try {
            String sleepTime = payload.get("sleep_time");
            String wakeTime = payload.get("wake_time");
            String dateString = payload.get("date");

            if (sleepTime == null || wakeTime == null || dateString == null) {
                return ResponseEntity.badRequest().body("Missing required fields: sleep_time, wake_time, or date.");
            }

            LocalDate date = LocalDate.parse(dateString);

            // Calculate sleep duration
            double sleepDuration = sleepTrackService.calculateSleepDuration(sleepTime, wakeTime);

            // Generate tasks
            List<String> tasks = sleepTrackService.generateTasks();

            // Convert tasks to HTML
            String taskCardsHtml = sleepTrackService.convertTasksToHtml(tasks);

            // Store sleep record and tasks
            SleepTrack sleepTrack = new SleepTrack();
            sleepTrack.setDate(date);
            sleepTrack.setSleepTime(sleepTime);
            sleepTrack.setWakeTime(wakeTime);
            sleepTrack.setSleepDuration(sleepDuration);
            sleepTrack.setTasks(String.join(",", tasks)); // Store tasks as a comma-separated string
            sleepTrackService.createSleepTrack(sleepTrack);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("task_cards", taskCardsHtml);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // Log the error for debugging
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }
}
