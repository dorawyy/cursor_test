package com.biteswipe.ui.groups

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.biteswipe.data.model.Group
import com.biteswipe.data.repository.GroupRepository
import kotlinx.coroutines.launch

class GroupsViewModel : ViewModel() {
    private val repository = GroupRepository()

    private val _groups = MutableLiveData<List<Group>>()
    val groups: LiveData<List<Group>> = _groups

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    init {
        loadGroups()
    }

    fun loadGroups() {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null
                val userGroups = repository.getUserGroups()
                _groups.value = userGroups
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun createGroup(name: String) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null
                repository.createGroup(name)
                loadGroups()
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun joinGroup(groupId: String) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null
                repository.joinGroup(groupId)
                loadGroups()
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun leaveGroup(groupId: String) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null
                repository.leaveGroup(groupId)
                loadGroups()
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }
} 