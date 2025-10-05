// server/api/links.get.ts
import { PrismaClient } from "@prisma/client";
import { defineEventHandler, getQuery, createError } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    if (!query.subscriberId || typeof query.subscriberId !== "string") {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing or invalid 'subscriberId'",
        });
    }

    const subscriberId = query.subscriberId;

    try {
        const sensors = await prisma.sensor.findMany({
            where: { subscriberId },
            orderBy: { createdAt: "desc" },
            include: {},
        });

        return sensors;
    } catch (e) {
        console.error(e);
        return createError({ statusCode: 400, message: "Sensor query failed" });
    }
});
