<template>
    <GaugeChart v-if="value" :title="title" :unit="unit" :min="min" :max="max" :value="value" />
    <GaugeChartPlaceholder v-else :title="title" :unit="unit" :min="min" :max="max" :value="min" />
</template>

<script setup>
const props = defineProps({
    title: String,
    unit: String,
    min: Number,
    max: Number,
    value: Number, // current value
});
</script>
