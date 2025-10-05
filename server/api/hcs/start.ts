// server/api/hcs/start.ts
import { startHcsListener } from "../../utils/hcs-listener";
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
    await startHcsListener();
    return { status: "listening" };
});
