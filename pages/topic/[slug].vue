<template>
    <main>
        <Header />
        <!-- <HeroSensor :name="name" :topicId="topicId" /> -->

        <header class="hero">
            <div class="container">
                <h1>{{ name }}</h1>

                <p>{{ topicId }}</p>
                <p>Measurement Interval: {{ interval / 1000 }} seconds</p>

                <a :href="`https://hashscan.io/testnet/topic/${topicId}/messages`" target="_blank"
                    >Inspect on HashScan</a
                >
            </div>
        </header>

        <section class="section">
            <div class="container flex flex-col gap-10">
                <div class="grid sm:grid-cols-3 gap-5">
                    <ClientOnly fallback="Loading charts...">
                        <GaugeChartWrapper
                            title="Temperature"
                            unit="°C"
                            :min="-40"
                            :max="85"
                            :value="curTemp"
                            color="#f68227"
                        />

                        <GaugeChartWrapper
                            title="Humidity"
                            unit="%"
                            :min="0"
                            :max="100"
                            :value="curHum"
                            color="#072847"
                        />
                        <GaugeChartWrapper
                            title="Air Pressure"
                            unit="hPa"
                            :min="950"
                            :max="1050"
                            :value="curAirPressure"
                            color="#accfdc"
                        />
                    </ClientOnly>
                </div>

                <Chart v-if="topicId" :topicId="topicId" :interval="interval" />
                <div v-else>
                    <p>Loading chart...</p>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import { HederaService } from "~/lib/hedera";
import { HcsListener } from "../../lib/HcsListener";
import { onMounted } from "vue";
import GaugeChartWrapper from "../../components/GaugeChartWrapper.vue";

// get slug
const route = useRoute();
const slug = route.params.slug;

const topicId = ref(null);
const interval = ref(null);
const name = ref(null);
const curTemp = ref(null);
const curHum = ref(null);
const curAirPressure = ref(null);
const pageTitle = ref("Loading...");

const hederaService = new HederaService();
let listener = new HcsListener();

// get the sensor for db on mount
onMounted(async () => {
    try {
        const sensor = await $fetch("/api/sensors/" + slug);
        topicId.value = sensor.topicId;
        interval.value = sensor.interval;
        name.value = sensor.name;
        pageTitle.value = sensor.name;
    } catch (error) {
        console.log(error);
    }

    console.log("topicId.value :>> ", topicId.value);

    if (!topicId.value) return;

    hederaService.getLastMessage(topicId.value, interval.value).then((message) => {
        // console.log(message);
        curTemp.value = message.temperature;
        curHum.value = message.humidity;
        curAirPressure.value = message.airPressure;
    });

    // then start listening for new messages
    listener = new HcsListener(topicId.value, (data) => {
        if (data.temperature !== undefined) curTemp.value = data.temperature;
        if (data.humidity !== undefined) curHum.value = data.humidity;
        if (data.airPressure !== undefined) curAirPressure.value = data.airPressure;
    });

    await listener.start();
});

// stop listening when component is unmounted
onUnmounted(() => {
    listener?.stop();
});

useHead({
    title: pageTitle,
});
</script>
