<script>
  import { onDestroy, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
  import { point } from '@turf/helpers';

  const MAPBOX_TOKEN = import.meta.env.PUBLIC_MAPBOX_TOKEN;

  let userAddress = '';
  let checkResult = null;
  let isLoading = false;
  let geojsonData = null;
  let suggestions = [];
  let suggestionsLoading = false;
  let suggestionTimer;

  function queueSuggestions() {
    clearTimeout(suggestionTimer);
    suggestions = [];

    if (userAddress.trim().length < 5 || !MAPBOX_TOKEN) return;

    suggestionsLoading = true;
    suggestionTimer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(userAddress.trim())}.json?access_token=${MAPBOX_TOKEN}&country=us&types=address&autocomplete=true&limit=5`
        );
        const data = await response.json();
        suggestions = data.features || [];
      } catch (err) {
        console.error('Address suggestions error:', err);
        suggestions = [];
      } finally {
        suggestionsLoading = false;
      }
    }, 300);
  }

  function selectSuggestion(suggestion) {
    userAddress = suggestion.place_name;
    suggestions = [];
  }

  onMount(async () => {
    try {
      const res = await fetch('/pickup-zone.json');
      if (!res.ok) throw new Error('Could not fetch GeoJSON file');
      geojsonData = await res.json();
    } catch (err) {
      console.error('Failed to load zone GeoJSON data:', err);
    }
  });

  onDestroy(() => clearTimeout(suggestionTimer));

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
    <label for="address-input" class="light text-sm sm:text-base md:text-xl text-[#222222]">See If You're in Our Pickup Zone</label>
    <div class="relative flex w-full items-stretch gap-2">
      <div class="relative min-w-0 flex-1">
        <input
          id="address-input"
          type="text"
          bind:value={userAddress}
          placeholder="Enter your street address (e.g. 12345 Street, City, State Zip Code)"
          class="w-full rounded-lg border border-gray-300 px-3 py-4 font-sans text-md md:text-lg focus:outline-none focus:ring-2 focus:ring-[#222222]"
          on:input={queueSuggestions}
          on:keydown={(e) => e.key === 'Enter' && checkAddress()}
        />

        {#if suggestionsLoading}
          <div class="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3 text-xs sm:text-sm md:text-base text-gray-600 shadow-md transition-all duration-300">
            Finding addresses...
          </div>
        {:else if suggestions.length > 0}
          <div class="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300">
            {#each suggestions as suggestion}
              <button
                type="button"
                class="block w-full px-4 py-3 text-left text-xs sm:text-sm md:text-base text-[#222222] transition-colors duration-300 ease-in-out hover:bg-[#f1f1f1]"
                on:click={() => selectSuggestion(suggestion)}
              >
                {suggestion.place_name}
              </button>
            {/each}
          </div>
        {/if}
      </div>
      <button
        on:click={checkAddress}
        disabled={isLoading}
        class="cursor-pointer inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#222222] px-12 bold text-white transition-shadow ease-in-out duration-300 hover:shadow-md disabled:opacity-50"
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
