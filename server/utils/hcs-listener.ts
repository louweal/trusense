// server/utils/hcs-listener.ts
import { Client, TopicMessageQuery } from "@hashgraph/sdk";

let isListening = false;
let subscribers: ((msg: string) => void)[] = [];
let subscriptionHandle: { unsubscribe: () => void } | null = null;

export function onHcsMessage(callback: (msg: string) => void) {
    subscribers.push(callback);
}

export async function startHcsListener(topicId: string) {
    if (isListening) return;
    isListening = true;

    let client = Client.forTestnet();
    if (process.env.HEDERA_NETWORK === "mainnet") {
        client = Client.forMainnet();
    }

    console.log("[HCS] Starting listener for ", topicId);

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
