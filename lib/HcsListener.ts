// /utils/HcsListener.ts
export interface MeasurementData {
    timestamp?: string;
    temperature?: number;
    humidity?: number;
    airPressure?: number;
}

export class HcsListener {
    private es: EventSource | null = null;

    constructor(private topicId: string, private onUpdate: (data: MeasurementData) => void) {}

    async start() {
        // Start backend listener for this topic
        await $fetch("/api/hcs/start", { params: { topicId: this.topicId } });

        // Open the EventSource connection
        this.es = new EventSource("/api/hcs/stream");

        this.es.onmessage = (event) => {
            try {
                const data: MeasurementData = JSON.parse(event.data);
                this.onUpdate(data);
            } catch (err) {
                console.error("Invalid message from stream:", err);
            }
        };

        this.es.onerror = (err) => {
            console.error("EventSource error:", err);
            this.stop();
        };
    }

    async stop() {
        if (this.es) {
            this.es.close();
            await $fetch("/api/hcs/stop");
            this.es = null;
            // console.log("HCS listener stopped for topic", this.topicId, ".");
        }
    }
}
