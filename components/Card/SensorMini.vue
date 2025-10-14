<template>
    <NuxtLink :to="`/topic/${topicId}`" class="bg-white p-8 rounded-[40px] flex flex-col gap-4">
        <h2 class="font-bold font-body text-lg">{{ name }}</h2>
        <div class="flex gap-5">
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
import { onMounted } from "vue";
import { HederaService } from "~/lib/hedera";

const hederaService = new HederaService();

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
});

onMounted(async () => {
    const lastMessage = await hederaService.getLastMessage(props.topicId, props.interval);
    if (!lastMessage) return;

    temperature.value = lastMessage.temperature;
    humidity.value = lastMessage.humidity;
    airPressure.value = lastMessage.airPressure;
});
</script>
