// UserRepository.java
package com.it342.sleepsync.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.it342.sleepsync.Entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
