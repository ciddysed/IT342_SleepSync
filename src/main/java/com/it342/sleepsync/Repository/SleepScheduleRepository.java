package com.it342.sleepsync.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.it342.sleepsync.Entity.SleepSchedule;

public interface SleepScheduleRepository extends JpaRepository<SleepSchedule, Long> {
    // Additional query methods can be defined here
}
