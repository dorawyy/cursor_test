package com.biteswipe.data.model

import com.google.android.gms.maps.model.LatLng

data class Restaurant(
    val id: String,
    val name: String,
    val address: String,
    val rating: Double,
    val location: LatLng,
    val photoUrl: String? = null,
    val cuisine: List<String> = emptyList(),
    val priceLevel: Int = 0,
    val openingHours: OpeningHours? = null
)

data class OpeningHours(
    val isOpenNow: Boolean,
    val periods: List<Period> = emptyList(),
    val weekdayText: List<String> = emptyList()
)

data class Period(
    val open: TimeInfo,
    val close: TimeInfo
)

data class TimeInfo(
    val day: Int,
    val time: String
) 