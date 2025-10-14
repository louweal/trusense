<template>
    <div class="grid sm:grid-cols-3 gap-5">
        <ClientOnly fallback="Loading charts...">
            <GaugeChartWrapper
                measurement="temperature"
                title="Temperature"
                unit="°C"
                :min="-40"
                :max="85"
                :value="curTemp"
                color="#f68227"
            />

            <GaugeChartWrapper
                measurement="humidity"
                title="Humidity"
                unit="%"
                :min="0"
                :max="100"
                :value="curHum"
                color="#072847"
            />
            <GaugeChartWrapper
                measurement="pressure"
                title="Air Pressure"
                unit="hPa"
                :min="950"
                :max="1100"
                :value="curAirPressure"
                color="#accfdc"
            />
        </ClientOnly>
        <ModalAlert :id="id" measurement="temperature" :email="user.email" />
        <ModalAlert :id="id" measurement="humidity" :email="user.email" />
        <ModalAlert :id="id" measurement="pressure" :email="user.email" />
    </div>
</template>

<script setup>
import { HederaService } from "~/lib/hedera";
import { HcsListener } from "../lib/HcsListener";
import { onMounted, onUnmounted, ref } from "vue";
import GaugeChartWrapper from "../../components/GaugeChartWrapper.vue";
import { useAuth } from "~/composables/useAuth";

const { user, loading, error, isLoggedIn, fetchUser, logout } = useAuth();
await fetchUser();

// const user = null;
const email = ref(null);

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    topicId: {
        type: String,
        required: true,
    },
    interval: {
        type: Number,
        required: true,
    },
});

const curTemp = ref(null);
const curHum = ref(null);
const curAirPressure = ref(null);

const hederaService = new HederaService();
let listener = new HcsListener();

// get the sensor for db on mount
onMounted(async () => {
    hederaService.getLastMessage(props.topicId, props.interval).then((message) => {
        // console.log(message);
        curTemp.value = message.temperature;
        curHum.value = message.humidity;
        curAirPressure.value = message.airPressure;
    });

    // then start listening for new messages
    listener = new HcsListener(props.topicId, (data) => {
        if (data.temperature !== undefined) curTemp.value = data.temperature;
        if (data.humidity !== undefined) curHum.value = data.humidity;
        if (data.airPressure !== undefined) curAirPressure.value = data.airPressure;
    });

    await listener.start();

    if (user.value) {
        console.log(user.value);
        email.value = user.value.email;

        // console.log("logged in");
        // console.log("user.email :>> ", user.value.email);
    } else {
        // console.log("not logged in");
    }
});

// stop listening when component is unmounted
onUnmounted(() => {
    listener?.stop();
});
</script>
