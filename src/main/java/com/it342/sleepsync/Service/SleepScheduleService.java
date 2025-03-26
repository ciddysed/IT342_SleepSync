package com.it342.sleepsync.Service;

import com.it342.sleepsync.Entity.SleepSchedule;
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
}
