<template>
    <div class="grid md:grid-cols-8 gap-5 items-center">
        <div
            class="md:col-span-3"
            :class="{
                'md:order-last': props.reverse,
            }"
        >
            <!-- todo: smaller image -->
            <img class="w-full aspect-square rounded-full object-cover" :src="image" :alt="alt || title" />
        </div>
        <div class="md:col-span-5 p-8 flex flex-col gap-5">
            <h3>{{ title }}</h3>
            <p>
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
