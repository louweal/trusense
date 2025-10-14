<template>
    <div
        class="modal alert-modal fixed inset-0 w-full h-full top-0 left-0 right-0 bottom-0 invisible opacity-0 flex justify-center items-center backdrop-blur-sm transition-opacity duration-300 ease-in-out z-20"
        :id="measurement ? measurement : 'help'"
    >
        <div @click="closeModal()" class="absolute cursor-pointer inset-0 bg-[#313131] opacity-50"></div>
        <div
            class="relative flex flex-col justify-center items-center gap-5 w-[600px] max-w-[90vw] bg-white rounded-[40px] transition-opacity shadow-modal p-8"
        >
            <h2 class="text-2xl">Alert</h2>

            <p>Send an email notification when the value exceeds the threshold(s).</p>

            <form class="grid md:grid-cols-2 gap-5">
                <div class="relative">
                    <label
                        for="min"
                        class="bg-primary absolute top-2 left-2 bottom-2 rounded-xl flex justify-center items-center px-4 text-white"
                        >Min</label
                    >
                    <input type="number" v-model="min" name="min" id="min" class="!pl-20" />
                </div>
                <div class="relative">
                    <label
                        for="max"
                        class="bg-primary absolute top-2 left-2 bottom-2 rounded-xl flex justify-center items-center px-4 text-white"
                        >Max</label
                    >
                    <input type="number" v-model="max" name="max" id="max" class="!pl-20" />
                </div>

                <div class="btn" @click="sendEmail()">Send email</div>
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
    measurement: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
});

const modalType = ref("");

const min = ref(null);
const max = ref(null);

const closeModal = () => {
    const modal = document.querySelector(".alert-modal#" + props.measurement);

    if (modal) {
        modal.classList.remove("is-active");
        modal.dataset.type = "";

        document.body.style.overflow = "auto";
    }
};

onMounted(async () => {
    // const modal = document.querySelector(".alert-modal");

    // get sensor data from database
    try {
        const sensor = await $fetch("/api/sensors/" + props.id);

        if (sensor) {
            switch (modalType.value) {
                case "temperature":
                    min.value = sensor.minTemp;
                    max.value = sensor.maxTemp;
                    break;
                case "humidity":
                    min.value = sensor.minHum;
                    max.value = sensor.maxHum;
                    break;
                // case "airPressure":
                //     min.value = sensor.minAirPressure;
                //     max.value = sensor.maxAirPressure;
                //     break;
                default:
                    break;
            }
        }
    } catch (error) {
        console.log(error);
    }
});

onUnmounted(() => {
    closeModal();
});

const sendEmail = async () => {
    try {
        const res = await $fetch("/api/send-email", {
            method: "POST",
            body: {
                to: props.email,
                subject: "Test Notification",
                message: "Hello from Nuxt + SendGrid with TypeScript!",
            },
        });

        console.log(res);
    } catch (err) {
        console.error("API error", err);
    }
};
</script>
