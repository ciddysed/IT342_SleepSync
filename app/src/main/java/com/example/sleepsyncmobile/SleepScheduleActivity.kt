package com.example.sleepsyncmobile

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.app.TimePickerDialog
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.*
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.sleepsyncmobile.adapters.SleepScheduleAdapter
import com.example.sleepsyncmobile.model.SleepSchedule
import com.example.sleepsyncmobile.model.User
import com.example.sleepsyncmobile.network.RetrofitClient
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.navigation.NavigationView
import kotlinx.coroutines.launch
import java.util.*
import androidx.appcompat.widget.Toolbar

class SleepScheduleDiffCallback(
    private val oldList: List<SleepSchedule>,
    private val newList: List<SleepSchedule>
) : DiffUtil.Callback() {
    override fun getOldListSize(): Int = oldList.size
    override fun getNewListSize(): Int = newList.size
    override fun areItemsTheSame(oldPos: Int, newPos: Int): Boolean =
        oldList[oldPos].id == newList[newPos].id
    override fun areContentsTheSame(oldPos: Int, newPos: Int): Boolean =
        oldList[oldPos] == newList[newPos]
}

@Suppress("DEPRECATION")
class SleepScheduleActivity : AppCompatActivity() {

    private lateinit var firstName: String
    private lateinit var email: String

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: SleepScheduleAdapter
    private lateinit var btnAddSchedule: Button

    @SuppressLint("UseSwitchCompatOrMaterialCode")
    private lateinit var switchActive: Switch
    private lateinit var etSleepGoals: EditText
    private lateinit var tvSleepTime: TextView
    private lateinit var tvWakeTime: TextView
    private lateinit var tvPreferredWakeTime: TextView
    private lateinit var progressBar: ProgressBar
    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navigationView: NavigationView
    private lateinit var bottomNavigation: BottomNavigationView

