package com.example.sleepsyncmobile

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.navigation.NavigationView
import androidx.core.view.GravityCompat
import com.example.sleepsyncmobile.adapters.SleepRecordAdapter
import com.example.sleepsyncmobile.model.SleepRecord
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.text.SimpleDateFormat
import java.util.*

class RecordSleepActivity : AppCompatActivity() {

    // Views
    private lateinit var startSleepButton: Button
    private lateinit var stopSleepButton: Button
    private lateinit var sleepRecordsRecyclerView: RecyclerView
    private lateinit var timerTextView: TextView
    private lateinit var drawerLayout: DrawerLayout

    // Adapter and Data
    private lateinit var adapter: SleepRecordAdapter
    private val sleepRecords = mutableListOf<SleepRecord>()
    private var recordIdCounter = 0

    // Timer related
    private var isSleeping = false
    private var sleepStartTime: Long = 0
    private val handler = Handler(Looper.getMainLooper())

    // User info
    private var firstName: String = "User"
    private var email: String = "user@example.com"

    override fun onResume() {
        super.onResume()
        // This ensures consistency when returning from other activities
        adapter.updateData(sleepRecords)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_record_sleep)

        // Initialize all views first
        initializeViews()

        // Setup RecyclerView and adapter
        setupRecyclerView()

        // Load user data and setup navigation
        setupUserData()
        setupNavigation()

        // Setup timer buttons
        setupTimerButtons()

