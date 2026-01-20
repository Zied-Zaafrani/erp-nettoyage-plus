import React from 'react';

const GoogleMapEmbed: React.FC = () => (
  <div style={{ width: '100%', height: 400, borderRadius: 12, overflow: 'hidden', margin: '0 auto', maxWidth: 800 }}>
    <iframe
      title="Carte Mauritanie Google Maps"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15921713.964479616!2d-17.5!3d20.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11b3e6b2e2e2e2e3%3A0x2e2e2e2e2e2e2e2e!2sMauritania!5e0!3m2!1sfr!2sfr!4v1705760000000!5m2!1sfr!2sfr"
    ></iframe>
  </div>
);

export default GoogleMapEmbed;
