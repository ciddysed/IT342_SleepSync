package com.example.sleepsyncmobile.model

data class SleepSchedule(
    val id: Long? = null,
    var isActive: Boolean = false,
    val isStaff: Boolean = false,
    val sleepGoals: String = "",
    val sleepTime: String = "",
    val wakeTime: String = "",
    val preferredWakeTime: String = "",
    val user: User
)