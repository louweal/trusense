<template>
    <div class="hero relative min-h-dvh hero--center">
        <div class="hero__bg"></div>
        <div class="container z-[2]">
            <div class="grid md:grid-cols-12 gap-y-10 gap-x-5 items-center">
                <div class="md:col-span-4 min-height-[600px]">
                    <div class="w-full animate-slide-up relative images--carrousel">
                        <img
                            src="/images/trusense-prototype-closed-nobg.png"
                            alt="hero"
                            class="w-full h-full object-cover"
                        />
                        <img
                            src="/images/trusense-prototype-open-nobg.png"
                            alt="hero"
                            class="w-full h-full object-cover absolute inset-0"
                        />
                    </div>
                </div>
                <div class="md:col-span-5 md:col-start-6 order-first md:order-last">
                    <div class="opacity-0 animate-fade-up flex flex-col flex-start gap-6 text-white origin-top">
                        <client-only>
                            <h1 class="font-bold text-5xl md:text-[70px] text-secondary">
                                Immutable <br />
                                <span ref="typed" class="text-transparent stroked"></span> <br />
                                tracking on chain
                            </h1>
                        </client-only>

                        <p class="text-lg md:text-2xl font-light opacity-75 text-primary">
                            High precision temperature, humidity and air pressure measurements immutably stored on
                            Hedera; ensuring full transparency and trust.
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
            strings: ["temperature", "air pressure", "humidity"],
            typeSpeed: 50,
            backSpeed: 40,
            loop: true,
        });
    }
});
</script>
