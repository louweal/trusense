<template>
    <div
        class="modal qr-modal fixed inset-0 w-full h-full top-0 left-0 right-0 bottom-0 invisible opacity-0 flex justify-center items-center backdrop-blur-sm transition-opacity duration-300 ease-in-out z-20"
    >
        <div @click="closeModal()" class="absolute cursor-pointer inset-0 bg-[#313131] opacity-50"></div>
        <div
            class="relative flex flex-col justify-center items-center gap-5 w-[600px] max-w-[90vw] bg-white rounded-[40px] transition-opacity shadow-modal p-8"
        >
            <h2 class="text-2xl">Share link</h2>
            <QrCode v-if="pageUrl" :value="pageUrl" xxxchange="onUrlChange" />
            <div>
                <a :href="pageUrl" class="flex flex-grow gap-2 items-center cursor-pointer" @click="handleCopyClick">
                    {{ copied ? "Copied!" : "Copy link" }} <IconCopy />
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const pageUrl = ref(null);
const copied = ref(false);

const closeModal = () => {
    const qrModal = document.querySelector(".qr-modal");

    if (qrModal) {
        qrModal.classList.remove("is-active");

        document.body.style.overflow = "auto";
    }
};

onMounted(() => {
    pageUrl.value = window.location.href;
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
