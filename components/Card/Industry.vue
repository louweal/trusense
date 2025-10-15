<template>
    <div class="grid md:grid-cols-8 gap-5 items-center" data-aos="fade-up">
        <div
            class="md:col-span-3"
            :class="{
                'md:order-last': props.reverse,
            }"
        >
            <div class="w-full aspect-square object-cover">
                <img class="w-full h-full rounded-full object-cover" :src="image" :alt="alt || title" />
            </div>
        </div>
        <div class="md:col-span-5 p-8 flex flex-col gap-5 text-primary">
            <h3 class="h3">{{ title }}</h3>
            <p class="text-xl opacity-75">
                {{ description }}
            </p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    reverse: Boolean,
    title: String,
    description: String,
    image: String,
    alt: String,
});
</script>
