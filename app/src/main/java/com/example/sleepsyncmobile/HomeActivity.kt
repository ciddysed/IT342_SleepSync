package com.example.sleepsyncmobile

import android.annotation.SuppressLint
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import com.example.sleepsyncmobile.model.SleepRecord
import com.google.android.material.navigation.NavigationView
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken


@Suppress("DEPRECATION")
class HomeActivity : AppCompatActivity() {

    private lateinit var drawerLayout: DrawerLayout

    private var firstName: String? = null
    private var email: String = "user@example.com"

    private lateinit var sleepDurationText: TextView
    private lateinit var sleepQualityText: TextView

    @SuppressLint("SetTextI18n", "MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        // Retrieve first name and email from SharedPreferences
        val sharedPreferences: SharedPreferences = getSharedPreferences("UserPrefs", MODE_PRIVATE)
        val firstName = sharedPreferences.getString("first_name", "Guest") // Default to "Guest" if not found
        val email = sharedPreferences.getString("email", "no-email@domain.com") // Default to a placeholder if not found

        drawerLayout = findViewById(R.id.drawer_layout)

        val menuButton: ImageView = findViewById(R.id.menuButton)
        menuButton.setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)
        }

        val profileIcon: ImageView = findViewById(R.id.profileIcon)
        profileIcon.setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)
        }

        // Get firstName and email passed from LoginActivity (if any)
        this.firstName = firstName
        this.email = email.toString()

        val moreTipsButton: Button = findViewById(R.id.moreTipsButton)
        moreTipsButton.setOnClickListener {
            navigateToSleepTips()
        }

        // Initialize views
        sleepDurationText = findViewById(R.id.sleepDurationText)
        sleepQualityText = findViewById(R.id.sleepQualityText)

        calculateSleepSummary()
        setupViewDetailsButton()
        setupSleepScheduleDisplay()

        setupNavHeader()
    }

    private fun calculateSleepSummary() {
        val sharedPreferences = getSharedPreferences("SleepRecords", MODE_PRIVATE)
        val json = sharedPreferences.getString("records", null) ?: return

        try {
            val type = object : TypeToken<List<SleepRecord>>() {}.type
            val records: List<SleepRecord> = Gson().fromJson(json, type)

            if (records.isEmpty()) {
                updateSleepSummaryUI(0.0, "No data")
                return
            }

            val totalHours = records.sumOf { it.durationHours ?: 0.0 }
            val averageSleep = totalHours / records.size
            val sleepQuality = when {
                averageSleep >= 8 -> "Very Good"
                averageSleep >= 5 -> "Good"
                else -> "Bad"
            }

            updateSleepSummaryUI(averageSleep, sleepQuality)
        } catch (e: Exception) {
            Log.e("HomeActivity", "Error calculating sleep summary", e)
        }
    }

    @SuppressLint("SetTextI18n")
    private fun updateSleepSummaryUI(averageSleep: Double, sleepQuality: String) {
        runOnUiThread {
            sleepDurationText.text = "Average Sleep: %.1f hours".format(averageSleep)
            sleepQualityText.text = "Sleep Quality: $sleepQuality"

            // Set appropriate color based on quality
            val color = when (sleepQuality) {
                "Very Good" -> ContextCompat.getColor(this, R.color.green)
                "Good" -> ContextCompat.getColor(this, R.color.blue)
                else -> ContextCompat.getColor(this, R.color.red)
            }
            sleepQualityText.setTextColor(color)
        }
    }

    private fun setupViewDetailsButton() {
        findViewById<Button>(R.id.viewDetailsButton).setOnClickListener {
            // Start new activity to show graph
            val intent = Intent(this, SleepDetailsActivity::class.java)
            startActivity(intent)
        }
    }

    private fun setupSleepScheduleDisplay() {
        val tvBedtime = findViewById<TextView>(R.id.tvBedtime)
        val tvWakeUp = findViewById<TextView>(R.id.tvWakeUp)
        val btnAdjustSchedule = findViewById<Button>(R.id.btnAdjustSchedule)

        val sharedPrefs = getSharedPreferences("SleepSchedulePrefs", MODE_PRIVATE)
        val bedtime = sharedPrefs.getString("bedtime", null) // Changed to null check
        val wakeUp = sharedPrefs.getString("wakeUp", null)

        // Update UI (show "--:--" if no schedule exists)
        tvBedtime.text = bedtime ?: "--:--"
        tvWakeUp.text = wakeUp ?: "--:--"

        btnAdjustSchedule.setOnClickListener {
            val intent = Intent(this, SleepScheduleActivity::class.java)
            startActivity(intent)
        }
    }

    private fun setupNavHeader() {
        val navigationView: NavigationView = findViewById(R.id.nav_view)
        val headerView: View = navigationView.getHeaderView(0)

        val navWelcomeText: TextView = headerView.findViewById(R.id.nav_welcome_text)
        val navEmailText: TextView = headerView.findViewById(R.id.nav_email_text)

        navWelcomeText.text = if (firstName != null) "Welcome, $firstName!" else "Welcome, User!"
        navEmailText.text = email

        navigationView.setNavigationItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.nav_dashboard -> {
                    // Already on dashboard
                }
                R.id.nav_sleep_schedule -> {
                    navigateToSleepSchedule()
                }
                R.id.nav_record_sleep -> {
                    navigateToRecordSleep()
                }
                R.id.nav_sleep_progress -> {
                    navigateToSleepProgress()
                }
                R.id.nav_sleep_tips -> {
                    navigateToSleepTips()
                }
                R.id.nav_logout -> {
                    showLogoutConfirmationDialog()
                }
            }
            drawerLayout.closeDrawer(GravityCompat.START)
            true
        }
    }

    private fun navigateToSleepSchedule() {
        val intent = Intent(this, SleepScheduleActivity::class.java)
        startActivity(intent)
    }

    private fun navigateToRecordSleep() {
        val intent = Intent(this, RecordSleepActivity::class.java)
        startActivity(intent)
    }

    private fun navigateToSleepProgress() {
        val intent = Intent(this, SleepDetailsActivity::class.java)
        startActivity(intent)
    }

    private fun navigateToSleepTips() {
        val intent = Intent(this, SleepTipsActivity::class.java)
        startActivity(intent)
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left)
    }

    private fun showLogoutConfirmationDialog() {
        val builder = AlertDialog.Builder(this)
        builder.setMessage("Are you sure you want to logout?")
            .setCancelable(false)
            .setPositiveButton("Yes") { _, _ ->
                val intent = Intent(this, LoginActivity::class.java)
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                startActivity(intent)
                finish()
            }
            .setNegativeButton("No") { dialog, _ ->
                dialog.dismiss()
            }
        val alert = builder.create()
        alert.show()
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }
}
