<template>
    <div class="bg-box rounded-[40px] p-8">
        <h2>Temperature: Last Hour</h2>

        <div class="flex gap-4">
            <div>
                <label for="start">Start:</label>
                <input
                    class="border"
                    id="start"
                    type="datetime-local"
                    :placeholder="startPlaceholder"
                    v-model="start"
                    @input="validateDates"
                />
                <p v-if="startError" class="text-red-600">{{ startError }}</p>
            </div>

            <div>
                <label for="end">End:</label>
                <input
                    id="end"
                    type="datetime-local"
                    :placeholder="endPlaceholder"
                    v-model="end"
                    @input="validateDates"
                    :min="start"
                />
                <p v-if="endError" class="text-red-600">{{ endError }}</p>
            </div>
        </div>

        <canvas ref="chartCanvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Chart } from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { HcsListener } from "../lib/HcsListener";

// let listener = new HcsListener();

const props = defineProps({
    topicId: String,
    interval: Number,
});

const start = ref("");
const end = ref("");

// Helper: format date for datetime-local
function formatDateTimeLocal(date) {
    return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
}

// Dynamic placeholders
const now = new Date();
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

const startPlaceholder = formatDateTimeLocal(oneHourAgo);
const endPlaceholder = formatDateTimeLocal(now);

const startError = ref("");
const endError = ref("");

const validateDates = () => {
    startError.value = "";
    endError.value = "";

    if (!start.value || !end.value) return;

    const startDate = new Date(start.value);
    const endDate = new Date(end.value);

    // If start > end, show start error
    if (startDate > endDate) {
        startError.value = "Start date/time cannot be after end.";
    }

    // If end < start, show end error
    if (endDate < startDate) {
        endError.value = "End date/time cannot be before start.";
    }
};

const chartCanvas = ref(null);
let chartInstance = null;
let hcsListener = null;

// === CHART CREATION ===
function createChart() {
    const ctx = chartCanvas.value.getContext("2d");
    const now = Date.now();
    const oneHourAgo = now - 1000 * 60 * 60; // 1 hour

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [
                {
                    label: "Temperature (°C)",
                    data: [],
                    borderColor: "#f68227",
                    tension: 0.3,
                    parsing: false,
                },
                {
                    label: "Humidity (%)",
                    data: [],
                    borderColor: "#00b0ff",
                    tension: 0.3,
                    parsing: false,
                    yAxisID: "yHumidity",
                },
                {
                    label: "Air Pressure (hPa)",
                    data: [],
                    borderColor: "#ff4081",
                    tension: 0.3,
                    parsing: false,
                    yAxisID: "yPressure",
                },
            ],
        },
        options: {
            animation: false,
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
                x: {
                    type: "time",
                    time: { unit: "minute", tooltipFormat: "HH:mm:ss" },
                    title: { display: true, text: "Time" },
                    min: oneHourAgo,
                    max: now,
                },
                y: {
                    title: { display: true, text: "Temperature (°C)" },
                    min: 22,
                    max: 30,
                },
                yHumidity: {
                    type: "linear",
                    display: true,
                    position: "right",
                    title: { display: true, text: "Humidity (%)" },
                    min: 0,
                    max: 100,
                    grid: { drawOnChartArea: false }, // avoid grid lines overlapping
                },
                yPressure: {
                    type: "linear",
                    display: true,
                    position: "right",
                    offset: true, // offset so pressure axis doesn’t overlap humidity
                    title: { display: true, text: "Air Pressure (hPa)" },
                    min: 950,
                    max: 1050,
                    grid: { drawOnChartArea: false },
                },
            },
        },
    });
}

// === ADD DATA POINTS ===
function pushPoint(timestamp, temperature, humidity, airPressure) {
    if (!chartInstance) return;

    // convert hedera timestamp to timestamp in ms
    timestamp = new Date(timestamp).getTime();

    // const dataset = chartInstance.data.datasets[0].data;
    chartInstance.data.datasets[0].data.push({ x: timestamp, y: temperature });
    chartInstance.data.datasets[1].data.push({ x: timestamp, y: humidity });
    chartInstance.data.datasets[2].data.push({ x: timestamp, y: airPressure });

    const now = Date.now();
    chartInstance.options.scales.x.min = now - 1000 * 60 * 60; // last hour
    chartInstance.options.scales.x.max = now;

    chartInstance.update("none");
}

// === FETCH LAST MESSAGES ===
async function fetchHistoricalMessages(messageLimit) {
    // compute message limit based on interval
    messageLimit = Math.floor((1000 * 60 * 60) / props.interval);

    console.log("fetching historical messages...");
    const MIRROR_URL = `https://testnet.mirrornode.hedera.com/api/v1/topics/${props.topicId}/messages?limit=${messageLimit}&order=desc`;

    try {
        const res = await fetch(MIRROR_URL);
        const json = await res.json();

        if (json.messages?.length) {
            // messages come newest first; reverse to plot chronologically
            json.messages.reverse().forEach((msg) => {
                try {
                    const decoded = atob(msg.message);
                    const payload = JSON.parse(decoded);

                    pushPoint(payload.timestamp, payload.temperature, payload.humidity, payload.airPressure);
                } catch (err) {
                    console.warn("Invalid message:", msg.message);
                }
            });
        } else {
            console.log("No messages found.");
        }
    } catch (err) {
        console.error("Error fetching historical messages:", err);
    }
}

// === LIFECYCLE ===
onMounted(async () => {
    createChart();
    await fetchHistoricalMessages();

    hcsListener = new HcsListener(props.topicId, (data) => {
        if (data.temperature !== undefined && data.timestamp !== undefined) {
            pushPoint(data.timestamp, data.temperature, data.humidity, data.airPressure);
        }
    });

    hcsListener.start();
});

onBeforeUnmount(() => {
    chartInstance?.destroy();
    hcsListener?.stop();
});
</script>

<style scoped>
input#start {
    display: block;
    width: 100%;
    padding: 0.4rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
}
</style>
