<template>
    <div
        class="modal alert-modal fixed inset-0 w-full h-full top-0 left-0 right-0 bottom-0 invisible opacity-0 flex justify-center items-center backdrop-blur-sm transition-opacity duration-300 ease-in-out z-20"
    >
        <div @click="closeModal()" class="absolute cursor-pointer inset-0 bg-[#313131] opacity-50"></div>
        <div
            class="relative flex flex-col gap-5 w-[600px] max-w-[90vw] bg-white rounded-[40px] transition-opacity shadow-modal p-8"
        >
            <div class="absolute top-7 right-7 cursor-pointer" @click="closeModal()">
                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="none">
                    <path
                        fill="#072847"
                        d="M25.22 23.602A1.144 1.144 0 1 1 23.6 25.22L.81 2.427A1.144 1.144 0 1 1 2.427.81L25.22 23.602Z"
                    />
                    <path
                        fill="#072847"
                        d="M23.694.81a1.144 1.144 0 0 1 1.618 1.617L2.52 25.22a1.144 1.144 0 1 1-1.618-1.618L23.694.809Z"
                    />
                </svg>
            </div>
            <h2 class="text-2xl">Alert Settings</h2>
            <p class="opacity-60">
                An email notification will be sent when a measurement exceeds the threshold(s) defined below. You will
                not receive more than one notification every 4 hours.
            </p>

            <form
                @submit.prevent="updateAlerts()"
                class="flex flex-col gap-5"
                :class="{ 'opacity-50 pointer-events-none': showConfirmation }"
            >
                <div class="flex flex-col gap-1">
                    <h3 class="font-bold">Email</h3>
                    <input type="email" v-model="email" name="email" id="email" placeholder="Enter your email" />
                </div>

                <div class="flex flex-col gap-1">
                    <h3 class="font-bold">Temperature</h3>

                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="relative">
                            <label
                                for="minTemperature"
                                class="bg-primary absolute top-2 left-2 bottom-2 rounded-xl flex justify-center items-center px-4 text-white"
                                >Min</label
                            >
                            <input
                                type="number"
                                v-model="minTemperature"
                                name="minTemperature"
                                id="minTemperature"
                                placeholder="Unset"
                                class="!pl-20 !pr-8"
                                min="-40"
                                max="85"
                            />
                            <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">°C</span>
                        </div>
                        <div class="relative">
                            <label
                                for="maxTemperature"
                                class="bg-primary absolute top-2 left-2 bottom-2 rounded-xl flex justify-center items-center px-4 text-white"
                                >Max</label
                            >
                            <input
                                type="number"
                                v-model="maxTemperature"
                                name="maxTemperature"
                                id="maxTemperature"
                                class="!pl-22 !pr-8"
                                min="-40"
                                max="85"
                                placeholder="Unset"
                            />
                            <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">°C</span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <h3 class="font-bold">Humidity</h3>

                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="relative">
                            <label
                                for="minHumidity"
                                class="bg-primary absolute top-2 left-2 bottom-2 rounded-xl flex justify-center items-center px-4 text-white"
                                >Min</label
                            >
                            <input
                                type="number"
                                v-model="minHumidity"
                                name="minHumidity"
                                id="minHumidity"
                                placeholder="Unset"
                                class="!pl-20 !pr-8"
                                min="0"
                                max="100"
                            />
                            <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">%</span>
                        </div>
                        <div class="relative">
                            <label
                                for="maxHumidity"
                                class="bg-primary absolute top-2 left-2 bottom-2 rounded-xl flex justify-center items-center px-4 text-white"
                                >Max</label
                            >
                            <input
                                type="number"
                                v-model="maxHumidity"
                                name="maxHumidity"
                                id="maxHumidity"
                                class="!pl-22 !pr-8"
                                min="0"
                                max="100"
                                placeholder="Unset"
                            />
                            <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">%</span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <h3 class="font-bold">Air Pressure</h3>

                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="relative">
                            <label
                                for="minAirPressure"
                                class="bg-primary absolute top-2 left-2 bottom-2 rounded-xl flex justify-center items-center px-4 text-white"
                                >Min</label
                            >
                            <input
                                type="number"
                                v-model="minAirPressure"
                                name="minAirPressure"
                                id="minAirPressure"
                                placeholder="Unset"
                                class="!pl-20 !pr-12"
                            />
                            <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">hPa</span>
                        </div>
                        <div class="relative">
                            <label
                                for="maxAirPressure"
                                class="bg-primary absolute top-2 left-2 bottom-2 rounded-xl flex justify-center items-center px-4 text-white"
                                >Max</label
                            >
                            <input
                                type="number"
                                v-model="maxAirPressure"
                                name="maxAirPressure"
                                id="maxAirPressure"
                                placeholder="Unset"
                                class="!pl-22 !pr-12"
                            />
                            <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">hPa</span>
                        </div>
                    </div>
                </div>

                <button class="btn btn--primary" :class="{ 'opacity-50 pointer-events-none': !email }">Save</button>
            </form>
            <p class="text-center text-green-600" v-if="showConfirmation">Settings saved successfully!</p>
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
    minTemp: {
        type: Number,
        default: null,
    },
    maxTemp: {
        type: Number,
        default: null,
    },

    minHum: {
        type: Number,
        default: null,
    },
    maxHum: {
        type: Number,
        default: null,
    },
    minPres: {
        type: Number,
        default: null,
    },
    maxPres: {
        type: Number,
        default: null,
    },
    userId: {
        type: String,
        required: true,
    },
});
const showConfirmation = ref(false);
const minTemperature = ref(props.minTemp);
const maxTemperature = ref(props.maxTemp);
const minHumidity = ref(props.minHum);
const maxHumidity = ref(props.maxHum);
const minAirPressure = ref(props.minPres);
const maxAirPressure = ref(props.maxPres);
const email = ref(null);

const updateAlerts = async () => {
    let body = {};

    if (minTemperature.value != props.minTemp) {
        body["minTemp"] = minTemperature.value;
    }

    if (maxTemperature.value != props.maxTemp) {
        body["maxTemp"] = maxTemperature.value;
    }

    if (minHumidity.value != props.minHum) {
        body["minHum"] = minHumidity.value;
    }

    if (maxHumidity.value != props.maxHum) {
        body["maxHum"] = maxHumidity.value;
    }

    if (minAirPressure.value != props.minPres) {
        body["minPres"] = minAirPressure.value;
    }

    if (maxAirPressure.value != props.maxPres) {
        body["maxPres"] = maxAirPressure.value;
    }

    if (body == {}) return;

    body["email"] = email.value;

    // send settings to web server
    try {
        const res = await fetch(
            "https://trusense-web-server.onrender.com/settings/" + props.topicId + "/" + props.userId,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...body, subscriberId: props.userId }),
            },
        );

        if (res.ok) {
            // update database
            await $fetch("/api/sensors/" + props.id, {
                method: "PATCH",
                body: body,
            });

            showConfirmation.value = true;

            setTimeout(() => {
                showConfirmation.value = false;
                closeModal();
            }, 2000);
        }
    } catch (error) {
        console.log(error);
    }
};

const closeModal = () => {
    const modal = document.querySelector(".alert-modal");

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
