<template>
    <canvas id="gaugeChart" ref="gaugeCanvas" class="max-h-[210px]"></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart, ArcElement, Tooltip, Legend, registerables } from "chart.js";
Chart.register(...registerables);

const props = defineProps({
    title: String,
    unit: String,
    min: Number,
    max: Number,
    value: Number, // current value
});

Chart.register(ArcElement, Tooltip, Legend);

const gaugeCanvas = ref(null);
let gaugeChart = null;

// Plugin to draw centered text
const addTextPlugin = {
    id: "gaugeTexts",
    afterDraw(chart) {
        const {
            ctx,
            chartArea: { width, height },
        } = chart;
        ctx.save();
        ctx.font = "normal 32px 'Libre Baskerville'";
        ctx.fillStyle = "#333";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`No data`, width / 2, height * 0.54);
    },
};

onMounted(() => {
    const ctx = gaugeCanvas.value.getContext("2d");

    const percentage = ((props.value - props.min) / (props.max - props.min)) * 100;

    gaugeChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            // labels: ["Used", "Remaining"], // Labels for legend
            datasets: [
                {
                    data: [percentage, 100 - percentage], // Gauge value
                    backgroundColor: ["#f68227", "#E0E0E0"],
                    borderWidth: 0,
                    cutout: "50%",
                    rotation: -90,
                    circumference: 180,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                    position: "bottom",
                },
                tooltip: { enabled: false },
            },
            hover: {
                mode: null,
            },
            animation: {
                animateRotate: false,
                animateScale: false,
            },
        },
        plugins: [addTextPlugin],
    });
});
</script>
