<script>
    import { onMount } from 'svelte';
    import Logo from '../assets/ETY.svg?url';

    const handleAnchorClick = (e) => {
        const target = e.currentTarget;
        const href = target.getAttribute('href');
        
        if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                history.pushState(null, '', href);
            }
        }
    };

    onMount(() => {
        const navbar = document.getElementById("navbar");
        let lastScrollY = window.scrollY;

        const onScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                navbar.classList.add("-translate-y-full");
            } else {
                navbar.classList.remove("-translate-y-full");
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    });
</script>

<nav id='navbar' class="flex justify-between md:h-20 md:pl-4 md:py-3.75 md:pr-16 py-3 px-4 h-12 w-full bg-white shadow-md fixed z-50 top-0 transition-transform duration-300">
    <a href="/">
        <img src={Logo} alt="Equip the Youth logo" class="h-full w-auto" />
    </a>
    <div class="flex gap-4 flex-row w-auto h-full">
        <a href="/" class="h-full px-12 py-4 active flex items-center rounded-xl text-[#222222] button">Home</a>
        <a href="/#about" on:click={handleAnchorClick} class="h-full px-12 py-4 flex items-center rounded-xl text-[#222222] button non-active">About</a>
        <a href="/#donate" on:click={handleAnchorClick} class="h-full px-12 py-4 flex items-center rounded-xl text-[#222222] button non-active">Donate</a>
    </div>
</nav>

<style>
    .active {
        background-color: #f5f5f5;
    }
</style>
