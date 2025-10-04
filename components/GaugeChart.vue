<template>
    <div class="bg-box rounded-[40px] p-8">
        <h4>{{ title }}</h4>
        <canvas ref="gaugeCanvas"></canvas>

        <span>30 seconds ago</span>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

const props = defineProps({
    title: String,
    unit: String,
    min: Number,
    max: Number,
    value: Number,
});

Chart.register(ArcElement, Tooltip, Legend);

const gaugeCanvas = ref(null);

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
        ctx.fillText(`${props.value}`, width / 2, height * 0.7);

        ctx.font = "bold 12px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`${props.min}`, 5, height * 0.8);

        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${props.unit}`, width / 2, height * 0.8);

        ctx.textAlign = "right";
        ctx.fillText(`${props.max}`, width - 5, height * 0.8);
    },
};

onMounted(() => {
    const ctx = gaugeCanvas.value.getContext("2d");

    const percentage = Math.floor(Math.random() * (props.max - props.min + 1)) + props.min;

    new Chart(ctx, {
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
        },
        plugins: [addTextPlugin],
    });
});
</script>

<style scoped>
canvas {
    /* width: 100%;
    height: 200px; */
}
</style>
