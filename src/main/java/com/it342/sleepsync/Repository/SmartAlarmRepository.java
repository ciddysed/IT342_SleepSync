package com.it342.sleepsync.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.it342.sleepsync.Entity.SmartAlarm;

public interface SmartAlarmRepository extends JpaRepository<SmartAlarm, Long> {
    // Additional query methods can be defined here
}
