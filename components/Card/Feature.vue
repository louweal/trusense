<template>
    <div class="flex flex-col gap-5 justify-center items-center p-5" data-aos="fade-up">
        <div class="icon icon--feature" :id="`icon-${i}`">
            <img :src="icon" :alt="title" />
        </div>

        <h3 class="h4 font-bold text-primary">{{ title }}</h3>
        <p class="text-center opacity-60 text-primary">
            {{ description }}
        </p>
    </div>
</template>

<script setup>
const props = defineProps({
    title: String,
    description: String,
    icon: String,
    i: Number,
});
</script>
