<template>
    <div
        class="modal settings-modal fixed inset-0 w-full h-full top-0 left-0 right-0 bottom-0 invisible opacity-0 flex justify-center items-center backdrop-blur-sm transition-opacity duration-300 ease-in-out z-20"
    >
        <div @click="closeModal()" class="absolute cursor-pointer inset-0 bg-[#313131] opacity-50"></div>
        <div
            class="relative flex flex-col gap-5 w-[600px] max-w-[90vw] bg-white rounded-[40px] transition-opacity shadow-modal p-8"
        >
            <h2 class="text-2xl">Device Settings</h2>

            <p class="opacity-60">Set the interval between measurements (in milliseconds).</p>

            <p class="text-sm opacity-60">The device will receive the new settings within two minutes.</p>

            <form @submit.prevent="updateDeviceSettings()" class="flex flex-col gap-5">
                <div class="flex flex-col gap-1">
                    <!-- <h3 class="font-bold">Interval</h3> -->

                    <div class="relative">
                        <label
                            for="minTemperature"
                            class="bg-primary absolute top-2 left-2 bottom-2 rounded-xl flex justify-center items-center px-4 text-white"
                            >Interval</label
                        >
                        <input
                            type="number"
                            v-model="interval"
                            name="interval"
                            id="interval"
                            min="1000"
                            class="!pl-26 !pr-12"
                        />
                        <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">ms</span>
                    </div>
                </div>

                <button class="btn btn--primary">Save</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    topicId: {
        type: String,
        required: true,
    },
    interval: {
        type: Number,
        default: null,
    },
});

const interval = ref(props.interval);

const updateDeviceSettings = async () => {
    let body = { interval: interval.value };

    // send settings to web server
    const res = await fetch("https://trusense-web-server.onrender.com/device-settings/" + props.topicId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (res.ok) {
        // update database
        await $fetch("/api/sensors/" + props.id, {
            method: "PATCH",
            body: body,
        });
        closeModal();
    }
};

const closeModal = () => {
    const modal = document.querySelector(".settings-modal");

    if (modal) {
        modal.classList.remove("is-active");
        modal.dataset.type = "";

        document.body.style.overflow = "auto";
    }
};

onMounted(async () => {});

onUnmounted(() => {
    closeModal();
});
</script>
