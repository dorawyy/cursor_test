package com.biteswipe.ui.swipe

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.biteswipe.data.model.Restaurant
import com.biteswipe.data.repository.RestaurantRepository
import com.google.android.gms.maps.model.LatLng
import kotlinx.coroutines.launch

class SwipeViewModel : ViewModel() {
    private val repository = RestaurantRepository()

    private val _currentRestaurant = MutableLiveData<Restaurant>()
    val currentRestaurant: LiveData<Restaurant> = _currentRestaurant

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _error = MutableLiveData<String>()
    val error: LiveData<String> = _error

    init {
        loadNextRestaurant()
    }

    fun onLike() {
        viewModelScope.launch {
            try {
                _currentRestaurant.value?.let { restaurant ->
                    repository.likeRestaurant(restaurant.id)
                    loadNextRestaurant()
                }
            } catch (e: Exception) {
                _error.value = e.message
            }
        }
    }

    fun onDislike() {
        viewModelScope.launch {
            try {
                _currentRestaurant.value?.let { restaurant ->
                    repository.dislikeRestaurant(restaurant.id)
                    loadNextRestaurant()
                }
            } catch (e: Exception) {
                _error.value = e.message
            }
        }
    }

    private fun loadNextRestaurant() {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                val restaurant = repository.getNextRestaurant()
                _currentRestaurant.value = restaurant
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }
} 