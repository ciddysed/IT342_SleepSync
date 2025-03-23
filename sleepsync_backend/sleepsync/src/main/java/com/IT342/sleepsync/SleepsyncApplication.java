package com.IT342.sleepsync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("com.IT342.sleepsync.repository") // <-- Ensure Spring scans the repository package
public class SleepsyncApplication {
    public static void main(String[] args) {
        SpringApplication.run(SleepsyncApplication.class, args);
    }
}
