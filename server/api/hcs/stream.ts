// server/api/hcs/stream.ts
import { onHcsMessage } from "../../utils/hcs-listener";
import { defineEventHandler, setResponseHeader } from "h3";

export default defineEventHandler((event) => {
    const stream = new ReadableStream({
        start(controller) {
            const listener = (msg: string) => {
                controller.enqueue(`data: ${msg}\n\n`);
            };
            onHcsMessage(listener);
        },
    });

    setResponseHeader(event, "Content-Type", "text/event-stream");
    return stream;
});
