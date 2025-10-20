<template>
    <header class="xxx">
        <!-- <div class="container"> -->
        <div class="bg-box rounded-[40px] p-8 flex flex-col gap-4">
            <div class="flex w-full justify-between items-center">
                <h1 class="text-2xl font-medium">{{ name }}</h1>
                <div class="cursor-pointer flex-shrink-0" @click="openQRModal()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none">
                        <path
                            fill="#000"
                            d="M18.072 0a3.94 3.94 0 0 0-3.929 3.928c0 .352.051.692.14 1.017L7.012 8.58a3.924 3.924 0 0 0-3.085-1.508A3.94 3.94 0 0 0 0 11a3.94 3.94 0 0 0 3.928 3.928 3.926 3.926 0 0 0 3.085-1.507l7.27 3.634a3.906 3.906 0 0 0-.14 1.017A3.94 3.94 0 0 0 18.072 22 3.94 3.94 0 0 0 22 18.072a3.94 3.94 0 0 0-3.928-3.929c-1.25 0-2.364.593-3.085 1.509l-7.27-3.635c.089-.325.14-.665.14-1.017 0-.352-.051-.69-.14-1.016l7.27-3.635a3.925 3.925 0 0 0 3.085 1.508A3.94 3.94 0 0 0 22 3.928 3.94 3.94 0 0 0 18.072 0Zm0 1.572a2.346 2.346 0 0 1 2.357 2.357 2.346 2.346 0 0 1-2.357 2.358 2.346 2.346 0 0 1-2.358-2.358 2.346 2.346 0 0 1 2.358-2.357ZM3.928 8.642A2.346 2.346 0 0 1 6.286 11a2.346 2.346 0 0 1-2.358 2.357A2.346 2.346 0 0 1 1.571 11a2.346 2.346 0 0 1 2.357-2.357Zm14.144 7.072a2.346 2.346 0 0 1 2.357 2.358 2.346 2.346 0 0 1-2.357 2.357 2.346 2.346 0 0 1-2.358-2.357 2.346 2.346 0 0 1 2.358-2.358Z"
                        />
                    </svg>
                </div>
            </div>

            <div>
                <p>
                    <strong>Topic ID: </strong
                    ><a
                        :href="`https://hashscan.io/${config.public.hederaNetwork}/topic/${topicId}/messages`"
                        target="_blank"
                        >{{ topicId }}</a
                    >
                </p>
                <p>
                    <strong>Measurement Interval: </strong> {{ interval }} ms
                    <!-- <button class="bg-accent text-primary cursor-pointer px-2 rounded-2xl">edit</button> -->
                </p>
                <p><strong>First message:</strong> {{ firstMessageDate }}</p>
            </div>
        </div>
        <!-- </div> -->
        <ModalQR />
    </header>
</template>

<script setup>
import { onMounted } from "vue";
import { HederaService } from "~/lib/hedera";

const hederaService = new HederaService();
const config = useRuntimeConfig();

const firstMessageDate = ref(null);

// props
const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: "",
    },
    topicId: {
        type: String,
        required: true,
    },
    interval: {
        type: Number,
        required: true,
    },
});

onMounted(async () => {
    const firstMessage = await hederaService.getFirstMessage(props.topicId);

    if (firstMessage && firstMessage.timestamp) {
        firstMessageDate.value = new Date(firstMessage.timestamp);
        // make date human readable
        firstMessageDate.value = firstMessageDate.value.toLocaleString();
    } else {
        firstMessageDate.value = "No messages found";
    }
});

// const onUrlChange = (newUrl) => {
//     pageUrl.value = newUrl;
// };

const openQRModal = () => {
    const qrCode = document.querySelector(".qr-modal");
    if (qrCode) {
        qrCode.classList.add("is-active");

        // disable scroll on body
        document.body.style.overflow = "hidden";
    }
};
</script>
