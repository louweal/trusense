<template>
    <main>
        <Header />
        <HeroSensor :name="topicId ? topicId : '...'" />

        <section class="section">
            <div class="container flex flex-col gap-10">
                <div class="grid sm:grid-cols-3 gap-5">
                    <ClientOnly fallback="Loading charts...">
                        <GaugeChart title="Temperature" unit="°C" :min="-40" :max="85" :value="latestTemp || -40" />
                        <GaugeChart title="Humidity" unit="%" :min="0" :max="100" :value="latestHum || 0" />
                        <GaugeChart
                            title="Air Pressure"
                            unit="hPa"
                            :min="950"
                            :max="1050"
                            :value="latestAirPressure || 950"
                        />
                    </ClientOnly>
                </div>

                <!-- <Chart /> -->
            </div>
        </section>
    </main>
</template>

<script setup>
import { onMounted } from "vue";
import GaugeChart from "../../components/GaugeChart.vue";

// get slug
const route = useRoute();
const slug = route.params.slug;

const topicId = ref(null);

// get the sensor for db on mount
onMounted(async () => {
    try {
        const sensor = await $fetch("/api/sensors/" + slug);
        topicId.value = sensor.topicId;
        console.log(sensor);
    } catch (error) {
        console.log(error);
    }
});

const latestTemp = ref(null);
const latestHum = ref(null);
const latestAirPressure = ref(null);

const interval = 30000; // 30 seconds
const now = new Date();
const oneIntervalAgo = new Date(now.getTime() - interval);
const seconds = Math.floor(oneIntervalAgo.getTime() / 1000);
const nanoseconds = (oneIntervalAgo.getTime() % 1000) * 1_000_000;
const hederaTimestamp = `${seconds}.${nanoseconds}`;

useHead({
    title: "TruSense ESP32-" + slug,
});

onMounted(async () => {
    // first simply fetch last message from HCS
    const TOPIC_ID = "0.0.6938176";

    const MIRROR_URL = `https://testnet.mirrornode.hedera.com/api/v1/topics/${TOPIC_ID}/messages?timestamp=gte:${hederaTimestamp}`;

    const json = await $fetch(MIRROR_URL);

    if (json.messages?.length) {
        // get last message (last in array)
        const msg = json.messages[json.messages.length - 1];
        const decoded = atob(msg.message);
        const payload = JSON.parse(decoded);

        if (payload.temperature) {
            latestTemp.value = +payload.temperature;
        }

        if (payload.humidity) {
            latestHum.value = +payload.humidity;
        }

        if (payload.airPressure) {
            latestAirPressure.value = +payload.airPressure;
        }
    }

    // then start listening for new messages
    startListening();
});

async function startListening() {
    await $fetch("/api/hcs/start");

    const es = new EventSource("/api/hcs/stream");
    es.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // console.log(data);

        if (data.temperature !== undefined) {
            console.log("data.temperature :>> ", data.temperature);
            latestTemp.value = +data.temperature;
        }

        if (data.humidity !== undefined) {
            console.log("data.humidity :>> ", data.humidity);
            latestHum.value = +data.humidity;
        }

        if (data.airPressure !== undefined) {
            console.log("data.airPressure :>> ", data.airPressure);
            latestAirPressure.value = +data.airPressure;
        }
    };
}

// stop listening when component is unmounted
onUnmounted(() => {
    stopListening();
});

async function stopListening() {
    await $fetch("/api/hcs/stop");
}
</script>
