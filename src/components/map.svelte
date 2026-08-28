<script>
  import { fade } from 'svelte/transition';
  import AddressZoneChecker from './address-zone-checker.svelte';

  let generalService_isHovered = false;
  let extendedService_isHovered = false;

</script>

<div class="flex w-full flex-col gap-4">
  <AddressZoneChecker />

  <div class="flex flex-col gap-2 relative">
    <div style="width: 640px; height: 413px; overflow: hidden; border: 1px solid #f1f1f1;" class="rounded-xl">
      <iframe
        title="Service Areas Map"
        src="https://www.google.com/maps/d/embed?mid=1v4fkFszjKrU2zVTiQgtHXILs1DpFLyU&hl=en"
        width="640"
        height="480"
        loading="lazy"
        style="position: relative; margin-top: -67px; border: none;"
      ></iframe>
    </div>

    <div class="flex gap-6">
      <div
        class="flex items-center gap-2 p-1 px-2 hover:bg-[#f1f1f1] transition-colors duration-300 ease-in-out rounded-md cursor-default"
        role="tooltip"
        on:mouseenter={() => generalService_isHovered = true}
        on:mouseleave={() => generalService_isHovered = false}
      >
        <div class="w-4 h-4 p-1 bg-[#0288d1] rounded-sm"></div>
        <p class="text-base text-[#222222] whitespace-nowrap">General Service Area</p>
      </div>

      <div
        class="flex items-center gap-2 py-1 px-2 hover:bg-[#f1f1f1] transition-colors duration-300 ease-in-out rounded-md cursor-default"
        role="tooltip"
        on:mouseenter={() => extendedService_isHovered = true}
        on:mouseleave={() => extendedService_isHovered = false}
      >
        <div class="w-4 h-4 p-1 bg-[#424242] rounded-sm"></div>
        <p class="text-base text-[#222222] whitespace-nowrap">Extended Service Area</p>
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
</div>