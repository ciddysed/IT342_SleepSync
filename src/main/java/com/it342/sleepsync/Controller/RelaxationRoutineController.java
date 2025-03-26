package com.it342.sleepsync.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.it342.sleepsync.Entity.RelaxationRoutine;
import com.it342.sleepsync.Service.RelaxationRoutineService;

@RestController
@RequestMapping("/relaxation-routines")
public class RelaxationRoutineController {

    @Autowired
    private RelaxationRoutineService relaxationRoutineService;

    @PostMapping
    public ResponseEntity<RelaxationRoutine> createRelaxationRoutine(@RequestBody RelaxationRoutine relaxationRoutine) {
        RelaxationRoutine createdRelaxationRoutine = relaxationRoutineService.createRelaxationRoutine(relaxationRoutine);
        return ResponseEntity.status(201).body(createdRelaxationRoutine);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RelaxationRoutine> getRelaxationRoutineById(@PathVariable Long id) {
        return relaxationRoutineService.getRelaxationRoutineById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<RelaxationRoutine> getAllRelaxationRoutines() {
        return relaxationRoutineService.getAllRelaxationRoutines();
    }

    @PutMapping("/{id}")
    public ResponseEntity<RelaxationRoutine> updateRelaxationRoutine(@PathVariable Long id, @RequestBody RelaxationRoutine relaxationRoutineDetails) {
        RelaxationRoutine updatedRelaxationRoutine = relaxationRoutineService.updateRelaxationRoutine(id, relaxationRoutineDetails);
        return ResponseEntity.ok(updatedRelaxationRoutine);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRelaxationRoutine(@PathVariable Long id) {
        relaxationRoutineService.deleteRelaxationRoutine(id);
        return ResponseEntity.noContent().build();
    }
}
