<script>
  let tags = ['Equip the Youth', 'Equip the Youth', 'Equip the Youth', 'Equip the Youth', 'Equip the Youth'];
</script>


<div class="marquee-container max-h-125 overflow-hidden bg-[#f1f1f1] py-6 flex flex-col select-none w-max relative">
  <div class="flex flex-col w-max">
    
    <div class="flex flex-col items-center gap-y-2 w-fit pt-2 animate-marquee">
      {#each tags as tag}
        <span class="text-[#222222] text-nowrap w-full text-[80px] heading marquee-text">{tag}</span>
      {/each}
    </div>

    <div class="flex flex-col items-center w-fit  gap-y-2 pt-2 animate-marquee" aria-hidden="true">
      {#each tags as tag}
        <span class="text-[#222222] text-nowrap w-full text-[80px] heading marquee-text">{tag}</span>
      {/each}
    </div>

    <style>
      .marquee-container::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%; 
        background: linear-gradient(to top, rgba(241, 241, 241, 0.8), rgba(0, 0, 0, 0)); 
        z-index: 10; 
      }
    </style>
  </div>
</div>
