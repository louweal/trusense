<template>
    <NuxtLink :to="nuxtTo" class="bg-box p-8 rounded-[40px] flex flex-col gap-4">
        <h2 class="font-bold font-body text-lg">{{ name }}</h2>
        <div class="flex flex-wrap gap-5">
            <div class="flex gap-3" v-if="temperature">
                <div class="bg-secondary text-white size-6 rounded-full flex justify-center items-center">T</div>
                <span class="font-bold">{{ temperature }}°C</span>
            </div>
            <div class="flex gap-3" v-if="humidity">
                <div class="bg-accent text-primary size-6 rounded-full flex justify-center items-center">H</div>
                <span class="font-bold text-primary">{{ humidity }}%</span>
            </div>
            <div class="flex gap-3" v-if="airPressure">
                <div class="bg-primary text-white size-6 rounded-full flex justify-center items-center">P</div>
                <span class="font-bold">{{ airPressure }} hPa</span>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { HederaService } from "~/lib/hedera";
import { HcsListener } from "../lib/HcsListener";

const hederaService = new HederaService();
let listener = new HcsListener();

const temperature = ref(null);
const humidity = ref(null);
const airPressure = ref(null);

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: "",
    },
    topicId: {
        type: String,
        required: true,
    },
    interval: {
        type: Number,
        required: true,
    },
    link: {
        type: String,
        required: false,
    },
});

const nuxtTo = props.link ? ref(props.link) : ref(`/topic/${props.topicId}`);

onMounted(async () => {
    const lastMessage = await hederaService.getLastMessage(props.topicId, props.interval);
    if (!lastMessage) return;

    temperature.value = lastMessage.temperature;
    humidity.value = lastMessage.humidity;
    airPressure.value = lastMessage.airPressure;

    // then start listening for new messages
    listener = new HcsListener(props.topicId, (data) => {
        if (data.temperature !== undefined) temperature.value = data.temperature;
        if (data.humidity !== undefined) humidity.value = data.humidity;
        if (data.airPressure !== undefined) airPressure.value = data.airPressure;
    });

    await listener.start();
});

onUnmounted(() => {
    listener?.stop();
});
</script>
