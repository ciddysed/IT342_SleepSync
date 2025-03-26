package com.it342.sleepsync.Controller;

import com.it342.sleepsync.Entity.SleepSchedule;
import com.it342.sleepsync.Service.SleepScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sleep-schedules")
public class SleepScheduleController {

    @Autowired
    private SleepScheduleService sleepScheduleService;

    @GetMapping
    public List<SleepSchedule> getAllSleepSchedules() {
        return sleepScheduleService.getAllSleepSchedules();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SleepSchedule> getSleepScheduleById(@PathVariable Long id) {
        Optional<SleepSchedule> sleepSchedule = sleepScheduleService.getSleepScheduleById(id);
        return sleepSchedule.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public SleepSchedule createSleepSchedule(@RequestBody SleepSchedule sleepSchedule) {
        return sleepScheduleService.saveSleepSchedule(sleepSchedule);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSleepSchedule(@PathVariable Long id) {
        sleepScheduleService.deleteSleepSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
