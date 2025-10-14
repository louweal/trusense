// server/api/links.get.ts
import { PrismaClient } from "@prisma/client";
import { defineEventHandler } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
    const latestSensor = await prisma.sensor.findFirst({
        orderBy: { createdAt: "desc" },
    });

    return latestSensor;
});
