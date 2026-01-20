import React, { useRef, useState } from 'react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAxxjdB_FKjWYEbH1HQC1yni4IEuHwKvw8';

const GoogleMapSearch: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!query.trim()) return;
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`);
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        if (window.google && mapRef.current) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: location,
            zoom: 14,
          });
          new window.google.maps.Marker({
            position: location,
            map,
            title: query,
          });
        }
      } else {
        setError('Lieu non trouvé.');
      }
    } catch (err) {
      setError('Erreur lors de la recherche.');
    }
  };

  React.useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = () => {
        if (mapRef.current) {
          new window.google.maps.Map(mapRef.current, {
            center: { lat: 20.254, lng: -9.2399 },
            zoom: 6,
          });
        }
      };
      document.body.appendChild(script);
    } else {
      if (mapRef.current) {
        new window.google.maps.Map(mapRef.current, {
          center: { lat: 20.254, lng: -9.2399 },
          zoom: 6,
        });
      }
    }
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto mb-6">
      <form onSubmit={handleSearch} className="flex gap-2 mb-2">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Rechercher un lieu..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Rechercher</button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div ref={mapRef} style={{ width: '100%', height: 400, borderRadius: 12, overflow: 'hidden' }} />
    </div>
  );
};

export default GoogleMapSearch;
