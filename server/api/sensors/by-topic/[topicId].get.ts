// server/api/by-topic/[topicId].get.ts
import { PrismaClient } from "@prisma/client";
import { defineEventHandler, createError, getRouterParams } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { topicId } = getRouterParams(event);

    if (!topicId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing topicId parameter",
        });
    }

    const sensor = await prisma.sensor.findFirst({
        where: {
            topicId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    if (!sensor) {
        throw createError({
            statusCode: 404,
            statusMessage: `No sensor found for topicId ${topicId}`,
        });
    }

    return sensor;
});
