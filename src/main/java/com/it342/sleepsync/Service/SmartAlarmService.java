package com.it342.sleepsync.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.it342.sleepsync.Entity.SmartAlarm;
import com.it342.sleepsync.Repository.SmartAlarmRepository;

@Service
public class SmartAlarmService {

    @Autowired
    private SmartAlarmRepository smartAlarmRepository;

    @Transactional
    public SmartAlarm createSmartAlarm(SmartAlarm smartAlarm) {
        return smartAlarmRepository.save(smartAlarm);
    }

    public Optional<SmartAlarm> getSmartAlarmById(Long id) {
        return smartAlarmRepository.findById(id);
    }

    public List<SmartAlarm> getAllSmartAlarms() {
        return smartAlarmRepository.findAll();
    }

    @Transactional
    public SmartAlarm updateSmartAlarm(Long id, SmartAlarm smartAlarmDetails) {
        SmartAlarm smartAlarm = smartAlarmRepository.findById(id).orElseThrow(() -> new RuntimeException("SmartAlarm not found"));
        smartAlarm.setAlarmTime(smartAlarmDetails.getAlarmTime());
        return smartAlarmRepository.save(smartAlarm);
    }

    @Transactional
    public void deleteSmartAlarm(Long id) {
        smartAlarmRepository.deleteById(id);
    }
}
