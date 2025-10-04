<template>
    <main>
        <Header />
        <HeroSensor :name="slug" />

        <section class="section">
            <div class="container flex flex-col gap-10">
                <div class="grid sm:grid-cols-3 gap-5">
                    <GaugeChart title="Temperature" unit="°C" :min="-40" :max="85" :value="25" />
                    <GaugeChart title="Humidity" unit="%" :min="0" :max="100" :value="70" />
                    <GaugeChart title="Air Pressure" unit="hPa" :min="0" :max="100" :value="80" />
                </div>

                <Chart />
            </div>
        </section>
    </main>
</template>

<script setup>
import GaugeChart from "../../components/GaugeChart.vue";

// get slug
const route = useRoute();
const slug = route.params.slug;

useHead({
    title: "TruSense ESP32-" + slug,
});
</script>
