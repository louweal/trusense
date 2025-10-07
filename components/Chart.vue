<template>
    <div class="bg-box rounded-[40px] p-8">
        <h3>Historical Data</h3>

        <div class="flex w-full gap-4 my-10">
            <div class="btn flex-grow" @click="handleFilter('lastHour')">Last hour</div>
            <div class="btn flex-grow" @click="handleFilter('lastDay')">Last day</div>
            <div class="btn flex-grow" @click="handleFilter('lastWeek')">Last week</div>
            <div class="btn flex-grow" @click="handleFilter('lastMonth')">Last month</div>
        </div>

        <div class="flex w-full gap-4 my-10">
            <div class="relative flex-grow">
                <label
                    for="start"
                    class="bg-secondary absolute -top-2 left-1/2 -translate-x-1/2 rounded px-3 pt-1 text-xs"
                    >Start date</label
                >
                <input class="" id="start" type="datetime-local" v-model="inputStartDate" @input="validateDates" />
                <p v-if="startError" class="text-red-600">{{ startError }}</p>
            </div>

            <div class="relative flex-grow">
                <label
                    for="end"
                    class="bg-secondary absolute -top-2 left-1/2 -translate-x-1/2 rounded px-3 pt-1 text-xs"
                    >End date</label
                >
                <input
                    id="end"
                    type="datetime-local"
                    v-model="inputEndDate"
                    @input="validateDates"
                    :min="inputStartDate"
                />
                <p v-if="endError" class="text-red-600">{{ endError }}</p>
            </div>
        </div>

        <div class="relative">
            <canvas ref="chartCanvas" :class="{ 'opacity-5': isFetching }"></canvas>
            <div class="absolute inset-0 flex items-center justify-center" v-if="isFetching">
                <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            </div>
        </div>

        <div>
            Realtime:
            <span class="font-semibold" :class="{ 'text-red-600': !realtime, 'text-green-600': realtime }">{{
                realtime ? "ON" : "OFF"
            }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Chart } from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { HcsListener } from "../lib/HcsListener";
import { fa, tr } from "zod/v4/locales";

// let listener = new HcsListener();

const props = defineProps({
    topicId: String,
    interval: Number,
});
let isFetching = ref(false);
let realtime = ref(true);

const startDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago
const localStartDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

const endDate = new Date();
const localEndDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

const inputStartDate = ref(localStartDate);
const inputEndDate = ref(localEndDate);

// Helper: format date for datetime-local
function formatDateTimeLocal(date) {
    return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
}

const startError = ref("");
const endError = ref("");

const validateDates = () => {
    // console.log("validateDates");
    startError.value = "";
    endError.value = "";

    if (!inputStartDate.value || !inputEndDate.value) return;

    const startDate = new Date(inputStartDate.value);
    const endDate = new Date(inputEndDate.value);

    // If start > end, show start error
    if (startDate > endDate) {
        startError.value = "Invalid time range.";
    }

    // If end < start, show end error
    if (endDate < startDate) {
        endError.value = "Invalid time range.";
    }

    // validation passed
    hcsListener?.stop();
    realtime.value = false;

    const hederaStartTimestamp = Math.floor(startDate.getTime() / 1000);
    const hederaEndTimestamp = Math.floor(endDate.getTime() / 1000);

    // delete all current chart data points
    deletePoints();

    let newFetchUrl = `https://testnet.mirrornode.hedera.com/api/v1/topics/${props.topicId}/messages?timestamp=gte:${hederaStartTimestamp}&timestamp=lte:${hederaEndTimestamp}&order=asc`;

    fetchHistoricalMessages(newFetchUrl);
};

function deletePoints() {
    chartInstance.data.datasets[0].data = [];
    chartInstance.data.datasets[1].data = [];
    chartInstance.data.datasets[2].data = [];
}

const chartCanvas = ref(null);
let chartInstance = null;
let hcsListener = null;