        // Finally load records
        loadRecords()
    }

    private fun initializeViews() {
        drawerLayout = findViewById(R.id.drawerLayout)
        startSleepButton = findViewById(R.id.startSleepButton)
        stopSleepButton = findViewById(R.id.stopSleepButton)
        sleepRecordsRecyclerView = findViewById(R.id.sleepRecordsRecyclerView)
        timerTextView = findViewById(R.id.timerTextView)
    }

    private fun setupRecyclerView() {
        adapter = SleepRecordAdapter(
            sleepRecords.toMutableList(),
            onDelete = { record -> showDeleteConfirmationDialog(record) }
        )
        sleepRecordsRecyclerView.layoutManager = LinearLayoutManager(this)
        sleepRecordsRecyclerView.adapter = adapter
    }

    private fun showDeleteConfirmationDialog(record: SleepRecord) {
        AlertDialog.Builder(this)
            .setTitle("Delete Record")
            .setMessage("Are you sure you want to delete this record?")
            .setPositiveButton("Delete") { _, _ ->
                // Add a slight delay to ensure dialog is dismissed first
                sleepRecordsRecyclerView.postDelayed({
                    deleteRecord(record)
                }, 300)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun setupUserData() {
        val sharedPreferences = getSharedPreferences("UserPrefs", MODE_PRIVATE)
        firstName = sharedPreferences.getString("first_name", "User") ?: "User"
        email = sharedPreferences.getString("email", "user@example.com") ?: "user@example.com"
    }

    private fun setupNavigation() {
        val navigationView: NavigationView = findViewById(R.id.nav_view)
        navigationView.setNavigationItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.nav_dashboard -> navigateTo(HomeActivity::class.java)
                R.id.nav_sleep_schedule -> navigateTo(SleepScheduleActivity::class.java)
                R.id.nav_record_sleep -> showToast("You're already in Sleep Records")
                R.id.nav_sleep_progress -> navigateTo(SleepProgressActivity::class.java)
                R.id.nav_sleep_tips -> navigateTo(SleepTipsActivity::class.java)
                R.id.nav_logout -> showLogoutConfirmationDialog()
            }
            drawerLayout.closeDrawer(GravityCompat.START)
            true
        }

        findViewById<ImageView>(R.id.menuButton).setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)
        }

        findViewById<ImageView>(R.id.profileIcon).setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)
        }

        setupNavHeader()
    }

    private fun setupNavHeader() {
        val headerView = findViewById<NavigationView>(R.id.nav_view).getHeaderView(0)
        headerView.findViewById<TextView>(R.id.nav_welcome_text).text = "Welcome, $firstName!"
        headerView.findViewById<TextView>(R.id.nav_email_text).text = email
    }

    private fun getSleepDurationInHours(millis: Long): Double {
        return millis.toDouble() / (1000 * 60 * 60) // Convert milliseconds to hours
    }

    private fun setupTimerButtons() {
        startSleepButton.setOnClickListener { startSleeping() }
        stopSleepButton.setOnClickListener { stopSleeping() }
        stopSleepButton.isEnabled = false // Initially disabled
    }

    private fun loadRecords() {
        val sharedPreferences = getSharedPreferences("SleepRecords", MODE_PRIVATE)
        val json = sharedPreferences.getString("records", null) ?: return

        Log.d("RecordSleep", "Loading records from JSON: $json")

        try {
            val type = object : TypeToken<List<SleepRecord>>() {}.type
            val savedRecords: List<SleepRecord> = Gson().fromJson(json, type)

            Log.d("RecordSleep", "Loaded ${savedRecords.size} records")

            // Verify if the deleted record is still in the loaded data
            savedRecords.forEach { record ->
                Log.d("RecordSleep", "Loaded record: ${record.id} - ${record.date}")
            }

            runOnUiThread {
                sleepRecords.clear()
                sleepRecords.addAll(savedRecords)
                adapter.updateData(sleepRecords.toMutableList())
            }
        } catch (e: Exception) {
            Log.e("RecordSleep", "Error loading records", e)
        }
    }

    private fun saveRecords() {
        try {
            val sharedPrefs = getSharedPreferences("SleepRecords", MODE_PRIVATE)
            with(sharedPrefs.edit()) {
                putString("records", Gson().toJson(sleepRecords))
                commit() // Use commit() instead of apply() for immediate write
            }
        } catch (e: Exception) {
            Log.e("RecordSleep", "Failed to save records", e)
        }
    }

    private fun startSleeping() {
        if (!isSleeping) {
            isSleeping = true
            sleepStartTime = System.currentTimeMillis()
            handler.post(updateTimerRunnable)
            showToast("Good night!")
            startSleepButton.isEnabled = false
            stopSleepButton.isEnabled = true
        }
    }

    private fun stopSleeping() {
        if (isSleeping) {
            isSleeping = false
            handler.removeCallbacks(updateTimerRunnable)

            val sleepEndTime = System.currentTimeMillis()
            val durationMillis = sleepEndTime - sleepStartTime
            val durationHours = getSleepDurationInHours(durationMillis)

            val dateFormat = SimpleDateFormat("hh:mm a", Locale.getDefault())
            val dateOnlyFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())

            val newRecord = SleepRecord(
                id = recordIdCounter++,
                date = dateOnlyFormat.format(Date()),
                sleepStart = dateFormat.format(Date(sleepStartTime)),
                sleepEnd = dateFormat.format(Date(sleepEndTime)),
                duration = formatDuration(durationMillis),
                durationHours = durationHours // Add this new field
            )

            runOnUiThread {
                sleepRecords.add(0, newRecord)
                adapter.updateData(sleepRecords.toMutableList())
                saveRecords()
                resetTimerUI()
                showToast("Sleep Recorded Successfully")
            }
        }
    }

    private fun formatDuration(millis: Long): String {
        val hours = (millis / (1000 * 60 * 60)).toInt()
        val minutes = ((millis / (1000 * 60)) % 60).toInt()
        return "${hours}h ${minutes}m"
    }

    private fun resetTimerUI() {
        timerTextView.text = "00:00:00"
        startSleepButton.isEnabled = true
        stopSleepButton.isEnabled = false
    }

    private val updateTimerRunnable = object : Runnable {
        override fun run() {
            val elapsed = System.currentTimeMillis() - sleepStartTime
            val seconds = (elapsed / 1000) % 60
            val minutes = (elapsed / (1000 * 60)) % 60
            val hours = (elapsed / (1000 * 60 * 60))
            timerTextView.text = String.format("%02d:%02d:%02d", hours, minutes, seconds)
            handler.postDelayed(this, 1000)
        }
    }

    private fun deleteRecord(record: SleepRecord) {
        // 1. Find the exact record to delete (using ID)
        val index = sleepRecords.indexOfFirst { it.id == record.id }
        if (index == -1) return

        // 2. Create a NEW list without the item (to avoid concurrency issues)
        val newList = sleepRecords.toMutableList().apply { removeAt(index) }

        // 3. Update the activity's list
        sleepRecords.clear()
        sleepRecords.addAll(newList)

        // 4. Save to SharedPreferences FIRST
        saveRecords()

        // 5. Then update the adapter
        adapter.updateData(newList)

        // Optional: Scroll to position if needed
        sleepRecordsRecyclerView.post {
            if (index < newList.size) {
                sleepRecordsRecyclerView.scrollToPosition(index)
            }
        }
    }

    private fun navigateTo(destination: Class<*>) {
        startActivity(Intent(this, destination))
    }

    private fun showLogoutConfirmationDialog() {
        AlertDialog.Builder(this)
            .setMessage("Are you sure you want to logout?")
            .setPositiveButton("Yes") { _, _ ->
                val intent = Intent(this, LoginActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                }
                startActivity(intent)
                finish()
            }
            .setNegativeButton("No", null)
            .show()
    }

    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}