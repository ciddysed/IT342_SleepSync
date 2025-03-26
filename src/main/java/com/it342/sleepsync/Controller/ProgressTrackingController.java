package com.it342.sleepsync.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.it342.sleepsync.Entity.ProgressTracking;
import com.it342.sleepsync.Service.ProgressTrackingService;

@RestController
@RequestMapping("/progress-tracking")
public class ProgressTrackingController {

    @Autowired
    private ProgressTrackingService progressTrackingService;

    @PostMapping
    public ResponseEntity<ProgressTracking> createProgressTracking(@RequestBody ProgressTracking progressTracking) {
        ProgressTracking createdProgressTracking = progressTrackingService.createProgressTracking(progressTracking);
        return ResponseEntity.status(201).body(createdProgressTracking);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgressTracking> getProgressTrackingById(@PathVariable Long id) {
        return progressTrackingService.getProgressTrackingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<ProgressTracking> getAllProgressTrackings() {
        return progressTrackingService.getAllProgressTrackings();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProgressTracking> updateProgressTracking(@PathVariable Long id, @RequestBody ProgressTracking progressTrackingDetails) {
        ProgressTracking updatedProgressTracking = progressTrackingService.updateProgressTracking(id, progressTrackingDetails);
        return ResponseEntity.ok(updatedProgressTracking);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgressTracking(@PathVariable Long id) {
        progressTrackingService.deleteProgressTracking(id);
        return ResponseEntity.noContent().build();
    }
}
