<template>
    <div
        class="search-modal fixed inset-0 w-full h-full top-0 left-0 right-0 bottom-0 invisible opacity-0 flex justify-center items-center backdrop-blur-sm"
    >
        <div
            @click="closeSearchModal()"
            class="absolute cursor-pointer inset-0 bg-[#313131] opacity-40 transition-opacity"
        ></div>
        <div
            class="bg-white relative h-[60px] rounded-[30px] transition-opacity shadow-modal p-[10px] w-[600px] max-w-[90vw] flex"
        >
            <input
                id="search"
                type="text"
                name="search"
                placeholder="Find sensor by ID"
                class="w-full h-full px-4 focus:outline-none all-[unset]"
            />
            <div
                class="bg-secondary rounded-full w-10 h-10 flex justify-center items-center flex-shrink-0 hover:bg-primary transition-[background] cursor-pointer duration-300 ease-in-out"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" fill="none">
                    <g stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                        <path
                            d="M8.286 7.338a6.276 6.276 0 1 0 8.876 8.876 6.276 6.276 0 0 0-8.876-8.876M5 19.5l3.29-3.29"
                        />
                    </g>
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup>
const closeSearchModal = () => {
    const searchModal = document.querySelector(".search-modal");

    if (searchModal) {
        searchModal.classList.remove("is-active");

        document.body.style.overflow = "auto";
    }
};
</script>
