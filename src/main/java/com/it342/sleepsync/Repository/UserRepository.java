package com.it342.sleepsync.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.it342.sleepsync.Entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // Additional query methods can be defined here
}
