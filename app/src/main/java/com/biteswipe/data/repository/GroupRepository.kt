package com.biteswipe.data.repository

import com.biteswipe.data.api.GroupApi
import com.biteswipe.data.model.Group
import com.biteswipe.data.model.GroupPreferences
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class GroupRepository {
    private val api = GroupApi()

    suspend fun getUserGroups(): List<Group> = withContext(Dispatchers.IO) {
        api.getUserGroups()
    }

    suspend fun createGroup(name: String, preferences: GroupPreferences = GroupPreferences()): Group = withContext(Dispatchers.IO) {
        api.createGroup(name, preferences)
    }

    suspend fun joinGroup(groupId: String): Group = withContext(Dispatchers.IO) {
        api.joinGroup(groupId)
    }

    suspend fun leaveGroup(groupId: String): Group = withContext(Dispatchers.IO) {
        api.leaveGroup(groupId)
    }

    suspend fun getGroupDetails(groupId: String): Group = withContext(Dispatchers.IO) {
        api.getGroupDetails(groupId)
    }
} 