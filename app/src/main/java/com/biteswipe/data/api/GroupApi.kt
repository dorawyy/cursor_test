package com.biteswipe.data.api

import com.biteswipe.data.model.Group
import com.biteswipe.data.model.GroupPreferences
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

interface GroupApiService {
    @GET("groups/my-groups")
    suspend fun getUserGroups(): List<Group>

    @POST("groups")
    suspend fun createGroup(
        @Body request: CreateGroupRequest
    ): Group

    @POST("groups/{groupId}/join")
    suspend fun joinGroup(
        @Path("groupId") groupId: String
    ): Group

    @POST("groups/{groupId}/leave")
    suspend fun leaveGroup(
        @Path("groupId") groupId: String
    ): Group

    @GET("groups/{groupId}")
    suspend fun getGroupDetails(
        @Path("groupId") groupId: String
    ): Group
}

data class CreateGroupRequest(
    val name: String,
    val preferences: GroupPreferences
)

class GroupApi {
    private val baseUrl = "http://your-api-url.com/api/" // TODO: Replace with actual API URL

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val client = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .build()

    private val retrofit = Retrofit.Builder()
        .baseUrl(baseUrl)
        .client(client)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    private val apiService = retrofit.create(GroupApiService::class.java)

    suspend fun getUserGroups(): List<Group> {
        return apiService.getUserGroups()
    }

    suspend fun createGroup(name: String, preferences: GroupPreferences): Group {
        return apiService.createGroup(CreateGroupRequest(name, preferences))
    }

    suspend fun joinGroup(groupId: String): Group {
        return apiService.joinGroup(groupId)
    }

    suspend fun leaveGroup(groupId: String): Group {
        return apiService.leaveGroup(groupId)
    }

    suspend fun getGroupDetails(groupId: String): Group {
        return apiService.getGroupDetails(groupId)
    }
} 