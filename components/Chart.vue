<template>
    <div class="bg-box rounded-[40px] px-4 py-8 md:p-8 flex flex-col gap-5">
        <div class="flex justify-between items-center">
            <h3 class="text-lg">
                <!-- Historical Data -->
            </h3>

            <div>
                Realtime
                <span
                    class="font-semibold px-2 py-1 rounded-2xl cursor-pointer text-sm"
                    :class="{ 'text-red-600 bg-red-600/10': !realtime, 'text-green-600 bg-green-600/10': realtime }"
                >
                    <span v-if="realtime" @click="stopRealtime()">ON</span>
                    <span v-else @click="startRealtime()">OFF</span>
                </span>
            </div>
        </div>

        <div class="flex flex-wrap w-full gap-4">
            <div
                class="btn flex-grow"
                :class="{ 'btn--primary': activeBtn === 'lastHour' }"
                @click="handleFilter('lastHour')"
            >
                Last hour
            </div>
            <div
                class="btn flex-grow"
                :class="{ 'btn--primary': activeBtn === 'lastDay' }"
                @click="handleFilter('lastDay')"
            >
                Last day
            </div>
            <div
                class="btn flex-grow"
                :class="{ 'btn--primary': activeBtn === 'lastWeek' }"
                @click="handleFilter('lastWeek')"
            >
                Last week
            </div>
            <div
                class="btn flex-grow"
                :class="{ 'btn--primary': activeBtn === 'lastMonth' }"
                @click="handleFilter('lastMonth')"
            >
                Last month
            </div>
            <div class="relative flex-grow">
                <label
                    for="start"
                    class="bg-primary absolute top-2 left-2 bottom-2 rounded-xl flex justify-center items-center px-4 text-white"
                >
                    Start date
                </label>
                <input class="" id="start" type="datetime-local" v-model="inputStartDate" @input="validateDates" />
                <p v-if="startError" class="text-red-600">{{ startError }}</p>
            </div>

            <div class="relative flex-grow">
                <label
                    for="start"
                    class="bg-primary absolute top-2 left-2 bottom-2 rounded-xl flex justify-center items-center px-4 text-white"
                >
                    End date
                </label>
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

        <div class="relative flex flex-col gap-5 justify-center items-center">
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

            <div class="flex flex-wrap gap-x-2 md:gap-x-6">
                <div
                    class="flex items-center gap-1"
                    v-if="chartInstance"
                    v-for="(dataset, index) in datasets"
                    :key="index"
                    @click="toggleDataset(index)"
                >
                    <span
                        class="cursor-pointer w-3 h-3 rounded-full inline-block"
                        :class="{ 'opacity-50': !dataset.active }"
                        :style="{ backgroundColor: dataset.color }"
                    ></span>
                    <span class="cursor-pointer" :class="{ 'opacity-50': !dataset.active }">
                        {{ dataset.name }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Chart } from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { HcsListener } from "../lib/HcsListener";

const config = useRuntimeConfig();

const props = defineProps({
    topicId: String,
    interval: Number,
});

const datasets = ref([
    { name: "Temperature", scale: "y", active: true, color: "#f68227" },
    { name: "Humidity", scale: "yHumidity", active: true, color: "#accfdc" },
    { name: "Air Pressure", scale: "yPressure", active: true, color: "#072847" },
]);
const isFetching = ref(false);
const realtime = ref(true);
const activeBtn = ref("lastHour");

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

function startRealtime() {
    hcsListener.start();
    realtime.value = true;
}

function stopRealtime() {
    hcsListener?.stop();
    realtime.value = false;
}

