// server/api/hcs/start.ts
import { startHcsListener } from "../../utils/hcs-listener";
import { defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
    const { topicId } = getQuery(event);

    await startHcsListener(String(topicId));
    return { status: "listening" };
});
