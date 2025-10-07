<template>
    <div class="hero relative pt-20 min-h-dvh hero--center">
        <div class="hero__bg"></div>
        <div class="container z-[2]">
            <div class="grid md:grid-cols-12 gap-y-10 gap-x-5 items-center">
                <div class="md:col-span-4 min-height-[600px]">
                    <div class="w-full animate-slide-up relative">
                        <div class="circles">
                            <span class="circle circle--1"> </span>
                            <span class="circle circle--2"> </span>
                            <span class="circle circle--3"> </span>
                        </div>
                        <img src="/images/sensor-dummy.png" alt="hero" class="w-full h-full object-cover" />
                    </div>
                </div>
                <div class="md:col-span-5 md:col-start-6 order-first md:order-last">
                    <div class="animate-slide-up flex flex-col flex-start gap-6 text-white">
                        <client-only
                            ><h1 class="font-semibold text-9xl text-secondary">
                                Immutatble <span ref="typed" class="text-transparent stroked"></span> measurements on
                                chain
                            </h1></client-only
                        >

                        <p class="text-2xl font-regular opacity-75 text-primary">
                            With TruSense sensors you can track environmental variables in real time. All data is stored
                            on chain and is immutable. Ensuring transparency and trust.
                        </p>
                        <a href="#features" class="btn self-start">Learn more</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";
import Typed from "typed.js";

const typed = ref(null);

onMounted(async () => {
    // wait for the DOM inside <client-only> to be rendered
    await nextTick();

    if (typed.value) {
        new Typed(typed.value, {
            strings: ["temperature", "air pressure", "humidity", "air quality"],
            typeSpeed: 50,
            backSpeed: 40,
            loop: true,
        });
    }
});
</script>
