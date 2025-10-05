// server/api/sensors/[id].ts

import { PrismaClient } from "@prisma/client";
import { defineEventHandler, createError } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { id } = event.context.params ?? {};

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: "Missing ID" });
    }

    const sensor = await prisma.sensor.findUnique({
        where: { id },
    });

    if (!sensor) {
        throw createError({ statusCode: 404, statusMessage: "Sensor not found" });
    }

    return sensor;
});
