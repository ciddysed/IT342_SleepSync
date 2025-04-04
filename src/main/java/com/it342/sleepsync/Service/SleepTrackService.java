package com.it342.sleepsync.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.it342.sleepsync.Entity.SleepTrack;
import com.it342.sleepsync.Entity.User;
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

    public List<SleepTrack> getAllSleepTracksByUser(User user) {
        return sleepTrackRepository.findByUser(user);
    }

    @Transactional
    public SleepTrack updateSleepTrack(Long id, SleepTrack sleepTrackDetails) {
        SleepTrack sleepTrack = sleepTrackRepository.findById(id).orElseThrow(() -> new RuntimeException("SleepTrack not found"));
        sleepTrack.setDate(sleepTrackDetails.getDate());
        sleepTrack.setSleepDuration(sleepTrackDetails.getSleepDuration());
        sleepTrack.setSleepTime(sleepTrackDetails.getSleepTime()); // Updated
        sleepTrack.setWakeTime(sleepTrackDetails.getWakeTime()); // Updated
        return sleepTrackRepository.save(sleepTrack);
    }

    @Transactional
    public void deleteSleepTrack(Long id) {
        sleepTrackRepository.deleteById(id);
    }

    public double calculateSleepDuration(String sleepDate, String sleepTime, String wakeDate, String wakeTime) {
        try {
            LocalTime sleep = LocalTime.parse(sleepTime);
            LocalTime wake = LocalTime.parse(wakeTime);
            LocalDate sleepDateParsed = LocalDate.parse(sleepDate);
            LocalDate wakeDateParsed = LocalDate.parse(wakeDate);

            // Combine date and time for accurate duration calculation
            LocalDateTime sleepDateTime = LocalDateTime.of(sleepDateParsed, sleep);
            LocalDateTime wakeDateTime = LocalDateTime.of(wakeDateParsed, wake);

            // Adjust for AM/PM logic
            if (wakeDateTime.isBefore(sleepDateTime)) {
                wakeDateTime = wakeDateTime.plusDays(1); // Adjust wakeDateTime to the next day
            }

            // Calculate duration in hours
            double duration = java.time.Duration.between(sleepDateTime, wakeDateTime).toMinutes() / 60.0;

            return Math.max(duration, 0); // Ensure no negative values
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date or time format: " + e.getMessage());
        }
    }

    public List<String> generateTasks() {
        return Arrays.asList(
            "Drink water",
            "Meditate for 10 minutes",
            "Read a book"
        );
    }

    public String convertTasksToHtml(List<String> tasks) {
        StringBuilder html = new StringBuilder();
        for (int i = 0; i < tasks.size(); i++) {
            html.append("<div class=\"task-card\">")
                .append("<label>")
                .append("<input type=\"checkbox\" name=\"task").append(i + 1).append("\" value=\"").append(i + 1).append("\">")
                .append("<span>Task ").append(i + 1).append(": ").append(tasks.get(i)).append("</span>")
                .append("</label>")
                .append("</div>");
        }
        return html.toString();
    }

    public List<Integer> getDistinctYears() {
        return sleepTrackRepository.findDistinctYears();
    }

    public List<SleepTrack> getSleepDataByYearAndMonth(int year, int month) {
        return sleepTrackRepository.findByYearAndMonth(year, month);
    }

    public List<Integer> getDistinctYearsByUser(Long userId) {
        return sleepTrackRepository.findDistinctYearsByUser(userId);
    }

    public List<SleepTrack> getSleepDataByYearAndMonth(Long userId, int year, int month) {
        return sleepTrackRepository.findByUserAndYearAndMonth(userId, year, month);
    }
}
