import React from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const GoogleMapMauritania: React.FC = () => {
  return (
    <div style={{ width: '100%', height: 400, borderRadius: 12, overflow: 'hidden', margin: '0 auto', maxWidth: 800 }}>
      <iframe
        title="Carte Mauritanie Google Maps"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=20.2540,-10.9220&zoom=6&maptype=roadmap`}
      ></iframe>
    </div>
  );
};

export default GoogleMapMauritania;
