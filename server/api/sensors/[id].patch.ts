import { PrismaClient } from "@prisma/client";
import { createError } from "h3";
import { defineEventHandler, readBody } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { id } = event.context.params ?? {};
    const body = await readBody(event);

    console.log("body :>> ", body);

    try {
        const sensor = await prisma.sensor.update({
            where: { id },
            data: body,
        });
        return sensor;
    } catch (e) {
        return createError({ statusCode: 400, message: "Sensor update failed" });
    }
});
