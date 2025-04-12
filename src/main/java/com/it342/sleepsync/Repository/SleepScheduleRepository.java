package com.it342.sleepsync.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.it342.sleepsync.Entity.SleepSchedule;

public interface SleepScheduleRepository extends JpaRepository<SleepSchedule, Long> {
    List<SleepSchedule> findByUserUserId(Long userId); // Updated method name
}
