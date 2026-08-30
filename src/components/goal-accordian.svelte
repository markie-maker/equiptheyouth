<script>
  let isOpen = $state(false);

  const { title, description } = $props()
</script>

<div class={`overflow-hidden rounded-2xl bg-white transition-all duration-300 ease-in-out ${isOpen ? '' : 'active:scale-97'}`}>
  <button
    onclick={() => (isOpen = !isOpen)}
    aria-expanded={isOpen}
    class="cursor-pointer active:scale-95 appearance-none flex w-full items-center justify-between bg-white p-4 text-left transition-colors duration-300 ease-in-out"
  >
    <p class="light text-sm sm:text-base md:text-xl text-[#222222]">{title}</p>
    <svg xmlns="http://www.w3.org/2000/svg" class={`transition-transform duration-300 ease-in-out ${isOpen ? '-rotate-90' : 'rotate-90'}`} height="40px" viewBox="0 -960 960 960" width="40px" fill="#222222"><path d="M522.67-480.67 331.33-672 376-717.33l236.67 236.66L376-244l-44.67-45.33 191.34-191.34Z"/></svg>
</button>

  <div class={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
    <div class="overflow-hidden">
      <div class="bg-white px-4 pb-4">
        <p class="text-sm sm:text-base md:text-lg text-[#222222]">
          {description}
        </p>
      </div>
    </div>
  </div>
</div>