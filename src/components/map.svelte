<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import AddressZoneChecker from './address-zone-checker.svelte';

  let generalService_isHovered = $state(false);
  let extendedService_isHovered = $state(false);
  let mapContainer = $state();

  onMount(async () => {
    const mapboxgl = (await import('mapbox-gl')).default;
    
    mapboxgl.accessToken = import.meta.env.PUBLIC_MAPBOX_TOKEN;

    if (!mapboxgl.accessToken) {
      console.error('Mapbox token not found. Set PUBLIC_MAPBOX_TOKEN in your .env');
      return;
    }

    // 1. Fetch the GeoJSON first to calculate bounds
    let geojsonData;
    let bounds = [Infinity, Infinity, -Infinity, -Infinity]; // [minLng, minLat, maxLng, maxLat]
    
    try {
      const response = await fetch('/pickup-zone.json');
      geojsonData = await response.json();
      
      // Helper to parse coordinates and find min/max
      const processCoords = (coords) => {
        for (const coord of coords) {
          if (coord[0] < bounds[0]) bounds[0] = coord[0];
          if (coord[1] < bounds[1]) bounds[1] = coord[1];
          if (coord[0] > bounds[2]) bounds[2] = coord[0];
          if (coord[1] > bounds[3]) bounds[3] = coord[1];
        }
      };

      // Loop through features to find the true bounding box
      geojsonData.features.forEach(feature => {
        if (feature.geometry.type === 'Polygon') {
          feature.geometry.coordinates.forEach(processCoords);
        } else if (feature.geometry.type === 'MultiPolygon') {
          feature.geometry.coordinates.forEach(polygon => {
            polygon.forEach(processCoords);
          });
        }
      });
    } catch (err) {
      console.error('Failed to parse pickup-zone.json for bounds:', err);
    }

    const map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      // Fallback center if fetch fails, otherwise fitBounds overrides this
      center: [-117.147, 33.526], 
      zoom: 10
    });

    map.on('load', () => {
      // 2. Pass the fetched geojsonData object directly to the source
      map.addSource('service-areas', {
        type: 'geojson',
        data: geojsonData || '/pickup-zone.json' 
      });

      map.addLayer({
        'id': 'general-area-fill',
        'type': 'fill',
        'source': 'service-areas',
        'filter': ['==', ['get', 'area_type'], 'general'],
        'paint': {
          'fill-color': '#0288d1',
          'fill-opacity': 0.15 // lowered opacity from 0.4
        }
      });

      map.addLayer({
        'id': 'extended-area-fill',
        'type': 'fill',
        'source': 'service-areas',
        'filter': ['==', ['get', 'area_type'], 'extended'],
        'paint': {
          'fill-color': '#424242',
          'fill-opacity': 0.12 // lowered opacity from 0.3
        }
      });

      map.addLayer({
        'id': 'area-outlines',
        'type': 'line',
        'source': 'service-areas',
        'paint': {
          'line-color': [
            'case',
            ['==', ['get', 'area_type'], 'general'], '#01579b',
            '#212121'
          ],
          'line-width': 2
        }
      });

      // 3. Center and zoom smoothly onto the calculated polygon bounding box
      if (bounds[0] !== Infinity) {
        map.fitBounds(
          [[bounds[0], bounds[1]], [bounds[2], bounds[3]]], 
          { padding: 40, maxZoom: 14, animate: false }
        );
      }
    });

    map.on('error', (e) => {
      console.error('Mapbox error:', e.error);
    });
  });
</script>


<div class="flex w-full flex-col gap-4 font-sans">
  <AddressZoneChecker />

  <div class="w-full max-w-[640px] h-[413px] border border-[#f1f1f1] rounded-xl relative overflow-hidden">
    <div bind:this={mapContainer} class="w-full h-full"></div>
  </div>

  <div class="hidden md:flex flex-row gap-6">
    <div
      class="flex items-center gap-2 p-1 px-2 hover:bg-[#f1f1f1] transition-colors duration-300 ease-in-out rounded-md cursor-default"
      role="tooltip"
      onmouseenter={() => generalService_isHovered = true}
      onmouseleave={() => generalService_isHovered = false}
    >
      <div class="w-4 h-4 bg-[#0288d1] rounded-sm"></div>
      <p class="text-sm md:text-base text-[#222222] whitespace-nowrap">General Service Area</p>
    </div>

    <div
      class="flex items-center gap-2 py-1 px-2 hover:bg-[#f1f1f1] transition-colors duration-300 ease-in-out rounded-md cursor-default"
      role="tooltip"
      onmouseenter={() => extendedService_isHovered = true}
      onmouseleave={() => extendedService_isHovered = false}
    >
      <div class="w-4 h-4 bg-[#424242] rounded-sm"></div>
      <p class="text-sm md:text-base text-[#222222] whitespace-nowrap">Extended Service Area</p>
    </div>

    {#if (generalService_isHovered || extendedService_isHovered)}
      <div in:fade class="max-w-full h-auto p-4 mx-4 bg-white shadow-md border border-[#eee] absolute self-end -translate-y-14 rounded-lg z-10">
        {#if generalService_isHovered}
          We primarily pickup and drop-off equipment here! If you are located inside this blue shaded area, you are fully covered.
        {:else if extendedService_isHovered}
          Located just outside our main boundary? No problem! If you are nearby, please contact us anyway as we can usually still arrange a pickup or drop-off for you.
        {/if}
      </div>
    {/if}
  </div>
</div>
