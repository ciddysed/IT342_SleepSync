package com.IT342.sleepsync.repository;

import com.IT342.sleepsync.models.SleepSchedule;
import com.IT342.sleepsync.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SleepScheduleRepository extends JpaRepository<SleepSchedule, Integer> {
    Optional<SleepSchedule> findByUser(User user);
}
