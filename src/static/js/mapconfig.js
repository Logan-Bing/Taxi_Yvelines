const durationDiv = document.querySelector(".duration-container")

mapboxgl.accessToken = 'pk.eyJ1IjoibG9nYW5kZXZkamFuZ28iLCJhIjoiY21iNHpzZmh2MG5oZTJwc2F3ZGNiNzJzZiJ9.2FKlWN6oDXJjSwfTMUKXYw';

  const map = new mapboxgl.Map({
    container: 'map',
    center: [1.9795, 48.7981],
    zoom: 12
  });

  const script = document.getElementById('search-js');

  script.onload = function() {
    mapboxsearch.config.accessToken = mapboxgl.accessToken

    mapboxsearch.autofill({
      options: {
        country: 'fr'
      }
    })
  }

  const startInput = document.getElementById("start");
  const endInput = document.getElementById("end");

  async function checkAddresses(){
    const startAddress = startInput.value.trim();
    const endAddress = endInput.value.trim();

    async function convert_in_coordinates(address) {
      const response = await fetch(address)
      const data = await response.json();
      const lon = data.features[0].geometry.coordinates[0]
      const lat = data.features[0].geometry.coordinates[1]
      return [lon, lat]
    }

    if (startAddress && endAddress) {
      const startCoords = await convert_in_coordinates(`https://api.mapbox.com/search/geocode/v6/forward?q=${startAddress}&access_token=${mapboxgl.accessToken}`)
      const endCoords = await convert_in_coordinates(`https://api.mapbox.com/search/geocode/v6/forward?q=${endAddress}&access_token=${mapboxgl.accessToken}`)
      const startCoordStr = `${startCoords[0]},${startCoords[1]}`;
      const endCoordStr = `${endCoords[0]},${endCoords[1]}`;
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoordStr};${endCoordStr}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${mapboxgl.accessToken}`;
      const response = await fetch(url)
      const data = await response.json()
      const totalMinutes = Math.round(data.routes[0].duration / 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      if (hours == 0){
        durationDiv.innerHTML = `<span>${minutes} min</span>`;
      }
      else {
        durationDiv.innerHTML = `<span>${hours} h - ${minutes} min</span>`;
      }
      if (map.getSource('route')) {
        map.getSource('route').setData({
          type: 'Feature',
          geometry: data.routes[0].geometry
        });
      } else {
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: data.routes[0].geometry
          }
        });

        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b9ddd',
            'line-width': 5
          }
        });
      }
      if (window.startMarker) startMarker.remove();
      if (window.endMarker) endMarker.remove();

      window.startMarker = new mapboxgl.Marker({ color: 'green' })
        .setLngLat(startCoords)
        .addTo(map);

      window.endMarker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(endCoords)
        .addTo(map);

      const bounds = new mapboxgl.LngLatBounds();
      startCoords && bounds.extend(startCoords);
      endCoords && bounds.extend(endCoords);
      map.fitBounds(bounds, { padding: 50 });
     }


  }

  map.on('load', () => {
    startInput.addEventListener("change", checkAddresses);
    endInput.addEventListener("change", checkAddresses);
  });
