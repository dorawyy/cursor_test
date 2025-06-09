package com.biteswipe.ui.groups

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.biteswipe.data.model.Group
import com.biteswipe.databinding.ItemGroupBinding

class GroupsAdapter(
    private val onGroupClick: (Group) -> Unit,
    private val onJoinClick: (Group) -> Unit
) : ListAdapter<Group, GroupsAdapter.GroupViewHolder>(GroupDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): GroupViewHolder {
        val binding = ItemGroupBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return GroupViewHolder(binding)
    }

    override fun onBindViewHolder(holder: GroupViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class GroupViewHolder(
        private val binding: ItemGroupBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        init {
            binding.root.setOnClickListener {
                val position = bindingAdapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onGroupClick(getItem(position))
                }
            }

            binding.buttonJoin.setOnClickListener {
                val position = bindingAdapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onJoinClick(getItem(position))
                }
            }
        }

        fun bind(group: Group) {
            binding.apply {
                textGroupName.text = group.name
                textMemberCount.text = "${group.members.size} members"
                textStatus.text = group.status.name
                buttonJoin.text = if (group.members.any { it.id == "current_user_id" }) {
                    "Leave"
                } else {
                    "Join"
                }
            }
        }
    }

    private class GroupDiffCallback : DiffUtil.ItemCallback<Group>() {
        override fun areItemsTheSame(oldItem: Group, newItem: Group): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Group, newItem: Group): Boolean {
            return oldItem == newItem
        }
    }
} 