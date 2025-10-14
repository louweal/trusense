import { defineNuxtRouteMiddleware, useFetch, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to: any) => {
    console.log("🚀 Global middleware running");

    const publicPages = ["/", "/login", "/register", "/api/auth/me", "/api/send-email"];

    if (publicPages.includes(to.path)) return;

    if (to.path.startsWith("/sensor/") || to.path.startsWith("/topic/")) {
        return;
    }

    try {
        const { data } = await useFetch("/api/auth/me", {
            credentials: "include",
            server: true,
        });

        if (!data.value) {
            return navigateTo("/login");
        }
    } catch {
        console.error("Failed to fetch user");
        return navigateTo("/login");
    }
});
