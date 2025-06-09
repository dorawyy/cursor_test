package com.biteswipe.ui.groups

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.biteswipe.databinding.FragmentGroupsBinding
import com.google.android.material.dialog.MaterialAlertDialogBuilder

class GroupsFragment : Fragment() {
    private var _binding: FragmentGroupsBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: GroupsViewModel
    private lateinit var adapter: GroupsAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentGroupsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = ViewModelProvider(this)[GroupsViewModel::class.java]

        setupRecyclerView()
        setupFab()
        observeViewModel()
    }

    private fun setupRecyclerView() {
        adapter = GroupsAdapter(
            onGroupClick = { group ->
                findNavController().navigate(
                    GroupsFragmentDirections.actionGroupsToGroupDetails(group.id)
                )
            },
            onJoinClick = { group ->
                viewModel.joinGroup(group.id)
            }
        )

        binding.recyclerViewGroups.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = this@GroupsFragment.adapter
        }
    }

    private fun setupFab() {
        binding.fabCreateGroup.setOnClickListener {
            showCreateGroupDialog()
        }
    }

    private fun showCreateGroupDialog() {
        val dialogBinding = layoutInflater.inflate(R.layout.dialog_create_group, null)
        MaterialAlertDialogBuilder(requireContext())
            .setTitle(R.string.groups_create)
            .setView(dialogBinding)
            .setPositiveButton(R.string.create) { _, _ ->
                val name = dialogBinding.findViewById<EditText>(R.id.editTextGroupName).text.toString()
                viewModel.createGroup(name)
            }
            .setNegativeButton(R.string.cancel, null)
            .show()
    }

    private fun observeViewModel() {
        viewModel.groups.observe(viewLifecycleOwner) { groups ->
            adapter.submitList(groups)
            binding.emptyView.visibility = if (groups.isEmpty()) View.VISIBLE else View.GONE
        }

        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        viewModel.error.observe(viewLifecycleOwner) { error ->
            error?.let {
                MaterialAlertDialogBuilder(requireContext())
                    .setTitle(R.string.error)
                    .setMessage(it)
                    .setPositiveButton(R.string.ok, null)
                    .show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
} 