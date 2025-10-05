<template>
    <div class="hero relative pt-20 min-h-dvh hero--center">
        <div class="hero__bg"></div>
        <div class="container z-[2]">
            <div class="grid md:grid-cols-12 gap-y-10 gap-x-5 items-center">
                <div class="md:col-span-4 min-height-[600px]">
                    <div class="w-full animate-slide-up">
                        <img src="/images/sensor-dummy.png" alt="hero" class="w-full h-full object-cover" />
                    </div>
                </div>
                <div class="md:col-span-5 md:col-start-6 order-first md:order-last">
                    <div class="animate-slide-up flex flex-col flex-start gap-4 text-white">
                        <h1 class="font-semibold text-7xl text-secondary">
                            Sense. <br />Verify.<br />
                            Trust.
                        </h1>
                        <p class="text-2xl font-regular opacity-75 text-primary">
                            Real-time temperature, humidity, barometric pressure, and air quality monitoring, immutably
                            stored on the decentralized Hedera Consensus Service.
                        </p>
                        <a href="#features" class="btn self-start">Learn more</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup></script>
