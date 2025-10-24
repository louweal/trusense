<template>
    <div class="bg-box p-8 rounded-[40px] flex gap-5 flex-wrap text-primary" v-if="temperature">
        <div class="flex gap-3" v-if="temperature">
            <div class="bg-secondary text-white size-6 rounded-full flex justify-center items-center">T</div>
            <div class="relative w-20">
                <transition name="fade">
                    <span :key="`temp-${counter}`" class="font-bold absolute inset-0"
                        >{{ temperature }} <span class="opacity-40">°C</span>
                    </span>
                </transition>
            </div>
        </div>
        <div class="flex gap-3" v-if="humidity">
            <div class="bg-accent text-primary size-6 rounded-full flex justify-center items-center">H</div>

            <div class="relative w-20">
                <transition name="fade">
                    <span :key="`humidity-${counter}`" class="font-bold text-primary absolute inset-0"
                        >{{ humidity }}<span class="opacity-40">%</span></span
                    >
                </transition>
            </div>
        </div>
        <div class="flex gap-3" v-if="airPressure">
            <div class="bg-primary text-white size-6 rounded-full flex justify-center items-center">P</div>
            <div class="relative w-[160px]">
                <transition name="fade">
                    <span :key="`pressure-${counter}`" class="font-bold absolute inset-0 origin-left"
                        >{{ airPressure }} <span class="opacity-40">hPa</span></span
                    >
                </transition>
            </div>
        </div>
    </div>
    <div v-else class="bg-box p-8 rounded-[40px] flex items-center gap-3">
        <span class="size-2 rounded-full bg-red-600"></span>
        <p>
            This sensor seems to be offline.
            <span @click="refresh()" class="underline cursor-pointer">Refresh</span>
        </p>
    </div>
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
const counter = ref(0);

const props = defineProps({
    // id: {
    //     type: String,
    //     required: true,
    // },
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

function refresh() {
    location.reload();
}

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
        counter.value++;
    });

    await listener.start();
});

onUnmounted(() => {
    listener?.stop();
});
</script>
