package com.it342.sleepsync.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.it342.sleepsync.Entity.ProgressTracking;
import com.it342.sleepsync.Repository.ProgressTrackingRepository;

@Service
public class ProgressTrackingService {

    @Autowired
    private ProgressTrackingRepository progressTrackingRepository;

    @Transactional
    public ProgressTracking createProgressTracking(ProgressTracking progressTracking) {
        return progressTrackingRepository.save(progressTracking);
    }

    public Optional<ProgressTracking> getProgressTrackingById(Long id) {
        return progressTrackingRepository.findById(id);
    }

    public List<ProgressTracking> getAllProgressTrackings() {
        return progressTrackingRepository.findAll();
    }

    @Transactional
    public ProgressTracking updateProgressTracking(Long id, ProgressTracking progressTrackingDetails) {
        ProgressTracking progressTracking = progressTrackingRepository.findById(id).orElseThrow(() -> new RuntimeException("ProgressTracking not found"));
        progressTracking.setDate(progressTrackingDetails.getDate());
        progressTracking.setGoal(progressTrackingDetails.getGoal());
        progressTracking.setProgressValue(progressTrackingDetails.getProgressValue());
        return progressTrackingRepository.save(progressTracking);
    }

    @Transactional
    public void deleteProgressTracking(Long id) {
        progressTrackingRepository.deleteById(id);
    }
}
