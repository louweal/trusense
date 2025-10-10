<template>
    <div class="gradient-header fixed top-0 left-0 right-0 z-50 py-3 transition-transform" ref="header">
        <div class="container flex justify-between items-center">
            <Logo :homeUrl="user ? '/dashboard' : '/'" />

            <nav>
                <ul v-if="!user" class="flex gap-7 items-center">
                    <li><NuxtLink to="/login">Login</NuxtLink></li>
                    <li>
                        <div @click="openSearchModal()" class="btn btn--dark btn--small">Track</div>
                    </li>

                    <!-- <li>
                        <NuxtLink to="/sensor/006938176" class="btn btn--dark btn--small">ESP32-006938176</NuxtLink>
                    </li> -->
                </ul>

                <ul v-else class="flex gap-7 items-center text-white">
                    <li class="cursor-pointer whitespace-nowrap">
                        <NuxtLink to="/account">Account</NuxtLink>
                    </li>

                    <li class="btn btn--small btn--dark" @click="signOut">Sign out</li>
                </ul>
            </nav>
        </div>
        <SearchModal />
    </div>
</template>

<script setup>
import { onMounted, useTemplateRef } from "vue";
import { useAuth } from "~/composables/useAuth";
// import { HederaService } from "~/lib/hedera";

const header = useTemplateRef("header");
let lastScrollY = 0;

// const user = null;
const { user, loading, error, isLoggedIn, fetchUser, logout } = useAuth();
await fetchUser();

// const hederaService = new HederaService();
// const state = hederaService.state;

const props = defineProps({
    gradient: {
        type: Boolean,
        default: false,
    },
});

const signOut = async () => {
    try {
        logout();
    } catch (err) {
        console.error("Failed to sign out:", err);
    }
};

onMounted(() => {
    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            header.value.classList.add("-translate-y-full");
        } else {
            header.value.classList.remove("-translate-y-full");
        }
        lastScrollY = currentScrollY;
    });
});

const openSearchModal = () => {
    console.log("open search modal");

    const searchModal = document.querySelector(".search-modal");
    if (searchModal) {
        console.log("search model!");
        searchModal.classList.add("is-active");

        // disable scroll on body
        document.body.style.overflow = "hidden";
    }
};
</script>
