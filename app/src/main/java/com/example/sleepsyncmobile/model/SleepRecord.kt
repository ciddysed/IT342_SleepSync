package com.example.sleepsyncmobile.model

data class SleepRecord(
    val id: Int,
    val date: String,
    val sleepStart: String,
    val sleepEnd: String,
    val duration: String,
    val durationHours: Double? = null // Add this new field
) {
    // Kotlin data class automatically provides equals() and hashCode()
    // based on all properties
}
