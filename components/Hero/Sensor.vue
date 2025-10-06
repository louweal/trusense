<template>
    <header class="hero">
        <div class="container">
            <h1>{{ name }}</h1>

            <p>{{ topicId }}</p>

            <a href="https://hashscan.io/testnet/topic/{{ topicId }}/messages" target="_blank">Inspect on HashScan</a>
        </div>
    </header>
</template>

<script setup>
// props
const props = defineProps({
    name: {
        type: String,
        default: "TSS",
    },
    topicId: {
        type: String,
        required: true,
    },
});
</script>
