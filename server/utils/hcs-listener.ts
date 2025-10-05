// server/utils/hcs-listener.ts
import { Client, TopicMessageQuery } from "@hashgraph/sdk";

let isListening = false;
let subscribers: ((msg: string) => void)[] = [];
let subscriptionHandle: { unsubscribe: () => void } | null = null;

export function onHcsMessage(callback: (msg: string) => void) {
    subscribers.push(callback);
}

export async function startHcsListener() {
    if (isListening) return;
    isListening = true;

    const topicId = process.env.TOPIC_ID || "0.0.1";
    const client = Client.forTestnet();
    client.setOperator(process.env.HEDERA_ACCOUNT_ID!, process.env.HEDERA_PRIVATE_KEY!);

    console.log("[HCS] Starting listener for", topicId);

    subscriptionHandle = new TopicMessageQuery().setTopicId(topicId).subscribe(client, null, (message) => {
        const msgStr = Buffer.from(message.contents).toString();
        console.log("[HCS] New message:", msgStr);
        subscribers.forEach((cb) => cb(msgStr));
    });
}

export function stopHcsListener() {
    if (!isListening) return;
    isListening = false;

    if (subscriptionHandle) {
        console.log("[HCS] Stopping listener...");
        subscriptionHandle.unsubscribe();
        subscriptionHandle = null;
    }

    subscribers = [];
}
