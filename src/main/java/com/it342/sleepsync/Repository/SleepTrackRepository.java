package com.it342.sleepsync.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.it342.sleepsync.Entity.SleepTrack;
import com.it342.sleepsync.Entity.User;

public interface SleepTrackRepository extends JpaRepository<SleepTrack, Long> {
    List<SleepTrack> findByUser(User user);
}
