package com.it342.sleepsync.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.it342.sleepsync.Entity.SleepTrack;
import com.it342.sleepsync.Entity.User;

public interface SleepTrackRepository extends JpaRepository<SleepTrack, Long> {
    List<SleepTrack> findByUser(User user);

    @Query("SELECT DISTINCT YEAR(s.date) FROM SleepTrack s ORDER BY YEAR(s.date) DESC")
    List<Integer> findDistinctYears();

    @Query("SELECT s FROM SleepTrack s WHERE YEAR(s.date) = :year AND MONTH(s.date) = :month")
    List<SleepTrack> findByYearAndMonth(@Param("year") int year, @Param("month") int month);

    @Query("SELECT DISTINCT YEAR(s.date) FROM SleepTrack s WHERE s.user.id = :userId ORDER BY YEAR(s.date) DESC")
    List<Integer> findDistinctYearsByUser(@Param("userId") Long userId);

    @Query("SELECT s FROM SleepTrack s WHERE s.user.id = :userId AND YEAR(s.date) = :year AND MONTH(s.date) = :month")
    List<SleepTrack> findByUserAndYearAndMonth(@Param("userId") Long userId, @Param("year") int year, @Param("month") int month);
}
