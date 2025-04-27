package com.example.sleepsyncmobile

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.navigation.NavigationView

@Suppress("DEPRECATION")
class SleepTipsActivity : AppCompatActivity() {

    private lateinit var drawerLayout: DrawerLayout
    private var firstName: String? = null
    private var email: String = "user@example.com"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sleep_tips)

        drawerLayout = findViewById(R.id.drawer_layout)

        val menuButton: ImageView = findViewById(R.id.menuButton)
        menuButton.setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)
        }

        val profileIcon: ImageView = findViewById(R.id.profileIcon)
        profileIcon.setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)
        }

        // Retrieve firstName and email from SharedPreferences
        val sharedPreferences = getSharedPreferences("UserPrefs", MODE_PRIVATE)
        firstName = sharedPreferences.getString("first_name", "User") // Default to "User" if not found
        email = sharedPreferences.getString("email", "user@example.com") ?: "user@example.com"

        setupNavHeader()

        val navigationView: NavigationView = findViewById(R.id.nav_view)
        navigationView.setNavigationItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.nav_dashboard -> {
                    navigateTo(HomeActivity::class.java)
                }
                R.id.nav_sleep_schedule -> {
                    navigateTo(SleepScheduleActivity::class.java)
                }
                R.id.nav_record_sleep -> {
                    navigateTo(RecordSleepActivity::class.java)
                }
                R.id.nav_sleep_progress -> {
                    navigateTo(SleepProgressActivity::class.java)
                }
                R.id.nav_sleep_tips -> {
                    Toast.makeText(this, "You're already in Sleep Tips", Toast.LENGTH_SHORT).show()
                }
                R.id.nav_logout -> {
                    showLogoutConfirmationDialog()
                }
            }
            drawerLayout.closeDrawer(GravityCompat.START)
            true
        }

        setupTipsDropdown()
    }

    private fun setupTipsDropdown() {
        val timeOfDayOptions = listOf("Morning Tips", "Afternoon Tips", "Night Tips")
        val timeOfDaySpinner = findViewById<Spinner>(R.id.timeOfDaySpinner)

        val adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            timeOfDayOptions
        ).apply {
            setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        }

        timeOfDaySpinner.adapter = adapter

        timeOfDaySpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                showTipsForTimeOfDay(position)
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {}
        }

        // Show morning tips by default
        showTipsForTimeOfDay(0)
    }

    @SuppressLint("SetTextI18n")
    private fun showTipsForTimeOfDay(position: Int) {
        val tipsContainer = findViewById<LinearLayout>(R.id.tipsContainer)
        val tipsTitle = findViewById<TextView>(R.id.tipsTitle)

        // Clear previous tips
        tipsContainer.removeAllViews()

        // Set title
        val titles = listOf("Morning Tips", "Afternoon Tips", "Night Tips")
        tipsTitle.text = titles[position]

        // Get tips for selected time
        val tips = when (position) {
            0 -> getMorningTips()
            1 -> getAfternoonTips()
            else -> getNightTips()
        }

        // Add tips to container
        tips.forEach { tip ->
            val tipView = TextView(this).apply {
                text = "• $tip"
                textSize = 16f
                setPadding(0, 8.dpToPx(), 0, 8.dpToPx())
            }
            tipsContainer.addView(tipView)
        }
    }

    private fun getMorningTips(): List<String> = listOf(
        "Get sunlight exposure within 30 minutes of waking up",
        "Avoid caffeine for the first 90 minutes after waking",
        "Start your day with a glass of water",
        "Do light exercise or stretching",
        "Eat a protein-rich breakfast"
    )

    private fun getAfternoonTips(): List<String> = listOf(
        "Take a short 20-minute power nap if needed",
        "Avoid heavy meals 3 hours before bedtime",
        "Limit caffeine intake after 2 PM",
        "Go for a short walk after lunch",
        "Practice deep breathing exercises"
    )

    private fun getNightTips(): List<String> = listOf(
        "Establish a consistent bedtime routine",
        "Keep your bedroom cool (around 65°F or 18°C)",
        "Avoid screens at least 1 hour before bed",
        "Try reading a book before sleep",
        "Practice relaxation techniques like meditation"
    )

    private fun Int.dpToPx(): Int = (this * resources.displayMetrics.density).toInt()

    @SuppressLint("SetTextI18n")
    private fun setupNavHeader() {
        val navigationView: NavigationView = findViewById(R.id.nav_view)
        val headerView: View = navigationView.getHeaderView(0)

        val navWelcomeText: TextView = headerView.findViewById(R.id.nav_welcome_text)
        val navEmailText: TextView = headerView.findViewById(R.id.nav_email_text)

        // Set the text using the data from SharedPreferences
        navWelcomeText.text = "Welcome, $firstName!"
        navEmailText.text = email
    }

    private fun navigateTo(destination: Class<*>) {
        val intent = Intent(this, destination)
        startActivity(intent)
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
        builder.create().show()
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

