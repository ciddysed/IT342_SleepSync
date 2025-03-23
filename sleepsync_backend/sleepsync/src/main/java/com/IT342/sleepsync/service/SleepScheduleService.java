package com.IT342.sleepsync.service;

import com.IT342.sleepsync.models.SleepSchedule;
import com.IT342.sleepsync.models.User;
import com.IT342.sleepsync.repository.SleepScheduleRepository;
import com.IT342.sleepsync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SleepScheduleService {
    private final SleepScheduleRepository sleepScheduleRepository;
    private final UserRepository userRepository;

    public SleepSchedule createOrUpdateSchedule(Integer userId, SleepSchedule schedule) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        schedule.setUser(user);
        return sleepScheduleRepository.save(schedule);
    }

    public Optional<SleepSchedule> getScheduleByUserId(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return sleepScheduleRepository.findByUser(user);
    }

    
}
