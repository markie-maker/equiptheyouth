<script>
    import { onMount } from 'svelte';
    import Logo from '../assets/ETY.svg?url';

    let isOpen = $state(false);

    const toggleMenu = () => {
        isOpen = !isOpen;

        if (isOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    };

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

        isOpen = false;
    };

    onMount(() => {
        const navbar = document.getElementById("navbar");
        let lastScrollY = window.scrollY;

        $effect(() => {
            if (isOpen) {
                document.body.classList.add('overflow-hidden');
            } else {
                document.body.classList.remove('overflow-hidden');
            }
        });

        const onScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                navbar.classList.add("-translate-y-full");
                isOpen = false;
            } else {
                navbar.classList.remove("-translate-y-full");
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    });

</script>

<nav id="navbar" class="flex justify-between h-20 pl-4 md:py-3.75 md:pr-16 py-3 px-4 w-full max-w-svw bg-white backdrop-blur-md border-b border-slate-100 shadow-sm fixed z-50 top-0 transition-transform duration-300">
    <a href="/">
        <img src={Logo} alt="Equip the Youth logo" class="h-full w-auto p-2 md:p-0" />
    </a>
    <div class="hidden md:flex gap-3 flex-row w-auto h-full items-center">
        <a href="/" class="h-12 px-8 bg-[#f5f5f5] flex items-center rounded-xl text-[#222222] font-medium hover:bg-black hover:text-white transition-all duration-200 button">Home</a>
        <a href="/#about" onclick={handleAnchorClick} class="h-12 px-8 flex items-center rounded-xl text-[#222222] font-medium hover:bg-[#f5f5f5] transition-all duration-200 button">About</a>
        <a href="/#donate" onclick={handleAnchorClick} class="h-12 px-8 flex items-center rounded-xl text-[#222222] font-medium hover:bg-[#f5f5f5] transition-all duration-200 button">Donate</a>
    </div>

    <div class="w-auto block md:hidden">
        <button
            type="button"
            aria-label="toggle menu"
            class="p-2"
            onclick={toggleMenu}
        >
            <svg class="ham hamRotate ham1" class:active={isOpen} viewBox="10 10 80 80" height="40px" width="40px">
                <path
                    class="line top"
                    d="m 30,33 h 40 c 0,0 9.044436,-0.654587 9.044436,-8.508902 0,-7.854315 -8.024349,-11.958003 -14.89975,-10.85914 -6.875401,1.098863 -13.637059,4.171617 -13.637059,16.368042 v 40" />
                <path
                    class="line middle"
                    d="m 30,50 h 40" />
                <path
                    class="line bottom"
                    d="m 30,67 h 40 c 12.796276,0 15.357889,-11.717785 15.357889,-26.851538 0,-15.133752 -4.786586,-27.274118 -16.667516,-27.274118 -11.88093,0 -18.499247,6.994427 -18.435284,17.125656 l 0.252538,40" />
            </svg>
        </button>
    </div>
</nav>

<div class={`fixed top-20 left-0 w-full h-[calc(100dvh-5rem)] grid transition-[grid-template-rows] duration-300 ease-in-out z-40 md:hidden ${isOpen ? 'grid-rows-[1fr] pointer-events-auto' : 'grid-rows-[0fr] pointer-events-none'}`}>
    <div class="overflow-hidden min-h-0">
        <div class="w-full h-full bg-[#222222]/20 p-4 flex flex-col justify-start">
            <div class="w-full bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 flex flex-col gap-2 transition-all">
                <a href="/" onclick={handleAnchorClick} class="w-full py-3.5 px-6 bg-[#f5f5f5]! flex items-center justify-between rounded-xl text-[#222222] transition-all duration-300 ease-in-out button">
                    Home
                </a>
                <a href="/#about" onclick={handleAnchorClick} class="w-full py-3.5 px-6 hover:bg-[#f5f5f5] flex items-center justify-between rounded-xl text-[#222222] transition-all duration-300 ease-in-out button">
                    About
                </a>
                <a href="/#donate" onclick={handleAnchorClick} class="w-full py-3.5 px-6 hover:bg-[#f5f5f5] flex items-center justify-between rounded-xl text-[#222222] transition-all duration-300 ease-in-out button">
                    Donate
                </a>
            </div>
        </div>
    </div>
</div>

<style>
    .ham {
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition: transform 400ms;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .hamRotate.active {
        transform: rotate(45deg);
    }
    .hamRotate180.active {
        transform: rotate(180deg);
    }
    .line {
        fill:none;
        transition: stroke-dasharray 400ms, stroke-dashoffset 400ms;
        stroke:#000;
        stroke-width:5.5;
        stroke-linecap:round;
    }
    .ham1 .top {
        stroke-dasharray: 40 139;
    }
    .ham1 .bottom {
        stroke-dasharray: 40 180;
    }
    .ham1.active .top {
        stroke-dashoffset: -98px;
    }
    .ham1.active .bottom {
        stroke-dashoffset: -138px;
    }
</style>