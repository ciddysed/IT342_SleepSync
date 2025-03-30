package com.it342.sleepsync.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.it342.sleepsync.Entity.User;
import com.it342.sleepsync.Service.UserService;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from the frontend
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.status(201).body(createdUser);
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.status(500).build(); // Return 500 if an error occurs
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(id, userDetails);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestParam String email, // Changed from username to email
            @RequestParam String password) {
        try {
            Optional<User> user = userService.validateLogin(email, password); // Pass email instead of username
            if (user.isPresent()) {
                return ResponseEntity.ok(user.get()); // Ensure the user object contains the id field
            } else {
                return ResponseEntity.status(401).body("Invalid email or password."); // Updated error message
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Login failed. Please try again.");
        }
    }
}
