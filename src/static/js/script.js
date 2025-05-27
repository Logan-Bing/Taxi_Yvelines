
mapboxgl.accessToken = 'pk.eyJ1IjoibG9nYW5kZXZkamFuZ28iLCJhIjoiY21iNHpzZmh2MG5oZTJwc2F3ZGNiNzJzZiJ9.2FKlWN6oDXJjSwfTMUKXYw';

  const map = new mapboxgl.Map({
    container: 'map',
    center: [1.9795, 48.7981],
    zoom: 12
  });

  const script = document.getElementById('search-js');

  script.onload = function () {
  mapboxsearch.config.accessToken = mapboxgl.accessToken;

  mapboxsearch.autofill({
    options: {
      country: 'fr'
    }
  })
};

async function geocode(address) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.features[0]?.geometry.coordinates;
  }

  let startCoords = null;
  let endCoords = null;

  function formatDuration(seconds) {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}min`;
  }

  async function tryDisplayRoute() {
    if (!startCoords || !endCoords) return;

    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
    const response = await fetch(directionsUrl);
    const json = await response.json();
    const route = json.routes[0].geometry;

    const duration = json.routes[0].duration;
    document.getElementById('duration-display').innerText = `Durée estimée : ${formatDuration(duration)}`;


    if (map.getSource('route')) {
      map.removeLayer('route');
      map.removeSource('route');
    }

    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: route
      }
    });

    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#007cbf',
        'line-width': 5
      }
    });

    const bounds = new mapboxgl.LngLatBounds();
    route.coordinates.forEach(coord => bounds.extend(coord));
    map.fitBounds(bounds, { padding: 40 });
  }

  async function handleInputChange(id, setter) {
    const address = document.getElementById(id).value;
    if (address.length > 5) {
      const coords = await geocode(address);
      setter(coords);
      tryDisplayRoute();
    }
  }

  document.getElementById('start').addEventListener('change', () => {
    handleInputChange('start', (coords) => { startCoords = coords; });
  });

  document.getElementById('end').addEventListener('change', () => {
    handleInputChange('end', (coords) => { endCoords = coords; });
  });
