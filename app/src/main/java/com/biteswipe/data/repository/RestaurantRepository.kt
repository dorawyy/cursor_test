package com.biteswipe.data.repository

import com.biteswipe.data.api.RestaurantApi
import com.biteswipe.data.model.Restaurant
import com.google.android.gms.maps.model.LatLng
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class RestaurantRepository {
    private val api = RestaurantApi()

    suspend fun getNextRestaurant(): Restaurant = withContext(Dispatchers.IO) {
        // TODO: Implement actual API call
        // For now, return mock data
        Restaurant(
            id = "1",
            name = "Sample Restaurant",
            address = "123 Main St, Vancouver, BC",
            rating = 4.5,
            location = LatLng(49.2827, -123.1207),
            photoUrl = "https://example.com/photo.jpg",
            cuisine = listOf("italian", "pizza"),
            priceLevel = 2
        )
    }

    suspend fun likeRestaurant(restaurantId: String) = withContext(Dispatchers.IO) {
        // TODO: Implement actual API call
        api.likeRestaurant(restaurantId)
    }

    suspend fun dislikeRestaurant(restaurantId: String) = withContext(Dispatchers.IO) {
        // TODO: Implement actual API call
        api.dislikeRestaurant(restaurantId)
    }

    suspend fun getRestaurantsByLocation(location: LatLng, radius: Int): List<Restaurant> = withContext(Dispatchers.IO) {
        // TODO: Implement actual API call
        api.getRestaurantsByLocation(location, radius)
    }
} 