<template>
    <div
        class="modal settings-modal fixed inset-0 w-full h-full top-0 left-0 right-0 bottom-0 invisible opacity-0 flex justify-center items-center backdrop-blur-sm transition-opacity duration-300 ease-in-out z-20"
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
            <h2 class="text-2xl">Device Settings</h2>

            <p class="opacity-60">
                The current measurement interval for this device is {{ interval }} seconds ({{
                    Math.round((interval / 60) * 100) / 100
                }}
                minutes). Below you can change the interval.
            </p>

            <form
                @submit.prevent="updateDeviceSettings()"
                class="flex flex-col gap-5"
                :class="{ 'opacity-50 pointer-events-none': showConfirmation }"
            >
                <div class="flex flex-col gap-1">
                    <div class="relative">
                        <label
                            for="minTemperature"
                            class="bg-primary absolute top-2 left-2 bottom-2 rounded-xl flex justify-center items-center px-4 text-white"
                            >Interval</label
                        >
                        <input
                            type="number"
                            v-model="intervalRef"
                            name="interval"
                            id="interval"
                            min="1"
                            class="!pl-26 !pr-12"
                        />
                        <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">s</span>
                    </div>
                </div>

                <div class="flex w-full gap-0">
                    <div class="w-1/3 rounded-2xl p-6 bg-accent">
                        <h4 class="text-lg">Testnet</h4>
                        <span class="text-sm opacity-50">Your plan</span>
                        <p class="text-2xl">$0 <span class="text-sm opacity-50">/month</span></p>
                    </div>
                    <div class="w-1/3 rounded-2xl p-6">
                        <h4 class="text-lg">Mainnet</h4>
                        <span class="text-sm opacity-50">Current fees</span>
                        <p class="text-2xl whitespace-nowrap">
                            ${{ feesCurrent }} <span class="text-sm opacity-50">/month</span>
                        </p>
                    </div>
                    <div class="w-1/3 rounded-2xl p-6">
                        <h4 class="text-lg">Mainnet</h4>
                        <span class="text-sm opacity-50">Future fees*</span>
                        <p class="text-2xl whitespace-nowrap">
                            ${{ feesFuture }} <span class="text-sm opacity-50">/month</span>
                        </p>
                    </div>
                </div>

                <button
                    class="btn btn--primary"
                    :class="{ 'pointer-events-none opacity-50': intervalRef === interval || intervalRef == 0 }"
                >
                    Save
                </button>

                <p class="text-sm">
                    <span class="opacity-60"
                        >*Starting January 2026, the price for the ConsensusSubmitMessage transaction on the Hedera
                        Consensus Service will increase from $0.0001 to $0.0008 USD.
                    </span>
                    <a
                        href="https://hedera.com/blog/price-update-to-consensussubmitmessage-in-consensus-service-january-2026"
                        target="_blank"
                        >Read more</a
                    >
                </p>
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
    interval: {
        type: Number,
        default: null,
    },
});
const secondsPerMonth = 30.5 * 24 * 60 * 60;

const showConfirmation = ref(false);
const intervalRef = ref(props.interval);
const feesCurrent = ref(0);
const feesFuture = ref(0);

onMounted(async () => {
    feesCurrent.value = ((0.0001 + 0.0001) * (secondsPerMonth / intervalRef.value)).toFixed(2);
    feesFuture.value = ((0.0008 + 0.0001) * (secondsPerMonth / intervalRef.value)).toFixed(2);
});

watch(intervalRef, (newInterval, oldInterval) => {
    if (newInterval === oldInterval) return;
    intervalRef.value = newInterval;

    if (!newInterval) {
        intervalRef.value = 0;
    }
    if (intervalRef.value != 0) {
        feesCurrent.value = ((0.0001 + 0.0001) * (secondsPerMonth / newInterval)).toFixed(2);
        feesFuture.value = ((0.0008 + 0.0001) * (secondsPerMonth / newInterval)).toFixed(2);
    } else {
        feesCurrent.value = 0;
        feesFuture.value = 0;
    }
});

const updateDeviceSettings = async () => {
    if (intervalRef.value == props.interval) return;

    let body = { interval: intervalRef.value * 1000 };

    // send settings to web server
    try {
        const res = await fetch("https://trusense-web-server.onrender.com/device-settings/" + props.topicId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            try {
                // update database
                await $fetch("/api/sensors/" + props.id, {
                    method: "PATCH",
                    body: body,
                });

                showConfirmation.value = true;

                setTimeout(() => {
                    showConfirmation.value = false;
                    closeModal();

                    // reload page
                    location.reload();
                }, 2000);
            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.log(error);
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
