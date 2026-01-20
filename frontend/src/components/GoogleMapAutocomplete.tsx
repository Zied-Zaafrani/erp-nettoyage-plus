
import { useEffect, useCallback, useRef, useState } from 'react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAxxjdB_FKjWYEbH1HQC1yni4IEuHwKvw8';

const GoogleMapAutocomplete: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [geocoder, setGeocoder] = useState<any>(null);

  // Load Google Maps JS API with Places library
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        if (mapRef.current) {
          const gmap = new window.google.maps.Map(mapRef.current, {
            center: { lat: 20.254, lng: -9.2399 },
            zoom: 6,
          });
          setMap(gmap);
          setService(new window.google.maps.places.AutocompleteService());
          setGeocoder(new window.google.maps.Geocoder());
        }
      };
      document.body.appendChild(script);
    } else {
      if (mapRef.current) {
        const gmap = new window.google.maps.Map(mapRef.current, {
          center: { lat: 20.254, lng: -9.2399 },
          zoom: 6,
        });
        setMap(gmap);
        setService(new window.google.maps.places.AutocompleteService());
        setGeocoder(new window.google.maps.Geocoder());
      }
    }
    // eslint-disable-next-line
  }, []);

  // Fetch suggestions using Google Places AutocompleteService
  const fetchSuggestions = useCallback((input: string) => {
    if (!input.trim() || !service) {
      setSuggestions([]);
      return;
    }
    service.getPlacePredictions({ input, types: ['geocode'], componentRestrictions: { country: 'MR' } }, (predictions: any[], status: string) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setSuggestions(predictions);
      } else {
        setSuggestions([]);
      }
    });
  }, [service]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    fetchSuggestions(e.target.value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: any) => {
    setQuery(suggestion.description);
    setSuggestions([]);
    setError(null);
    if (!geocoder || !map) return;
    geocoder.geocode({ placeId: suggestion.place_id }, (results: any[], status: string) => {
      if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        map.setZoom(14);
        new window.google.maps.Marker({
          position: location,
          map,
          title: suggestion.description,
        });
      } else {
        setError('Lieu non trouvé.');
      }
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-6">
      <div className="mb-2 relative">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Rechercher un lieu..."
          value={query}
          onChange={handleInputChange}
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 bg-white border rounded shadow z-10 mt-1 max-h-60 overflow-y-auto">
            {suggestions.map(suggestion => (
              <li
                key={suggestion.place_id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.description}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div ref={mapRef} style={{ width: '100%', height: 400, borderRadius: 12, overflow: 'hidden' }} />
    </div>
  );
};

export default GoogleMapAutocomplete;