const validateDates = async () => {
    startError.value = "";
    endError.value = "";
    activeBtn.value = "";

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

    let newFetchUrl = `https://${config.public.hederaNetwork}.mirrornode.hedera.com/api/v1/topics/${props.topicId}/messages?timestamp=gte:${hederaStartTimestamp}&timestamp=lte:${hederaEndTimestamp}&order=asc`;

    await fetchHistoricalMessages(newFetchUrl);
    setScales();
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
    Chart.defaults.font.size = window.innerWidth < 480 ? 10 : 12;

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [
                {
                    label: "Temperature (°C)",
                    data: [],
                    borderColor: datasets.value[0].color,
                    backgroundColor: datasets.value[0].color,
                    tension: 0,
                    parsing: false,
                    pointRadius: 3,
                },
                {
                    label: "Humidity (%)",
                    data: [],
                    borderColor: datasets.value[1].color,
                    backgroundColor: datasets.value[1].color,
                    tension: 0.1,
                    parsing: false,
                    yAxisID: "yHumidity",
                    pointRadius: 3,
                },
                {
                    label: "Air Pressure (hPa)",
                    data: [],
                    borderColor: datasets.value[2].color,
                    backgroundColor: datasets.value[2].color,
                    tension: 0.1,
                    parsing: false,
                    yAxisID: "yPressure",
                    pointRadius: 3,
                },
            ],
        },
        // height: 300,
        options: {
            aspectRatio: window.innerWidth < 480 ? 1 : 3,
            animation: false,
            responsive: true,
            spanGaps: props.interval * 1.5,
            plugins: {
                legend: {
                    display: false,
                },
                decimation: {
                    enabled: true,
                    algorithm: "lttb", // "Largest Triangle Three Buckets"
                    samples: 5000, // reduce to ~5k visible points
                },
                tooltip: {
                    displayColors: false,
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    titleColor: "black",
                    bodyColor: "black",
                    yAlign: "bottom",
                    xAlign: "center",
                    callbacks: {
                        label: (context) => {
                            const datasetLabel = context.dataset.label || "";

                            // Pick tooltip text depending on dataset
                            switch (datasetLabel) {
                                case "Temperature (°C)":
                                    return `${context.parsed.y.toFixed(2)}°C`;
                                case "Humidity (%)":
                                    return `${context.parsed.y.toFixed(1)}%`;
                                case "Air Pressure (hPa)":
                                    return `${context.parsed.y.toFixed(1)} hPa`;
                                default:
                                    return `${context.parsed.y}`;
                            }
                        },
                        title: (context) => {
                            return new Date(context[0].parsed.x).toLocaleString();
                        },
                    },
                },
            },
            scales: {
                x: {
                    type: "time",
                    time: { unit: "minute", tooltipFormat: "HH:mm:ss" },
                    title: { display: false, text: "Time" },
                    // min: chartStartDate,
                    // max: chartEndDate,
                },
                y: {
                    display: true,
                    title: { display: true, text: "Temperature (°C)" },
                    grid: { drawOnChartArea: false },
                    ticks: {
                        precision: window.innerWidth < 480 ? 0 : undefined,
                    },
                },
                yPressure: {
                    type: "linear",
                    display: false,
                    position: "right",
                    offset: true, // offset so pressure axis doesn’t overlap humidity
                    title: { display: true, text: "Air Pressure (hPa)" },
                    // min: 950,
                    // max: 1050,
                    grid: { drawOnChartArea: false },
                    ticks: {
                        precision: window.innerWidth < 480 ? 0 : undefined,
                    },
                },
                yHumidity: {
                    type: "linear",
                    display: true,
                    position: "right",
                    title: { display: true, text: "Humidity (%)" },
                    // min: 0,
                    // max: 100,
                    // avoid grid lines overlapping
                    ticks: {
                        precision: window.innerWidth < 480 ? 0 : undefined,
                    },
                },
            },
        },
    });
}

function pushPoint(timestamp, temperature, humidity, airPressure) {
    if (!chartInstance) return;

    chartInstance.data.datasets[0].data.push({ x: timestamp, y: temperature });
    chartInstance.data.datasets[1].data.push({ x: timestamp, y: humidity });
    chartInstance.data.datasets[2].data.push({ x: timestamp, y: airPressure });

    chartInstance.update("none");
}

