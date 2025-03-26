package com.it342.sleepsync.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.it342.sleepsync.Entity.SleepTrack;
import com.it342.sleepsync.Repository.SleepTrackRepository;

@Service
public class SleepTrackService {

    @Autowired
    private SleepTrackRepository sleepTrackRepository;

    @Transactional
    public SleepTrack createSleepTrack(SleepTrack sleepTrack) {
        return sleepTrackRepository.save(sleepTrack);
    }

    public Optional<SleepTrack> getSleepTrackById(Long id) {
        return sleepTrackRepository.findById(id);
    }

    public List<SleepTrack> getAllSleepTracks() {
        return sleepTrackRepository.findAll();
    }

    @Transactional
    public SleepTrack updateSleepTrack(Long id, SleepTrack sleepTrackDetails) {
        SleepTrack sleepTrack = sleepTrackRepository.findById(id).orElseThrow(() -> new RuntimeException("SleepTrack not found"));
        sleepTrack.setDate(sleepTrackDetails.getDate());
        sleepTrack.setSleepDuration(sleepTrackDetails.getSleepDuration());
        sleepTrack.setSleepQuality(sleepTrackDetails.getSleepQuality());
        sleepTrack.setSleepStages(sleepTrackDetails.getSleepStages());
        sleepTrack.setScheduleId(sleepTrackDetails.getScheduleId());
        return sleepTrackRepository.save(sleepTrack);
    }

    @Transactional
    public void deleteSleepTrack(Long id) {
        sleepTrackRepository.deleteById(id);
    }
}
