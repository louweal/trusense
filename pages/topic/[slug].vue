<template>
    <main>
        <Header />

        <section class="pt-24 pb-6">
            <div class="container">
                <div class="flex flex-col gap-5 order-1 lg:order-2">
                    <div class="grid lg:grid-cols-3 gap-5">
                        <HeroSensor v-if="topicId" :id="id" :name="name" :interval="interval" :topicId="topicId" />

                        <div class="lg:col-span-2 flex flex-col flex-grow gap-5 flex-stretch h-full w-full">
                            <CurrentMeasurements v-if="topicId" :topicId="topicId" :interval="interval" />
                        </div>
                    </div>

                    <Chart v-if="topicId" :topicId="topicId" :interval="interval" />
                    <!-- <div v-else>
                        <p>Loading chart...</p>
                    </div> -->
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import { HederaService } from "~/lib/hedera";
import { HcsListener } from "../../lib/HcsListener";
import { onMounted, onUnmounted, ref } from "vue";
import CurrentMeasurements from "../../components/CurrentMeasurements.vue";

// get slug
const route = useRoute();
const slug = route.params.slug;

const id = ref(null);
const topicId = ref(null);
const interval = ref(null);
const name = ref(null);
const curTemp = ref(null);
const curHum = ref(null);
const curAirPressure = ref(null);
const pageTitle = ref("Loading...");
const sensor = ref({});

const hederaService = new HederaService();
let listener = new HcsListener();

// get the sensor for db on mount
onMounted(async () => {
    try {
        sensor.value = await $fetch("/api/sensors/by-topic/" + slug);
        id.value = sensor.value.id;
        topicId.value = sensor.value.topicId;
        interval.value = sensor.value.interval;
        name.value = sensor.value.name;
        pageTitle.value = sensor.value.name;
    } catch (error) {
        console.log(error);
    }

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

const openAlertModal = () => {
    const modal = document.querySelector(".alert-modal");
    if (!modal) return;

    modal.classList.add("is-active");

    // disable scroll on body
    document.body.style.overflow = "hidden";
};

const openSettingsModal = () => {
    const modal = document.querySelector(".settings-modal");
    if (!modal) return;

    modal.classList.add("is-active");

    // disable scroll on body
    document.body.style.overflow = "hidden";
};

const setSettings = async () => {
    console.log("set settings");
    // open modal

    const res = await fetch("https://trusense-web-server.onrender.com/settings/" + topicId.value, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name.value,
            email: "anneloeslouwe@gmail.com",
            minTemp: sensor.value.minTemp,
            maxTemp: sensor.value.maxTemp,
            minHum: sensor.value.minHum,
            maxHum: sensor.value.maxHum,
            minAirPres: sensor.value.minPres,
            maxAirPres: sensor.value.maxPres,
        }),
    });

    const data = await res.json();
    console.log(data);

    console.log("data.status :>> ", data.status);

    // get received data
    if (data.received) {
        console.log(data.received);
    }
};
</script>