async function handleFilter(filter) {
    const end = new Date();
    const tsEnd = Math.floor(end.getTime() / 1000);
    let baseUrl = `https://${config.public.hederaNetwork}.mirrornode.hedera.com/api/v1/topics/${props.topicId}/messages?timestamp=lte:${tsEnd}&order=asc&limit=100`;
    let start = new Date(end.getTime() - 60 * 60 * 1000);
    let tsStart = Math.floor(start.getTime() / 1000);

    activeBtn.value = filter;

    switch (filter) {
        case "lastHour":
            deletePoints();
            await fetchHistoricalMessages(baseUrl + `&timestamp=gte:${tsStart}`);
            setScales();
            hcsListener.start();
            realtime.value = true;
            break;
        case "lastDay":
            start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
            tsStart = Math.floor(start.getTime() / 1000);
            deletePoints();
            await fetchHistoricalMessages(baseUrl + `&timestamp=gte:${tsStart}`);
            setScales();
            realtime.value = false;
            break;
        case "lastWeek":
            start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
            tsStart = Math.floor(start.getTime() / 1000);
            deletePoints();
            await fetchHistoricalMessages(baseUrl + `&timestamp=gte:${tsStart}`);
            setScales();
            realtime.value = false;

            break;
        case "lastMonth":
            start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
            tsStart = Math.floor(start.getTime() / 1000);
            deletePoints();
            await fetchHistoricalMessages(baseUrl + `&timestamp=gte:${tsStart}`);
            setScales();
            realtime.value = false;

            break;
        default:
            console.error("Invalid filter:", filter);
            break;
    }
}

function toggleDataset(i) {
    // const dataset = chartInstance.data.datasets[i];
    chartInstance.data.datasets[i].hidden = !chartInstance.data.datasets[i].hidden;

    datasets.value[i].active = !datasets.value[i].active;

    chartInstance.update();
}

function setScales() {
    for (let i = 0; i < datasets.value.length; i++) {
        const scaleName = datasets.value[i].scale;
        // console.log("scaleName :>> ", scaleName);
        let data = chartInstance.data.datasets[i].data;

        if (data.length > 0) {
            const minVal = Math.min(...data.map((point) => point.y));
            const maxVal = Math.max(...data.map((point) => point.y));
            const offset = (maxVal - minVal) * 0.2; //  padding

            const newMin = minVal - offset;
            const newMax = maxVal + offset;

            // console.log("newMin :>> ", newMin);
            // console.log("newMax :>> ", newMax);

            // check if scale needs to be bigger
            chartInstance.options.scales[scaleName].min = newMin;
            chartInstance.options.scales[scaleName].max = newMax;
        } else {
            console.log("No data found.");
        }
    }

    chartInstance.update();
}

// === FETCH LAST MESSAGES ===
async function fetchHistoricalMessages(url) {
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

                    pushPoint(payload.timestamp, payload.temperature, payload.humidity, payload.airPressure);
                } catch (err) {
                    console.warn("Invalid message:", msg.message);
                }
            });
        } else {
            console.log("No messages found.");
        }

        // console.log("json.links :>> ", json.links);
        if (json.links?.next) {
            await fetchHistoricalMessages(
                `https://${config.public.hederaNetwork}.mirrornode.hedera.com${json.links.next}`,
            );
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

    const initialFetchUrl = `https://${config.public.hederaNetwork}.mirrornode.hedera.com/api/v1/topics/${props.topicId}/messages?timestamp=gte:${hederaStartTimestamp}&timestamp=lte:${hederaEndTimestamp}&order=asc&limit=100`;

    await fetchHistoricalMessages(initialFetchUrl);
    setScales();

    // start listening for new messages
    hcsListener = new HcsListener(props.topicId, (data) => {
        if (
            data.temperature !== undefined &&
            data.humidity !== undefined &&
            data.airPressure !== undefined &&
            data.timestamp !== undefined
        ) {
            pushPoint(data.timestamp, data.temperature, data.humidity, data.airPressure);
            setScales();
        }
    });

    hcsListener.start();
});

onBeforeUnmount(() => {
    chartInstance?.destroy();
    hcsListener?.stop();
});
</script>
