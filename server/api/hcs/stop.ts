// server/api/hcs/stop.ts
import { stopHcsListener } from "../../utils/hcs-listener";
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
    stopHcsListener();
    return { status: "not listening" };
});
