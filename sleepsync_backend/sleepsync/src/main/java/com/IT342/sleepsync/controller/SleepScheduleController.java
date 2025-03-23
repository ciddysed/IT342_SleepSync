package com.IT342.sleepsync.controller;

import com.IT342.sleepsync.models.SleepSchedule;
import com.IT342.sleepsync.service.SleepScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/sleep/schedule")
@RequiredArgsConstructor
public class SleepScheduleController {
    private final SleepScheduleService sleepScheduleService;

    @PostMapping("/{userId}")
    public ResponseEntity<SleepSchedule> createOrUpdateSchedule(@PathVariable Integer userId, @RequestBody SleepSchedule schedule) {
        return ResponseEntity.ok(sleepScheduleService.createOrUpdateSchedule(userId, schedule));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Optional<SleepSchedule>> getSchedule(@PathVariable Integer userId) {
        return ResponseEntity.ok(sleepScheduleService.getScheduleByUserId(userId));
    }
}
