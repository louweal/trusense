// server/api/links.get.ts
import { PrismaClient } from "@prisma/client";
import { defineEventHandler, getQuery } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const search = query.q?.toString() || "";

    const sensors = await prisma.sensor.findMany({
        where: {
            name: {
                contains: search,
                mode: "insensitive", // case-insensitive search
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 2, // limit
    });

    return sensors;
});
