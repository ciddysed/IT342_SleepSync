# Use an official Maven image to build the application
FROM maven:3.9.9-eclipse-temurin-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the project files into the container
COPY pom.xml .
RUN mvn dependency:go-offline

# Build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Use a lightweight JDK image to run the application
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/sleepsync-0.0.1-SNAPSHOT.jar .

# Expose the port your application runs on
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "/app/sleepsync-0.0.1-SNAPSHOT.jar"]
