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

const TOPIC_ID = "0.0.6938176"; // todo
const MIRROR_URL = `https://testnet.mirrornode.hedera.com/api/v1/topics/${TOPIC_ID}/messages`;

const chartCanvas = ref(null);
let chartInstance = null;
let lastTimestamp = null;
let pollInterval = null;
// === CHART CREATION ===
function createChart() {
    const ctx = chartCanvas.value.getContext("2d");

    const now = Date.now();
    const oneHourAgo = now - 1000 * 60 * 60; // 1 hour in milliseconds

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [
                {
                    label: "Hedera Topic Data",
                    data: [],
                    borderColor: "#f68227",
                    tension: 0.3,
                    parsing: false,
                },
            ],
        },
        options: {
            animation: false,
            responsive: true,
            // hide legend

            plugins: {
                legend: {
                    display: false,
                    position: "bottom",
                },
            },
            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: "minute",
                        tooltipFormat: "HH:mm:ss",
                    },
                    title: { display: true, text: "Time" },
                    min: oneHourAgo, // start of x-axis
                    max: now, // end of x-axis
                },
                y: {
                    title: { display: true, text: "Temperature (°C)" },
                    min: 22,
                    max: 30,
                },
            },
        },
    });
}

// === ADD DATA POINTS ===
function pushPoint(timestampMs, value) {
    const dataset = chartInstance.data.datasets[0].data;
    dataset.push({ x: timestampMs, y: value });

    if (dataset.length > 0) {
        const now = Date.now();
        chartInstance.options.scales.x.min = now - 1000 * 60 * 60; // 1 hour ago
        chartInstance.options.scales.x.max = now;
    }

    chartInstance.update("none");
}

// === FETCH FROM HEDERA MIRROR NODE ===
async function getMessages() {
    try {
        let url = MIRROR_URL;
        if (lastTimestamp) url += `?timestamp=gt:${lastTimestamp}`;
        const res = await fetch(url);
        const json = await res.json();

        if (json.messages?.length) {
            json.messages.forEach((msg) => {
                lastTimestamp = msg.consensus_timestamp;
                const decoded = atob(msg.message);

                try {
                    const payload = JSON.parse(decoded);

                    // ✅ Use the timestamp FROM the message (not from polling)
                    if (typeof payload.temperature === "number" && payload.timestamp) {
                        // console.log("New message:", payload);
                        pushPoint(payload.timestamp, payload.temperature);
                    }
                } catch (err) {
                    console.warn("Invalid message:", decoded);
                }
            });
        }
    } catch (err) {
        console.error("Polling error:", err);
    }
}

// === LIFECYCLE ===
onMounted(() => {
    createChart();
    pollInterval = setInterval(getMessages, 3000);
});

onBeforeUnmount(() => {
    clearInterval(pollInterval);
    chartInstance?.destroy();
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
