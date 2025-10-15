<template>
    <canvas id="gaugeChart" ref="gaugeCanvas" class=""></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart, ArcElement, Tooltip, Legend, registerables } from "chart.js";
Chart.register(...registerables);

const props = defineProps({
    title: String,
    unit: String,
    color: {
        type: String,
        default: "#000",
    },
    min: Number,
    max: Number,
    value: Number, // current value
});

Chart.register(ArcElement, Tooltip, Legend);

const gaugeCanvas = ref(null);
let gaugeChart = null;

watch(
    () => props.value,
    (newVal) => {
        if (!gaugeChart) return;

        gaugeChart.data.datasets[0].data = [newVal, props.max - newVal];
        gaugeChart.update({ duration: 300 });
    },
);

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
        ctx.fillText(`${props.value}`, width / 2, height * 0.82);

        ctx.font = "bold 12px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`${props.min}`, 5, height * 0.95);

        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${props.unit}`, width / 2, height * 0.95);

        ctx.textAlign = "right";
        ctx.fillText(`${props.max}`, width - 5, height * 0.95);
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
                    backgroundColor: [props.color, "#f3f2f2"],
                    borderWidth: 0,
                    cutout: "50%",
                    rotation: -90,
                    circumference: 180,
                },
            ],
        },
        options: {
            responsive: true,
            aspectRatio: window.innerWidth < 480 ? 2 : 3,

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
