import { defineNuxtConfig } from "nuxt/config";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: false },
    modules: ["@nuxtjs/tailwindcss", "nuxt-aos"],

    css: ["~/assets/css/main.css"],
    runtimeConfig: {
        public: {
            hederaNetwork: process.env.HEDERA_NETWORK,
        },
        // Private keys (only available on server-side)
        databaseUrl: process.env.DATABASE_URL,
        jwtSecret: process.env.JWT_SECRET,
    },
    app: {
        head: {
            link: [
                {
                    rel: "preconnect",
                    href: "https://fonts.googleapis.com",
                },
                {
                    rel: "preconnect",
                    href: "https://fonts.gstatic.com",
                    crossorigin: "",
                },
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Syne:wght@400..800&display=swap",
                },
            ],
            meta: [
                {
                    name: "description",
                    content:
                        "Real-time temperature, humidity and air pressure monitoring, immutably stored on HCS (Hedera Consensus Service).",
                },
            ],
        },
    },
    nitro: {
        experimental: {
            wasm: true,
        },
    },
    postcss: {
        plugins: {
            "postcss-preset-env": {
                stage: 1,
                features: {
                    "nesting-rules": true,
                },
            },
            autoprefixer: {},
        },
    },
    aos: {
        //  configuration
        useClassNames: true,
        duration: 850,
        once: true,
        delay: 0,
        offset: 100,
        easing: "ease-in-out-cubic",
    },
});
