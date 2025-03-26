package com.it342.sleepsync.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.it342.sleepsync.Entity.RelaxationRoutine;
import com.it342.sleepsync.Repository.RelaxationRoutineRepository;

@Service
public class RelaxationRoutineService {

    @Autowired
    private RelaxationRoutineRepository relaxationRoutineRepository;

    @Transactional
    public RelaxationRoutine createRelaxationRoutine(RelaxationRoutine relaxationRoutine) {
        return relaxationRoutineRepository.save(relaxationRoutine);
    }

    public Optional<RelaxationRoutine> getRelaxationRoutineById(Long id) {
        return relaxationRoutineRepository.findById(id);
    }

    public List<RelaxationRoutine> getAllRelaxationRoutines() {
        return relaxationRoutineRepository.findAll();
    }

    @Transactional
    public RelaxationRoutine updateRelaxationRoutine(Long id, RelaxationRoutine relaxationRoutineDetails) {
        RelaxationRoutine relaxationRoutine = relaxationRoutineRepository.findById(id).orElseThrow(() -> new RuntimeException("RelaxationRoutine not found"));
        relaxationRoutine.setRoutineType(relaxationRoutineDetails.getRoutineType());
        relaxationRoutine.setRoutineStartTime(relaxationRoutineDetails.getRoutineStartTime());
        return relaxationRoutineRepository.save(relaxationRoutine);
    }

    @Transactional
    public void deleteRelaxationRoutine(Long id) {
        relaxationRoutineRepository.deleteById(id);
    }
}
