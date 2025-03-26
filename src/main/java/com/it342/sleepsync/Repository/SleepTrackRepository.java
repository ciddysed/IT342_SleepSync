package com.it342.sleepsync.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.it342.sleepsync.Entity.SleepTrack;

public interface SleepTrackRepository extends JpaRepository<SleepTrack, Long> {
    // Additional query methods can be defined here
}
