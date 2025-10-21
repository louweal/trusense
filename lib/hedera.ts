import { Client } from "@hashgraph/sdk";
import { useRuntimeConfig } from "nuxt/app";

interface MirrorNodeResponse {
    messages: Message[];
    links: string[];
}

interface Message {
    consensus_timestamp: string;
    topic_id: string;
    message: string;
    running_hash: string;
    sequence_number: number;
    chunk_info?: {
        number: number;
        total: number;
        initial_transaction_id: string;
    };
}

interface Measurement {
    // timestamp: number;
    temperature?: number | null;
    humidity?: number | null;
    airPressure?: number | null;
}

export class HederaService {
    private client: Client;
    private network: string;
    private networkUrl: string;
    private inspectorUrl: string;

    constructor() {
        const config = useRuntimeConfig();

        // Initialize client based on network
        if (config.public.hederaNetwork === "mainnet") {
            this.client = Client.forMainnet();
            this.network = "mainnet";
            this.networkUrl = "https://mainnet.mirrornode.hedera.com";
            this.inspectorUrl = "https://hashscan.io/mainnet/topic/";
        } else {
            this.client = Client.forTestnet();
            this.network = "testnet";
            this.networkUrl = "https://testnet.mirrornode.hedera.com";
            this.inspectorUrl = "https://hashscan.io/testnet/topic/";
        }
    }

    async getLastMessage(topicId: string, interval: number): Promise<Measurement> {
        let result: Measurement = { temperature: null, humidity: null, airPressure: null };

        const now = new Date();
        const oneIntervalAgo = new Date(now.getTime() - interval);
        const seconds = Math.floor(oneIntervalAgo.getTime() / 1000);
        const nanoseconds = (oneIntervalAgo.getTime() % 1000) * 1_000_000;
        const hederaTimestamp = `${seconds}.${nanoseconds}`;

        const res = await fetch(
            `${this.networkUrl}/api/v1/topics/${topicId}/messages?timestamp=gte:${hederaTimestamp}`,
        );
        const json: MirrorNodeResponse = await res.json();

        if (json.messages?.length) {
            const msg = json.messages[json.messages.length - 1]; // get last message (last in array)
            const decoded = atob(msg.message);
            const payload = JSON.parse(decoded);

            if (payload.temperature) {
                result["temperature"] = +payload.temperature;
            }

            if (payload.humidity) {
                // console.log("payload.humidity :>> ", payload.humidity);
                result["humidity"] = +payload.humidity;
            }

            if (payload.airPressure) {
                result["airPressure"] = +payload.airPressure;
            }
        } else {
            console.log("No messages found");
        }

        return result;
    }

    async getFirstMessage(topicId: string): Promise<Measurement> {
        const res = await fetch(`${this.networkUrl}/api/v1/topics/${topicId}/messages?limit=1`);
        const json: MirrorNodeResponse = await res.json();

        if (json.messages?.length) {
            const msg = json.messages[0]; // get last message (last in array)
            const decoded = atob(msg.message);
            const payload = JSON.parse(decoded);

            return payload;
        } else {
            console.log("No messages found");
            return { temperature: null, humidity: null, airPressure: null };
        }
    }
}