    private var currentUserId: Long = 1  // Replace with actual user ID from auth
    private var editingScheduleId: Long? = null
    private val schedules = mutableListOf<SleepSchedule>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sleep_schedule)

        val toolbar = findViewById<Toolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)

        val menuButton: ImageView = findViewById(R.id.menuButton)
        menuButton.setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)
        }

        val profileIcon: ImageView = findViewById(R.id.profileIcon)
        profileIcon.setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)
        }


        drawerLayout = findViewById(R.id.drawer_layout)
        navigationView = findViewById(R.id.nav_view)

        // Retrieve user info AFTER calling onCreate
        firstName = intent.getStringExtra("FIRST_NAME") ?: "User"
        email = intent.getStringExtra("EMAIL") ?: "user@example.com"

        // Setup navigation header after initializing user info
        setupNavHeader()

        setupNavigationDrawer()

        initializeViews()
        setupRecyclerView()
        loadUserSchedules()
        setupClickListeners()
    }

    private fun initializeViews() {
        recyclerView = findViewById(R.id.rvSleepSchedules)
        btnAddSchedule = findViewById(R.id.btnAddSchedule)
        switchActive = findViewById(R.id.switchActive)
        etSleepGoals = findViewById(R.id.etSleepGoals)
        tvSleepTime = findViewById(R.id.tvSleepTime)
        tvWakeTime = findViewById(R.id.tvWakeTime)
        tvPreferredWakeTime = findViewById(R.id.tvPreferredWakeTime)
        progressBar = findViewById(R.id.progressBar)
    }

    private fun setupRecyclerView() {
        adapter = SleepScheduleAdapter(
            schedules,
            onEditClick = { schedule ->
                editingScheduleId = schedule.id
                populateFormForEdit(schedule)
            },
            onDeleteClick = { schedule ->
                deleteSchedule(schedule.id)
            },
            onToggleActive = { schedule, isActive ->
                toggleScheduleActive(schedule.id, isActive)
            }
        )
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = adapter
    }

    private fun loadUserSchedules() {
        progressBar.visibility = View.VISIBLE
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.apiService.getSleepSchedulesByUserId(currentUserId)
                if (response.isSuccessful) {
                    val newSchedules = response.body() ?: emptyList()
                    val diffResult = DiffUtil.calculateDiff(
                        SleepScheduleDiffCallback(schedules, newSchedules)
                    )
                    schedules.clear()
                    schedules.addAll(newSchedules)
                    diffResult.dispatchUpdatesTo(adapter)
                } else {
                    showToast("Failed to load schedules")
                }
            } catch (e: Exception) {
                Log.e("SleepScheduleActivity", "loadUserSchedules failed", e)
                showToast("Network error: ${e.message}")
            } finally {
                progressBar.visibility = View.GONE
            }
        }
    }

    private fun setupClickListeners() {
        btnAddSchedule.setOnClickListener {
            if (validateForm()) {
                saveSchedule()
            }
        }

        tvSleepTime.setOnClickListener { showTimePicker(tvSleepTime) }
        tvWakeTime.setOnClickListener { showTimePicker(tvWakeTime) }
        tvPreferredWakeTime.setOnClickListener { showTimePicker(tvPreferredWakeTime) }
    }

    private fun showTimePicker(textView: TextView) {
        val calendar = Calendar.getInstance()
        val timePicker = TimePickerDialog(
            this,
            { _, hourOfDay, minute ->
                val selectedTime = String.format(Locale.getDefault(), "%02d:%02d", hourOfDay, minute)
                textView.text = selectedTime
            },
            calendar.get(Calendar.HOUR_OF_DAY),
            calendar.get(Calendar.MINUTE),
            true
        )
        timePicker.show()
    }

    private fun populateFormForEdit(schedule: SleepSchedule) {
        switchActive.isChecked = schedule.isActive
        etSleepGoals.setText(schedule.sleepGoals)
        tvSleepTime.text = schedule.sleepTime
        tvWakeTime.text = schedule.wakeTime
        tvPreferredWakeTime.text = schedule.preferredWakeTime
        btnAddSchedule.text = "Update Schedule"
    }

    private fun validateForm(): Boolean {
        if (tvSleepTime.text.isEmpty()) {
            Toast.makeText(this, "Please set sleep time", Toast.LENGTH_SHORT).show()
            return false
        }
        if (tvWakeTime.text.isEmpty()) {
            Toast.makeText(this, "Please set wake time", Toast.LENGTH_SHORT).show()
            return false
        }
        return true
    }

    private fun saveSchedule() {
        if (!validateForm()) return

        val sleepSchedule = SleepSchedule(
            id = editingScheduleId,
            isActive = switchActive.isChecked,
            sleepGoals = etSleepGoals.text.toString(),
            sleepTime = tvSleepTime.text.toString(),
            wakeTime = tvWakeTime.text.toString(),
            preferredWakeTime = tvPreferredWakeTime.text.toString(),
            user = User(currentUserId.toString())
        )

        progressBar.visibility = View.VISIBLE
        lifecycleScope.launch {
            try {
                val response = if (editingScheduleId == null) {
                    RetrofitClient.apiService.createSleepScheduleForUser(currentUserId, sleepSchedule)
                } else {
                    RetrofitClient.apiService.updateSleepScheduleForUser(currentUserId, editingScheduleId!!, sleepSchedule)
                }

                if (response.isSuccessful) {
                    clearForm()
                    loadUserSchedules()
                    showToast(if (editingScheduleId == null) "Schedule added" else "Schedule updated")
                } else {
                    showToast("Failed to save schedule")
                }
            } catch (e: Exception) {
                Log.e("SleepScheduleActivity", "saveSchedule failed", e)
                showToast("Network error: ${e.message}")
            } finally {
                progressBar.visibility = View.GONE
            }
        }

        // Add this after successful save:
        val sharedPrefs = getSharedPreferences("SleepSchedulePrefs", MODE_PRIVATE)
        sharedPrefs.edit().apply {
            putString("bedtime", tvSleepTime.text.toString())
            putString("wakeUp", tvWakeTime.text.toString())
            apply()
        }
    }

    private fun deleteSchedule(scheduleId: Long?) {
        if (scheduleId == null) return

        progressBar.visibility = View.VISIBLE
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.apiService.deleteSleepScheduleForUser(currentUserId, scheduleId)
                if (response.isSuccessful) {
                    // Clear SharedPreferences when schedule is deleted
                    val sharedPrefs = getSharedPreferences("SleepSchedulePrefs", MODE_PRIVATE)
                    sharedPrefs.edit().apply {
                        remove("bedtime")
                        remove("wakeUp")
                        apply()
                    }

                    loadUserSchedules()
                    showToast("Schedule deleted")
                } else {
                    showToast("Failed to delete schedule")
                }
            } catch (e: Exception) {
                Log.e("SleepScheduleActivity", "deleteSchedule failed", e)
                showToast("Network error: ${e.message}")
            } finally {
                progressBar.visibility = View.GONE
            }
        }
    }

    private fun toggleScheduleActive(scheduleId: Long?, isActive: Boolean) {
        if (scheduleId == null) return

        progressBar.visibility = View.VISIBLE
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.apiService.getSleepScheduleById(scheduleId)
                if (response.isSuccessful) {
                    response.body()?.let { schedule ->
                        val updatedSchedule = schedule.copy(isActive = isActive)
                        updateSchedule(updatedSchedule)
                    }
                } else {
                    showToast("Failed to update schedule status")
                }
            } catch (e: Exception) {
                Log.e("SleepScheduleActivity", "toggleScheduleActive failed", e)
                showToast("Network error: ${e.message}")
            } finally {
                progressBar.visibility = View.GONE
            }
        }
    }

    private fun updateSchedule(schedule: SleepSchedule) {
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.apiService.updateSleepScheduleForUser(
                    currentUserId,
                    schedule.id!!,
                    schedule
                )
                if (!response.isSuccessful) {
                    showToast("Failed to update schedule")
                }
            } catch (e: Exception) {
                Log.e("SleepScheduleActivity", "updateSchedule failed", e)
                showToast("Network error: ${e.message}")
            }
        }
    }

    // Helper function for showing toasts
    private fun showToast(message: String) {
        runOnUiThread {
            Toast.makeText(this@SleepScheduleActivity, message, Toast.LENGTH_SHORT).show()
        }
    }

    private fun clearForm() {
        editingScheduleId = null
        switchActive.isChecked = false
        etSleepGoals.text.clear()
        tvSleepTime.text = ""
        tvWakeTime.text = ""
        tvPreferredWakeTime.text = ""
        btnAddSchedule.text = "Add Schedule"
    }

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

    private fun setupNavigationDrawer() {
        navigationView.setNavigationItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.nav_dashboard -> {
                    startActivity(Intent(this, HomeActivity::class.java))
                    finish()
                }
                R.id.nav_sleep_schedule -> {
                    // Already on this screen
                }
                R.id.nav_record_sleep -> {
                    startActivity(Intent(this, RecordSleepActivity::class.java))
                    finish()
                }
                R.id.nav_sleep_progress -> {
                    startActivity(Intent(this, SleepProgressActivity::class.java))
                    finish()
                }
                R.id.nav_sleep_tips -> {
                    startActivity(Intent(this, SleepTipsActivity::class.java))
                    finish()
                }
                R.id.nav_logout -> {
                    showLogoutConfirmationDialog()
                }
            }
            drawerLayout.closeDrawer(GravityCompat.START)
            true
        }
    }

    private fun showLogoutConfirmationDialog() {
        AlertDialog.Builder(this)
            .setMessage("Are you sure you want to logout?")
            .setPositiveButton("Yes") { _, _ ->
                // Navigate to LoginActivity
                val intent = Intent(this, LoginActivity::class.java)
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                startActivity(intent)
                finish()
            }
            .setNegativeButton("No", null)
            .show()
    }

    // Handle back button press to close drawer if open
    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }

    private fun navigateToSleepSchedule() {
        // You are already on the sleep schedule screen, so nothing needs to be done here
    }

    private fun navigateToRecordSleep() {
        val intent = Intent(this, RecordSleepActivity::class.java)
        startActivity(intent)
    }

    private fun navigateToSleepProgress() {
        val intent = Intent(this, SleepProgressActivity::class.java)
        startActivity(intent)
    }
}
