<template>
    <header class="hero">
        <div class="container">
            <div class="bg-box rounded-[40px] p-8 flex flex-col gap-4">
                <div class="flex w-full justify-between items-center">
                    <h1 class="text-lg font-medium">{{ name }}</h1>
                    <div>...</div>
                </div>

                <div>
                    <p>
                        <strong>Topic ID: </strong
                        ><a href="https://hashscan.io/testnet/topic/{{ topicId }}/messages" target="_blank">{{
                            topicId
                        }}</a>
                    </p>
                    <p><strong>Measurement Interval: </strong> {{ interval / 1000 }} seconds</p>
                    <p><strong>First message:</strong> {{ firstMessageDate }}</p>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { onMounted } from "vue";
import { HederaService } from "~/lib/hedera";

const hederaService = new HederaService();

const firstMessageDate = ref(null);

// props
const props = defineProps({
    name: {
        type: String,
        default: "TSS",
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
    } else {
        firstMessageDate.value = "No messages found";
    }
});
</script>
