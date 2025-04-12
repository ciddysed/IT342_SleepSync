package com.it342.sleepsync.Service;

import com.it342.sleepsync.Entity.SleepSchedule;
import com.it342.sleepsync.Entity.User;
import com.it342.sleepsync.Repository.SleepScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class SleepScheduleService {

    @Autowired
    private SleepScheduleRepository sleepScheduleRepository;

    public List<SleepSchedule> getAllSleepSchedules() {
        return sleepScheduleRepository.findAll();
    }

    public Optional<SleepSchedule> getSleepScheduleById(Long id) {
        return sleepScheduleRepository.findById(id);
    }

    public SleepSchedule saveSleepSchedule(SleepSchedule sleepSchedule) {
        return sleepScheduleRepository.save(sleepSchedule);
    }

    public void deleteSleepSchedule(Long id) {
        sleepScheduleRepository.deleteById(id);
    }

    public List<SleepSchedule> getSleepSchedulesByUser(Long userId) {
        return sleepScheduleRepository.findByUserUserId(userId);
    }

    public SleepSchedule addSleepScheduleForUser(Long userId, SleepSchedule sleepSchedule) {
        User user = new User(); // Assuming User object is fetched elsewhere
        user.setUserId(userId); // Updated method name
        sleepSchedule.setUser(user);
        return sleepScheduleRepository.save(sleepSchedule);
    }

    public void deleteSleepScheduleForUser(Long userId, Long scheduleId) {
        Optional<SleepSchedule> schedule = sleepScheduleRepository.findById(scheduleId);
        if (schedule.isPresent() && schedule.get().getUser().getUserId().equals(userId)) { // Updated method name
            sleepScheduleRepository.deleteById(scheduleId);
        }
    }

    public SleepSchedule updateSleepScheduleForUser(Long userId, Long scheduleId, SleepSchedule updatedSchedule) {
        Optional<SleepSchedule> existingSchedule = sleepScheduleRepository.findById(scheduleId);
        if (existingSchedule.isPresent() && existingSchedule.get().getUser().getUserId().equals(userId)) { // Updated method name
            updatedSchedule.setId(scheduleId);
            updatedSchedule.setUser(existingSchedule.get().getUser());
            return sleepScheduleRepository.save(updatedSchedule);
        }
        return null; // Handle appropriately
    }
}
