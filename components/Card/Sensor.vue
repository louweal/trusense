<template>
    <NuxtLink :to="`/sensor/${id}`" class="grid md:grid-cols-3 gap-5 items-center bg-box p-8 rounded-[40px]">
        <div>
            <h2>{{ name }}</h2>
            {{ topicId }}
        </div>
    </NuxtLink>
</template>

<script setup>
const props = defineProps({
    id: {
        type: String,
        required: true,
    },
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
