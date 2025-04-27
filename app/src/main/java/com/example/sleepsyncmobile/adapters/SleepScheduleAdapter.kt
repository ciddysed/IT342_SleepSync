package com.example.sleepsyncmobile.adapters

import android.annotation.SuppressLint
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.Switch
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.sleepsyncmobile.R
import com.example.sleepsyncmobile.model.SleepSchedule

class SleepScheduleAdapter(
    private var schedules: List<SleepSchedule>,
    private val onEditClick: (SleepSchedule) -> Unit,
    private val onDeleteClick: (SleepSchedule) -> Unit,
    private val onToggleActive: (SleepSchedule, Boolean) -> Unit
) : RecyclerView.Adapter<SleepScheduleAdapter.SleepScheduleViewHolder>() {

    inner class SleepScheduleViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tvSleepTime: TextView = itemView.findViewById(R.id.tvItemSleepTime)
        private val tvWakeTime: TextView = itemView.findViewById(R.id.tvItemWakeTime)
        private val tvPreferredWakeTime: TextView = itemView.findViewById(R.id.tvItemPreferredWakeTime)
        private val tvSleepGoals: TextView = itemView.findViewById(R.id.tvItemSleepGoals)
        @SuppressLint("UseSwitchCompatOrMaterialCode")
        private val switchActive: Switch = itemView.findViewById(R.id.switchItemActive)
        private val btnEdit: Button = itemView.findViewById(R.id.btnEdit)
        private val btnDelete: Button = itemView.findViewById(R.id.btnDelete)

        fun bind(schedule: SleepSchedule) {
            tvSleepTime.text = schedule.sleepTime
            tvWakeTime.text = schedule.wakeTime
            tvPreferredWakeTime.text = schedule.preferredWakeTime
            tvSleepGoals.text = schedule.sleepGoals
            switchActive.isChecked = schedule.isActive

            btnEdit.setOnClickListener { onEditClick(schedule) }
            btnDelete.setOnClickListener { onDeleteClick(schedule) }
            switchActive.setOnCheckedChangeListener { _, isChecked ->
                onToggleActive(schedule, isChecked)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SleepScheduleViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_sleep_schedule, parent, false)
        return SleepScheduleViewHolder(view)
    }

    override fun onBindViewHolder(holder: SleepScheduleViewHolder, position: Int) {
        holder.bind(schedules[position])
    }

    override fun getItemCount(): Int = schedules.size

    @SuppressLint("NotifyDataSetChanged")
    fun updateData(newSchedules: List<SleepSchedule>) {
        schedules = newSchedules
        notifyDataSetChanged()
    }
}