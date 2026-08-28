<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
  import { point } from '@turf/helpers';

  const MAPBOX_TOKEN = import.meta.env.PUBLIC_MAPBOX_TOKEN;

  let userAddress = '';
  let checkResult = null;
  let isLoading = false;
  let geojsonData = null;

  onMount(async () => {
    try {
      const res = await fetch('/pickup-zone.json');
      if (!res.ok) throw new Error('Could not fetch GeoJSON file');
      geojsonData = await res.json();
    } catch (err) {
      console.error('Failed to load zone GeoJSON data:', err);
    }
  });

  async function checkAddress() {
    if (!userAddress.trim() || !geojsonData) return;
    isLoading = true;
    checkResult = null;

    try {
      if (!MAPBOX_TOKEN) throw new Error('PUBLIC_MAPBOX_TOKEN is not configured');

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(userAddress)}.json?access_token=${MAPBOX_TOKEN}&country=us&limit=1`
      );
      const data = await response.json();

      if (data && data.features && data.features.length > 0) {
        const [lon, lat] = data.features[0].center;
        const userPoint = point([lon, lat]);

        let inside = false;
        for (const feature of geojsonData.features) {
          if (feature.geometry && (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')) {
            if (booleanPointInPolygon(userPoint, feature)) {
              inside = true;
              break;
            }
          }
        }

        checkResult = inside ? 'in-zone' : 'out-of-zone';
      } else {
        checkResult = 'error';
      }
    } catch (e) {
      console.error('Geocoding check error:', e);
      checkResult = 'error';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="flex w-full flex-col gap-4">
  <div class="flex w-full flex-col gap-4">
    <label for="address-input" class="light text-xl text-[#222222]">See If You're in Our Pickup Zone</label>
    <div class="flex w-full gap-2">
      <input
        id="address-input"
        type="text"
        bind:value={userAddress}
        placeholder="Enter your street address (e.g. 12345 Street, City, State Zip Code)"
        class="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 font-sans text-lg focus:outline-none focus:ring-2 focus:ring-[#222222]"
        on:keydown={(e) => e.key === 'Enter' && checkAddress()}
      />
      <button
        on:click={checkAddress}
        disabled={isLoading}
        class="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#222222] px-12 py-4 bold text-white hover:shadow-md disabled:opacity-50"
      >
        {isLoading ? 'Checking...' : 'Check'}
      </button>
    </div>

    {#if checkResult === 'in-zone'}
      <div in:fade class="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
        <strong>You're covered!</strong> We provide equipment pickups in your area.
      </div>
    {:else if checkResult === 'out-of-zone'}
      <div in:fade class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        You're outside our primary pickup boundary. Right outside our pickup boundary? Contact us anyway to see if we can accommodate your location!
      </div>
    {:else if checkResult === 'error'}
      <div in:fade class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        Could not locate that address. Please check the spelling or include your city and ZIP code.
      </div>
    {/if}
  </div>
</div>
