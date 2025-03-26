package com.it342.sleepsync.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.it342.sleepsync.Entity.ProgressTracking;

public interface ProgressTrackingRepository extends JpaRepository<ProgressTracking, Long> {
    // Additional query methods can be defined here
}
