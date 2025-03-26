package com.it342.sleepsync.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.it342.sleepsync.Entity.SleepTrack;
import com.it342.sleepsync.Service.SleepTrackService;

@RestController
@RequestMapping("/sleep-tracks")
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
}
