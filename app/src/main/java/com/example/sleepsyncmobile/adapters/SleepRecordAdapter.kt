package com.example.sleepsyncmobile.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.example.sleepsyncmobile.R
import com.example.sleepsyncmobile.model.SleepRecord

class SleepRecordAdapter(
    private val records: MutableList<SleepRecord>,
    private val onDelete: (SleepRecord) -> Unit
) : RecyclerView.Adapter<SleepRecordAdapter.SleepRecordViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SleepRecordViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_sleep_record, parent, false)
        return SleepRecordViewHolder(view)
    }

    override fun onBindViewHolder(holder: SleepRecordViewHolder, position: Int) {
        val record = records[position]
        holder.bind(record)
    }

    override fun getItemCount(): Int = records.size

    fun updateData(newData: List<SleepRecord>) {
        val diffCallback = object : DiffUtil.Callback() {
            override fun getOldListSize() = records.size
            override fun getNewListSize() = newData.size
            override fun areItemsTheSame(oldPos: Int, newPos: Int) =
                records[oldPos].id == newData[newPos].id
            override fun areContentsTheSame(oldPos: Int, newPos: Int) =
                records[oldPos] == newData[newPos]
        }

        val diffResult = DiffUtil.calculateDiff(diffCallback)
        records.clear()
        records.addAll(newData)
        diffResult.dispatchUpdatesTo(this)
    }

    fun addRecord(record: SleepRecord) {
        records.add(0, record)
        notifyItemInserted(0)
    }

    fun removeRecord(record: SleepRecord) {
        val index = records.indexOf(record)
        if (index != -1) {
            records.removeAt(index)
            notifyItemRemoved(index)
        }
    }

    inner class SleepRecordViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val recordText: TextView = itemView.findViewById(R.id.recordText)
        private val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)

        fun bind(record: SleepRecord) {
            recordText.text = "${record.date} | ${record.sleepStart} ➔ ${record.sleepEnd}"

            deleteButton.setOnClickListener {
                onDelete(record)
            }
        }
    }
}