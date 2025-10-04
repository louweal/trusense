<template>
    <header class="hero">
        <div class="container">
            <h1>TruSense ESP32-{{ name }}</h1>
        </div>
    </header>
</template>

<script setup>
// props
const props = defineProps({
    name: {
        type: String,
        default: "006938176",
    },
});
</script>
