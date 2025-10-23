<template>
    <div
        class="modal qr-modal fixed inset-0 w-full h-full top-0 left-0 right-0 bottom-0 invisible opacity-0 flex justify-center items-center backdrop-blur-sm transition-opacity duration-300 ease-in-out z-20"
    >
        <div @click="closeModal()" class="absolute cursor-pointer inset-0 bg-[#313131] opacity-50"></div>
        <div
            class="relative flex items-center flex-col gap-5 w-[600px] max-w-[90vw] bg-white rounded-[40px] transition-opacity shadow-modal p-8"
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
            <h2 class="text-2xl self-start">Share link</h2>

            <QrCode v-if="pageUrl" :value="pageUrl" />
            <a
                v-if="pageUrl"
                :href="pageUrl"
                class="flex flex-grow gap-2 items-center cursor-pointer"
                @click="handleCopyClick"
            >
                {{ copied ? "Copied!" : "Copy link" }} <IconCopy />
            </a>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const pageUrl = ref(null);
const copied = ref(false);

const props = defineProps({
    topicId: {
        type: String,
        required: true,
    },
});

const closeModal = () => {
    const qrModal = document.querySelector(".qr-modal");

    if (qrModal) {
        qrModal.classList.remove("is-active");

        document.body.style.overflow = "auto";
    }
};

onMounted(() => {
    const domain = window.location.origin;
    pageUrl.value = `${domain}/topic/${props.topicId}`;
});

onUnmounted(() => {
    closeModal();
});

function handleCopyClick(event) {
    event.preventDefault();
    copyLink();
}

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(pageUrl.value);
        copied.value = true;

        setTimeout(() => {
            copied.value = false;
        }, 5000);
    } catch (err) {
        console.error("Failed to copy:", err);
    }
};
</script>
