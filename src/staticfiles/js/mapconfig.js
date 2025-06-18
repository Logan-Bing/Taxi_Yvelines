const durationDiv = document.querySelector('.duration-container');
const span = durationDiv.querySelector('.duration');

mapboxgl.accessToken = MAPBOX_API_KEY;

// Initialise la carte
const map = new mapboxgl.Map({
  container: 'map',
  center: [1.9795, 48.7981], // Position de départ (ex: Yvelines)
  style: 'mapbox://styles/mapbox/streets-v11',
  zoom: 12
});

// Sélecteurs des champs input
const startInput = document.getElementById("start");
const endInput = document.getElementById("end");

// Fonction : autocomplétion sur un champ input
function setupAutocomplete(inputElement) {
  let timeout = null;

  const resultsContainer = document.createElement('div');
  resultsContainer.classList.add('autocomplete-results');
  resultsContainer.style.zIndex = '1000';
  resultsContainer.style.backgroundColor = 'white';
  resultsContainer.style.border = '1px solid #ccc';
  resultsContainer.style.width = "248px"
  resultsContainer.style.maxHeight = '200px';
  resultsContainer.style.overflowY = 'auto';
  resultsContainer.style.display = 'none';

  inputElement.parentNode.appendChild(resultsContainer);

  inputElement.addEventListener('input', () => {
    clearTimeout(timeout);
    const query = inputElement.value.trim();

    if (!query) {
      resultsContainer.style.display = 'none';
      return;
    }

    timeout = setTimeout(async () => {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&autocomplete=true&language=fr&limit=5`;
      const response = await fetch(url);
      const data = await response.json();

      resultsContainer.innerHTML = '';
      data.features.forEach((feature) => {
        const item = document.createElement('div');
        item.textContent = feature.place_name;
        item.style.padding = '8px';
        item.style.cursor = 'pointer';

        item.addEventListener('click', () => {
          inputElement.value = feature.place_name;
          resultsContainer.style.display = 'none';
          inputElement.dispatchEvent(new Event('change')); // pour déclencher checkAddresses()
        });

        resultsContainer.appendChild(item);
      });

      resultsContainer.style.display = data.features.length > 0 ? 'block' : 'none';
    }, 300);
  });

  document.addEventListener('click', (e) => {
    if (!resultsContainer.contains(e.target) && e.target !== inputElement) {
      resultsContainer.style.display = 'none';
    }
  });
}

// Fonction principale pour gérer les adresses
async function checkAddresses() {
  const startAddress = startInput.value.trim();
  const endAddress = endInput.value.trim();

  async function convert_in_coordinates(address) {
    const response = await fetch(address);
    const data = await response.json();
    const lon = data.features[0].geometry.coordinates[0];
    const lat = data.features[0].geometry.coordinates[1];
    return [lon, lat];
  }

  if (startAddress && endAddress) {
    const startCoords = await convert_in_coordinates(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(startAddress)}.json?access_token=${mapboxgl.accessToken}`);
    const endCoords = await convert_in_coordinates(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(endAddress)}.json?access_token=${mapboxgl.accessToken}`);

    const startCoordStr = `${startCoords[0]},${startCoords[1]}`;
    const endCoordStr = `${endCoords[0]},${endCoords[1]}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoordStr};${endCoordStr}?alternatives=true&geometries=geojson&language=fr&overview=full&steps=true&access_token=${mapboxgl.accessToken}`;
    const response = await fetch(url);
    const data = await response.json();

    const totalMinutes = Math.round(data.routes[0].duration / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    span.textContent = hours > 0 ? `${hours} h - ${minutes} min` : `${minutes} min`;

    if (map.getSource('route')) {
      map.getSource('route').setData({ type: 'Feature', geometry: data.routes[0].geometry });
    } else {
      map.addSource('route', {
        type: 'geojson',
        data: { type: 'Feature', geometry: data.routes[0].geometry }
      });

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#3b9ddd', 'line-width': 5 }
      });
    }

    if (window.startMarker) window.startMarker.remove();
    if (window.endMarker) window.endMarker.remove();

    window.startMarker = new mapboxgl.Marker({ color: 'green' })
      .setLngLat(startCoords)
      .addTo(map);

    window.endMarker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat(endCoords)
      .addTo(map);

    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(startCoords);
    bounds.extend(endCoords);
    map.fitBounds(bounds, { padding: 50 });
  }
}

// Initialisation quand la carte est prête
map.on('load', () => {
  setupAutocomplete(startInput);
  setupAutocomplete(endInput);

  startInput.addEventListener("change", checkAddresses);
  endInput.addEventListener("change", checkAddresses);
});
