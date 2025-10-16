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
                            <div class="flex gap-4 w-full justify-center items-center">
                                <div class="btn cursor-pointer flex gap-3" @click="openAlertModal()">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="22" fill="none">
                                        <path
                                            fill="#fff"
                                            d="M24.96 13.92a4.586 4.586 0 0 0-.797-2.59V0H0v16.05h15.771v.363l-1.385 3.463h3.655a2.552 2.552 0 0 0 5.032 0h3.734l-1.848-3.492v-2.463Zm-4.403-4.585a.92.92 0 1 1 .92-.92.92.92 0 0 1-.92.91v.01Zm0-2.823a1.9 1.9 0 0 0-1.536 3.026c-.354.11-.693.262-1.01.456l-2.253-1.966 7.423-6.459v8.73a4.495 4.495 0 0 0-1.173-.656 1.902 1.902 0 0 0-1.451-3.135v.004ZM8.405 8.035.983 14.478V1.569l7.422 6.466ZM1.805.983h20.553L12.093 9.918 1.805.983Zm0 14.084 7.34-6.393 2.948 2.545 2.925-2.545 2.201 1.916a4.586 4.586 0 0 0-1.438 3.33v1.144l-13.976.003Zm18.752 5.955a1.569 1.569 0 0 1-1.507-1.146h3.01a1.565 1.565 0 0 1-1.503 1.146Zm4.618-2.129h-9.332l.911-2.293v-2.68a3.611 3.611 0 0 1 7.223 0v2.706l1.198 2.267Z"
                                        />
                                    </svg>
                                    Alerts
                                </div>
                                <div class="btn flex gap-3" @click="openSettingsModal()">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none">
                                        <path
                                            fill="#fff"
                                            d="M19.5 10.5h-4.05a2.5 2.5 0 0 0-4.9 0H2.5a.5.5 0 0 0 0 1h8.05a2.5 2.5 0 0 0 4.9 0h4.05a.5.5 0 0 0 0-1Zm-6.5 2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM19.5 5H9.95a2.5 2.5 0 0 0-4.9 0H2.5a.5.5 0 1 0 0 1h2.55a2.5 2.5 0 0 0 4.9 0h9.55a.5.5 0 0 0 0-1Zm-12 2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM19.5 15.5H9.95a2.5 2.5 0 0 0-4.9 0H2.5a.5.5 0 0 0 0 1h2.55a2.5 2.5 0 0 0 4.9 0h9.55a.5.5 0 0 0 0-1Zm-12 2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
                                        />
                                        <path
                                            fill="#fff"
                                            d="M20.5 0h-19A1.502 1.502 0 0 0 0 1.5v19A1.502 1.502 0 0 0 1.5 22h19a1.502 1.502 0 0 0 1.5-1.5v-19A1.502 1.502 0 0 0 20.5 0Zm.5 20.5a.5.5 0 0 1-.5.5h-19a.5.5 0 0 1-.5-.5v-19a.5.5 0 0 1 .5-.5h19a.5.5 0 0 1 .5.5v19Z"
                                        />
                                    </svg>
                                    Device Settings
                                </div>

                                <div class="btn" @click="setSettings()">Set settings</div>
                            </div>
                        </div>
                    </div>

                    <Chart v-if="topicId" :topicId="topicId" :interval="interval" />
                    <div v-else>
                        <p>Loading chart...</p>
                    </div>
                </div>
            </div>
        </section>
        <ModalAlert v-if="id" :id="id" :topicId="topicId" v-bind="sensor" />
        <ModalSettings v-if="id" :id="id" :topicId="topicId" :interval="interval" />
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
