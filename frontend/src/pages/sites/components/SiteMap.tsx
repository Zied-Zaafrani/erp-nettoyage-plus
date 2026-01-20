import React, { useEffect, useRef, useState } from 'react';
import { Site } from '@/services/api/sitesApi';

// Note: In a real app, move this to env vars
const GOOGLE_MAPS_API_KEY = 'AIzaSyAxxjdB_FKjWYEbH1HQC1yni4IEuHwKvw8';

interface SiteMapProps {
    sites: Site[];
    selectedSite?: Site | null;
    searchQuery?: string;
    onSiteSelect?: (site: Site) => void;
}

declare global {
    interface Window {
        google: any;
    }
}

export default function SiteMap({ sites, selectedSite, searchQuery, onSiteSelect }: SiteMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const geocoderRef = useRef<any>(null);
    const ghostMarkerRef = useRef<any>(null);

    // Initialize Map
    useEffect(() => {
        const loadMap = () => {
            // Check if script is already present
            const existingScript = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');

            if (!window.google && !existingScript) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
                script.async = true;
                script.onload = initMap;
                document.body.appendChild(script);
            } else if (!window.google && existingScript) {
                // Script loaded by another component but window.google not ready yet? 
                // Wait for it.
                const checkGoogle = setInterval(() => {
                    if (window.google) {
                        clearInterval(checkGoogle);
                        initMap();
                    }
                }, 100);
            } else {
                initMap();
            }
        };

        const initMap = () => {
            if (mapRef.current && !mapInstanceRef.current) {
                mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                    center: { lat: 48.8566, lng: 2.3522 }, // Paris default
                    zoom: 6,
                    mapId: 'DEMO_MAP_ID', // Required for advanced markers if used
                    mapTypeControl: false,
                    streetViewControl: false,
                });
                geocoderRef.current = new window.google.maps.Geocoder();
            }
            updateMarkers();
        };

        loadMap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update Markers when sites change
    useEffect(() => {
        updateMarkers();
    }, [sites]);

    // Handle Search via Geocoding if database search is empty
    useEffect(() => {
        if (!mapInstanceRef.current || !geocoderRef.current) return;

        // Ensure we clear the ghost marker if search effectively clears
        if (!searchQuery) {
            if (ghostMarkerRef.current) {
                ghostMarkerRef.current.setMap(null);
                ghostMarkerRef.current = null;
            }
            return;
        }

        // If sites list is empty but we have a query, try to geocode
        if (sites.length === 0 && searchQuery) {
            geocoderRef.current.geocode({ address: searchQuery }, (results: any[], status: string) => {
                if (status === 'OK' && results[0]) {
                    const location = results[0].geometry.location;
                    mapInstanceRef.current.setCenter(location);
                    mapInstanceRef.current.setZoom(14);

                    // Add a "Ghost" marker to show where the search found
                    if (ghostMarkerRef.current) ghostMarkerRef.current.setMap(null);

                    ghostMarkerRef.current = new window.google.maps.Marker({
                        position: location,
                        map: mapInstanceRef.current,
                        title: searchQuery,
                        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Different color
                        animation: window.google.maps.Animation.DROP,
                    });
                } else {
                    console.warn('Geocoding failed:', status);
                    // Optional: Notify user that address wasn't found or API error
                }
            });
        }
    }, [searchQuery, sites.length]);

    // Focus on selected site
    useEffect(() => {
        if (selectedSite && selectedSite.coordinates && mapInstanceRef.current) {
            const { latitude, longitude } = selectedSite.coordinates;
            if (latitude && longitude) {
                mapInstanceRef.current.panTo({ lat: latitude, lng: longitude });
                mapInstanceRef.current.setZoom(15);
            }
        }
    }, [selectedSite]);

    const updateMarkers = () => {
        if (!window.google || !mapInstanceRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Clear ghost marker if we have real sites
        if (sites.length > 0 && ghostMarkerRef.current) {
            ghostMarkerRef.current.setMap(null);
            ghostMarkerRef.current = null;
        }

        const bounds = new window.google.maps.LatLngBounds();
        let hasValidCoords = false;

        sites.forEach(site => {
            if (site.coordinates?.latitude && site.coordinates?.longitude) {
                const position = {
                    lat: site.coordinates.latitude,
                    lng: site.coordinates.longitude
                };

                const marker = new window.google.maps.Marker({
                    position,
                    map: mapInstanceRef.current,
                    title: site.name,
                    // animation: window.google.maps.Animation.DROP, // Remove drop on update to prevent lag
                });

                marker.addListener('click', () => {
                    if (onSiteSelect) {
                        onSiteSelect(site);
                    }
                });

                markersRef.current.push(marker);
                bounds.extend(position);
                hasValidCoords = true;
            }
        });

        // Fit bounds if we have points and no specific site selected
        if (hasValidCoords && !selectedSite) {
            if (sites.length === 1) {
                // If only 1 site, set center and reasonable zoom instead of fitBounds (which might be too close)
                const site = sites[0];
                if (site.coordinates?.latitude && site.coordinates?.longitude) {
                    mapInstanceRef.current.setCenter({ lat: site.coordinates.latitude, lng: site.coordinates.longitude });
                    mapInstanceRef.current.setZoom(15);
                }
            } else {
                mapInstanceRef.current.fitBounds(bounds);
            }
        }
    };

    return (
        <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
}
