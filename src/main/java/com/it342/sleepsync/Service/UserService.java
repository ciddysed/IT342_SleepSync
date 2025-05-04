package com.it342.sleepsync.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // ✅ Add this import

import com.it342.sleepsync.Entity.User;
import com.it342.sleepsync.Repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder; // ✅ Inject password encoder

    @Transactional
    public User createUser(User user) {
        try {
            // Ensure all required fields are set
            if (user.getEmail() == null || user.getPassword() == null) {
                throw new IllegalArgumentException("Email and password are required.");
            }

            // ✅ Hash password before saving
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            
            // Save user and cascade relationships
            return userRepository.save(user);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setEmail(userDetails.getEmail());
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        // Update relationships if needed
        user.setSleepTracks(userDetails.getSleepTracks());
        user.setRelaxationRoutines(userDetails.getRelaxationRoutines());
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<User> validateLogin(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword()))
 {
            return user;
        }
        return Optional.empty();
    }
}
