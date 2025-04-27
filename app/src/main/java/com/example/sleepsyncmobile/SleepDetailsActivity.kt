package com.example.sleepsyncmobile

import android.graphics.Color
import android.os.Bundle
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import com.example.sleepsyncmobile.model.SleepRecord
import com.github.mikephil.charting.charts.BarChart
import com.github.mikephil.charting.components.LimitLine
import com.github.mikephil.charting.components.XAxis
import com.github.mikephil.charting.data.BarData
import com.github.mikephil.charting.data.BarDataSet
import com.github.mikephil.charting.data.BarEntry
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.text.SimpleDateFormat
import java.util.*

class SleepDetailsActivity : AppCompatActivity() {

    private lateinit var barChart: BarChart

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sleep_details)

        barChart = findViewById(R.id.barChart)

        // Setup back button
        findViewById<ImageView>(R.id.backButton).setOnClickListener {
            onBackPressedDispatcher.onBackPressed() // Recommended (handles back navigation properly)
            // OR
            // onBackPressed() // Deprecated in newer Android versions, but still works
        }

        setupBarChart()
        loadSleepData()
    }

    private fun setupBarChart() {
        // Basic chart configuration
        barChart.setDrawBarShadow(false)
        barChart.setDrawValueAboveBar(true)
        barChart.description.isEnabled = false
        barChart.legend.isEnabled = false
        barChart.setPinchZoom(false)
        barChart.setDrawGridBackground(false)

        // X-axis configuration
        val xAxis = barChart.xAxis
        xAxis.position = XAxis.XAxisPosition.BOTTOM
        xAxis.setDrawGridLines(false)
        xAxis.granularity = 1f
        xAxis.labelCount = 7 // Show max 7 days

        // Y-axis configuration (left)
        val leftAxis = barChart.axisLeft
        leftAxis.axisMinimum = 0f
        leftAxis.granularity = 1f
        leftAxis.setDrawGridLines(true)

        // Y-axis configuration (right)
        barChart.axisRight.isEnabled = false
    }

    private fun loadSleepData() {
        val sharedPreferences = getSharedPreferences("SleepRecords", MODE_PRIVATE)
        val json = sharedPreferences.getString("records", null) ?: return

        try {
            val type = object : TypeToken<List<SleepRecord>>() {}.type
            val records: List<SleepRecord> = Gson().fromJson(json, type)

            // Sort records by date (newest first)
            val sortedRecords = records.sortedByDescending {
                SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).parse(it.date)
            }.take(7) // Take only last 7 records

            if (sortedRecords.isEmpty()) return

            // Prepare data for chart
            val entries = ArrayList<BarEntry>()
            val dates = ArrayList<String>()

            sortedRecords.forEachIndexed { index, record ->
                entries.add(BarEntry(
                    index.toFloat(),
                    record.durationHours?.toFloat() ?: 0f
                ))
                dates.add(record.date)
            }

            // Reverse to show chronological order (oldest to newest)
            entries.reverse()
            dates.reverse()

            // Create dataset
            val dataSet = BarDataSet(entries, "Sleep Hours")
            dataSet.color = Color.parseColor("#3F51B5") // Bar color
            dataSet.valueTextColor = Color.BLACK
            dataSet.valueTextSize = 12f

            // Set X-axis labels
            barChart.xAxis.valueFormatter = IndexAxisValueFormatter(dates)

            // Create bar data and set to chart
            val barData = BarData(dataSet)
            barData.barWidth = 0.5f
            barChart.data = barData

            // Add quality markers
            addQualityMarkers()

            // Refresh chart
            barChart.invalidate()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun addQualityMarkers() {
        val leftAxis = barChart.axisLeft

        // Very Good threshold (8 hours)
        val veryGoodLimit = LimitLine(8f, "Very Good").apply {
            lineColor = Color.GREEN
            lineWidth = 1f
            textColor = Color.BLACK
            textSize = 10f
        }
        leftAxis.addLimitLine(veryGoodLimit)

        // Good threshold (5 hours)
        val goodLimit = LimitLine(5f, "Good").apply {
            lineColor = Color.BLUE
            lineWidth = 1f
            textColor = Color.BLACK
            textSize = 10f
        }
        leftAxis.addLimitLine(goodLimit)
    }
}