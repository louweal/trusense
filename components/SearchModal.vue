<template>
    <div
        class="search-modal fixed inset-0 w-full h-full top-0 left-0 right-0 bottom-0 invisible opacity-0 flex justify-center items-center backdrop-blur-sm"
    >
        <div
            @click="closeSearchModal()"
            class="absolute xxxxw-full xxxxh-full inset-0 bg-[#313131] opacity-40 transition-opacity"
        ></div>
        <div class="bg-white relative xxxz-[2] h-[60px] rounded-[30px] transition-opacity">hsearch</div>
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
