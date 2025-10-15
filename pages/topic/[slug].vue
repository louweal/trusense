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
                            <div class="flex gap-4">
                                <div class="btn cursor-pointer" @click="openAlertModal()">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="22" fill="none">
                                        <path
                                            fill="#072847"
                                            d="M2.98 11.678a12.238 12.238 0 0 1 .507-9.762c.253-.542 0-1.193-.543-1.446-.506-.253-1.12-.036-1.41.47A14.316 14.316 0 0 0 .92 12.438c.216.578.831.831 1.41.65.578-.18.867-.867.65-1.41ZM30.35.94a1.04 1.04 0 0 0-1.446-.47 1.04 1.04 0 0 0-.47 1.446c1.519 3.037 1.7 6.58.506 9.762-.216.543.073 1.194.615 1.41.542.218 1.193-.072 1.41-.614 1.41-3.796 1.193-7.954-.614-11.534ZM5.403 10.268c.578-.108.94-.65.831-1.229a9.398 9.398 0 0 1 .109-3.76 1.078 1.078 0 1 0-2.097-.506A11.908 11.908 0 0 0 4.1 9.437c.109.578.687.94 1.302.831ZM25.578 5.243c.29 1.229.325 2.53.108 3.76-.108.578.29 1.157.868 1.265a1.099 1.099 0 0 0 1.266-.867c.289-1.555.253-3.146-.109-4.665a1.099 1.099 0 0 0-1.265-.867 1.099 1.099 0 0 0-.868 1.265v.109ZM23.3 13.956c-1.085-1.157-1.555-2.35-1.555-3.832V8.46c0-2.06-1.12-3.94-2.892-4.953V2.82A2.824 2.824 0 0 0 16.033 0a2.824 2.824 0 0 0-2.82 2.82v.723c-1.808 1.049-2.893 3.001-2.893 5.098v1.483c0 1.482-.47 2.675-1.555 3.832a2.265 2.265 0 0 0-2.133 2.278v.578A2.268 2.268 0 0 0 8.91 19.09h3.905a3.284 3.284 0 0 0 3.615 2.893 3.303 3.303 0 0 0 2.893-2.893h3.869a2.268 2.268 0 0 0 2.277-2.277v-.579c-.036-1.23-.976-2.206-2.169-2.278Z"
                                        />
                                    </svg>
                                    Alerts
                                </div>
                                <div class="btn">Device Settings</div>
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
        <ModalAlert v-if="id" :id="id" v-bind="sensor" />
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
    console.log(modal);
    if (!modal) return;

    modal.classList.add("is-active");
};
</script>
