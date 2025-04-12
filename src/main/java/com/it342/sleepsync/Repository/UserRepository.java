package com.it342.sleepsync.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.it342.sleepsync.Entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
}
