package com.it342.sleepsync.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.it342.sleepsync.Entity.SmartAlarm;
import com.it342.sleepsync.Service.SmartAlarmService;

@RestController
@RequestMapping("/api/smartalarms")
public class SmartAlarmController {

    @Autowired
    private SmartAlarmService smartAlarmService;

    @PostMapping
    public SmartAlarm createSmartAlarm(@RequestBody SmartAlarm smartAlarm) {
        return smartAlarmService.createSmartAlarm(smartAlarm);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SmartAlarm> getSmartAlarmById(@PathVariable Long id) {
        Optional<SmartAlarm> smartAlarm = smartAlarmService.getSmartAlarmById(id);
        return smartAlarm.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<SmartAlarm> getAllSmartAlarms() {
        return smartAlarmService.getAllSmartAlarms();
    }

    @PutMapping("/{id}")
    public ResponseEntity<SmartAlarm> updateSmartAlarm(@PathVariable Long id, @RequestBody SmartAlarm smartAlarmDetails) {
        try {
            SmartAlarm updatedSmartAlarm = smartAlarmService.updateSmartAlarm(id, smartAlarmDetails);
            return ResponseEntity.ok(updatedSmartAlarm);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSmartAlarm(@PathVariable Long id) {
        smartAlarmService.deleteSmartAlarm(id);
        return ResponseEntity.noContent().build();
    }
}
