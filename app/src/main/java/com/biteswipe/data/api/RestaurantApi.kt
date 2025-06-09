package com.biteswipe.data.api

import com.biteswipe.data.model.Restaurant
import com.google.android.gms.maps.model.LatLng
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

interface RestaurantApiService {
    @GET("restaurants/next")
    suspend fun getNextRestaurant(): Restaurant

    @POST("restaurants/{id}/like")
    suspend fun likeRestaurant(@Path("id") restaurantId: String)

    @POST("restaurants/{id}/dislike")
    suspend fun dislikeRestaurant(@Path("id") restaurantId: String)

    @GET("restaurants/nearby")
    suspend fun getRestaurantsByLocation(
        @Query("lat") latitude: Double,
        @Query("lng") longitude: Double,
        @Query("radius") radius: Int
    ): List<Restaurant>
}

class RestaurantApi {
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

    private val apiService = retrofit.create(RestaurantApiService::class.java)

    suspend fun getNextRestaurant(): Restaurant {
        return apiService.getNextRestaurant()
    }

    suspend fun likeRestaurant(restaurantId: String) {
        apiService.likeRestaurant(restaurantId)
    }

    suspend fun dislikeRestaurant(restaurantId: String) {
        apiService.dislikeRestaurant(restaurantId)
    }

    suspend fun getRestaurantsByLocation(location: LatLng, radius: Int): List<Restaurant> {
        return apiService.getRestaurantsByLocation(location.latitude, location.longitude, radius)
    }
} 