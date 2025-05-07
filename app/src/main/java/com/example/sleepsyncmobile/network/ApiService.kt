// ApiService.kt
package com.example.sleepsyncmobile.network

import com.example.sleepsyncmobile.model.LoginRequest
import com.example.sleepsyncmobile.model.LoginResponse
import com.example.sleepsyncmobile.model.SleepSchedule
import com.example.sleepsyncmobile.model.User
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    // Authentication Endpoints
    @POST("/users/login")
    suspend fun loginUser(@Body loginRequest: LoginRequest): Response<LoginResponse>

    @POST("/users")
    suspend fun registerUser(@Body user: User): Response<User>

    @GET("users/{id}")
    suspend fun getUserById(@Path("id") id: Long): Response<User>

    @GET("users")
    suspend fun getAllUsers(): Response<List<User>>

    // Sleep Schedule Endpoints
    @GET("/api/sleep-schedules/user/{userId}")
    suspend fun getSleepSchedulesByUserId(
        @Path("userId") userId: Long
    ): Response<List<SleepSchedule>>

    @POST("/api/sleep-schedules/user/{userId}")
    suspend fun createSleepScheduleForUser(
        @Path("userId") userId: Long,
        @Body sleepSchedule: SleepSchedule
    ): Response<SleepSchedule>

    @PUT("/api/sleep-schedules/user/{userId}/{scheduleId}")
    suspend fun updateSleepScheduleForUser(
        @Path("userId") userId: Long,
        @Path("scheduleId") scheduleId: Long,
        @Body sleepSchedule: SleepSchedule
    ): Response<SleepSchedule>

    @DELETE("/api/sleep-schedules/user/{userId}/{scheduleId}")
    suspend fun deleteSleepScheduleForUser(
        @Path("userId") userId: Long,
        @Path("scheduleId") scheduleId: Long?
    ): Response<Void>

    @GET("/api/sleep-schedules/{id}")
    suspend fun getSleepScheduleById(
        @Path("id") id: Long?
    ): Response<SleepSchedule>

    // Additional endpoints if needed
    @GET("/api/sleep-schedules")
    suspend fun getAllSleepSchedules(): Response<List<SleepSchedule>>
}