import React, { useEffect, useRef } from 'react';
import { Site } from '@/types';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAxxjdB_FKjWYEbH1HQC1yni4IEuHwKvw8';

interface GoogleMapWithMarkersProps {
  sites: Site[];
}

const GoogleMapWithMarkers: React.FC<GoogleMapWithMarkersProps> = ({ sites }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else {
      initMap();
    }
    // eslint-disable-next-line
  }, [sites]);

  const initMap = () => {
    if (!mapRef.current) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 20.254, lng: -9.2399 },
      zoom: 6,
    });
    sites.forEach(site => {
      if (site.latitude && site.longitude) {
        new window.google.maps.Marker({
          position: { lat: site.latitude, lng: site.longitude },
          map,
          title: site.name,
        });
      }
    });
  };

  return <div ref={mapRef} style={{ width: '100%', height: 400, borderRadius: 12, overflow: 'hidden', margin: '0 auto', maxWidth: 800 }} />;
};

export default GoogleMapWithMarkers;
