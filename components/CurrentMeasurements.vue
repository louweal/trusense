<template>
    <div class="grid sm:grid-cols-3 gap-5">
        <ClientOnly fallback="Loading charts...">
            <GaugeChartWrapper title="Temperature" unit="°C" :min="-40" :max="85" :value="curTemp" color="#f68227" />

            <GaugeChartWrapper title="Humidity" unit="%" :min="0" :max="100" :value="curHum" color="#072847" />
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
</template>

<script setup>
import { HederaService } from "~/lib/hedera";
import { HcsListener } from "../lib/HcsListener";
import { onMounted } from "vue";
import GaugeChartWrapper from "../../components/GaugeChartWrapper.vue";

const props = defineProps({
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
});

// stop listening when component is unmounted
onUnmounted(() => {
    listener?.stop();
});
</script>