// === CHART CREATION ===
function createChart() {
    const ctx = chartCanvas.value.getContext("2d");

    Chart.defaults.font.family = "'Libre Baskerville', serif";
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
                    pointRadius: 0,
                },
                {
                    label: "Humidity (%)",
                    data: [],
                    borderColor: "#00b0ff",
                    tension: 0.3,
                    parsing: false,
                    yAxisID: "yHumidity",
                    pointRadius: 0,
                },
                {
                    label: "Air Pressure (hPa)",
                    data: [],
                    borderColor: "#ff4081",
                    tension: 0.3,
                    parsing: false,
                    yAxisID: "yPressure",
                    pointRadius: 0,
                },
            ],
        },
        options: {
            animation: false,
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    // labels: {
                    //     font: {
                    //         family: "'Libre Baskerville', serif",
                    //         size: 16,
                    //     },
                    // },
                },
                decimation: {
                    enabled: true,
                    algorithm: "lttb", // "Largest Triangle Three Buckets"
                    samples: 5000, // reduce to ~5k visible points
                },
            },
            scales: {
                x: {
                    type: "time",
                    time: { unit: "minute", tooltipFormat: "HH:mm:ss" },
                    title: { display: true, text: "Time" },
                    // min: chartStartDate,
                    // max: chartEndDate,
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
function pushPoint(timestamp, temperature, humidity, airPressure, shiftAxis = false) {
    if (!chartInstance) return;

    // convert hedera timestamp to timestamp in ms
    timestamp = new Date(timestamp).getTime();

    // const dataset = chartInstance.data.datasets[0].data;
    chartInstance.data.datasets[0].data.push({ x: timestamp, y: temperature });
    chartInstance.data.datasets[1].data.push({ x: timestamp, y: humidity });
    chartInstance.data.datasets[2].data.push({ x: timestamp, y: airPressure });

    // if (shiftAxis == true) {
    //     const xAxisMin = +chartInstance.scales.x.min + +props.interval;
    //     console.log(chartInstance.scales.x.min + " >> " + xAxisMin);
    //     chartInstance.options.scales.x.min = xAxisMin;
    //     chartInstance.options.scales.x.max = Date.now();
    // }

    chartInstance.update("none");
}

function handleFilter(filter) {
    const end = new Date();
    const tsEnd = Math.floor(end.getTime() / 1000);
    let baseUrl = `https://testnet.mirrornode.hedera.com/api/v1/topics/${props.topicId}/messages?timestamp=lte:${tsEnd}&order=asc`;
    let start = new Date(end.getTime() - 60 * 60 * 1000);
    let tsStart = Math.floor(start.getTime() / 1000);

    switch (filter) {
        case "lastHour":
            deletePoints();
            fetchHistoricalMessages(baseUrl + `&timestamp=gte:${tsStart}`);
            hcsListener.start();
            realtime.value = true;
            break;
        case "lastDay":
            console.log("lastDay");
            start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
            tsStart = Math.floor(start.getTime() / 1000);
            deletePoints();
            fetchHistoricalMessages(baseUrl + `&timestamp=gte:${tsStart}`);
            realtime.value = false;
            break;
        case "lastWeek":
            start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
            tsStart = Math.floor(start.getTime() / 1000);
            deletePoints();
            fetchHistoricalMessages(baseUrl + `&timestamp=gte:${tsStart}`);
            realtime.value = false;

            break;
        case "lastMonth":
            start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
            tsStart = Math.floor(start.getTime() / 1000);
            deletePoints();
            fetchHistoricalMessages(baseUrl + `&timestamp=gte:${tsStart}`);
            realtime.value = false;

            break;
        default:
            console.error("Invalid filter:", filter);
            break;
    }
}

// === FETCH LAST MESSAGES ===
async function fetchHistoricalMessages(url, shiftAxis = false) {
    isFetching.value = true;
    try {
        const res = await fetch(url);
        const json = await res.json();

        if (json.messages?.length) {
            // console.log("num messages :>> ", json.messages.length);

            json.messages.forEach((msg) => {
                try {
                    const decoded = atob(msg.message);
                    const payload = JSON.parse(decoded);

                    pushPoint(payload.timestamp, payload.temperature, payload.humidity, payload.airPressure, shiftAxis);
                } catch (err) {
                    console.warn("Invalid message:", msg.message);
                }
            });
        } else {
            console.log("No messages found.");
        }

        // console.log("json.links :>> ", json.links);
        if (json.links?.next) {
            await fetchHistoricalMessages("https://testnet.mirrornode.hedera.com" + json.links.next);
        }

        isFetching.value = false;
    } catch (err) {
        console.error("Error fetching historical messages:", err);
    }
}

// === LIFECYCLE ===
onMounted(async () => {
    createChart();

    const startDate = new Date(Date.now() - 1000 * 60 * 60); // last hour
    const endDate = new Date(Date.now());
    const hederaStartTimestamp = Math.floor(startDate.getTime() / 1000);
    const hederaEndTimestamp = Math.floor(endDate.getTime() / 1000);
    // const start = `${hederaStartTimestamp}.0`;
    // const end = `${hederaEndTimestamp}.0`;
    const initialFetchUrl = `https://testnet.mirrornode.hedera.com/api/v1/topics/${props.topicId}/messages?timestamp=gte:${hederaStartTimestamp}&timestamp=lte:${hederaEndTimestamp}&order=asc`;

    await fetchHistoricalMessages(initialFetchUrl);

    // sort chartData by timestamp
    // chartData.sort((a, b) => a.timestamp - b.timestamp);

    // chartData.forEach((data) => {
    //     pushPoint(data.timestamp, data.temperature, data.humidity, data.airPressure);
    //     // delay
    //     // setTimeout(() => {
    //     //     pushPoint(data.timestamp, data.temperature, data.humidity, data.airPressure);
    //     // }, 2000);
    // });

    // start listening for new messages
    hcsListener = new HcsListener(props.topicId, (data) => {
        if (data.temperature !== undefined && data.timestamp !== undefined) {
            pushPoint(data.timestamp, data.temperature, data.humidity, data.airPressure, true);
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
