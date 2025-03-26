package com.it342.sleepsync.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.it342.sleepsync.Entity.RelaxationRoutine;

public interface RelaxationRoutineRepository extends JpaRepository<RelaxationRoutine, Long> {
    // Additional query methods can be defined here
}
