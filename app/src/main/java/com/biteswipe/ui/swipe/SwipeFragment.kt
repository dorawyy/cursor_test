package com.biteswipe.ui.swipe

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.biteswipe.databinding.FragmentSwipeBinding
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions

class SwipeFragment : Fragment() {
    private var _binding: FragmentSwipeBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: SwipeViewModel
    private var googleMap: GoogleMap? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSwipeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = ViewModelProvider(this)[SwipeViewModel::class.java]

        setupMap()
        setupSwipeButtons()
        observeViewModel()
    }

    private fun setupMap() {
        val mapFragment = childFragmentManager.findFragmentById(com.biteswipe.R.id.map) as SupportMapFragment
        mapFragment.getMapAsync { map ->
            googleMap = map
            // Set default location (you can update this based on user's location)
            val defaultLocation = LatLng(49.2827, -123.1207) // Vancouver coordinates
            map.moveCamera(CameraUpdateFactory.newLatLngZoom(defaultLocation, 12f))
        }
    }

    private fun setupSwipeButtons() {
        binding.buttonDislike.setOnClickListener {
            viewModel.onDislike()
        }

        binding.buttonLike.setOnClickListener {
            viewModel.onLike()
        }
    }

    private fun observeViewModel() {
        viewModel.currentRestaurant.observe(viewLifecycleOwner) { restaurant ->
            restaurant?.let {
                binding.restaurantName.text = it.name
                binding.restaurantAddress.text = it.address
                binding.restaurantRating.rating = it.rating.toFloat()

                // Update map marker
                googleMap?.clear()
                googleMap?.addMarker(
                    MarkerOptions()
                        .position(it.location)
                        .title(it.name)
                )
                googleMap?.moveCamera(CameraUpdateFactory.newLatLng(it.location))
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
} 