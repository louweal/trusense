// server/api/index.post.ts
import { z } from "zod";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { H3Event, sendError, createError } from "h3";
import { defineEventHandler, readBody } from "h3";

const prisma = new PrismaClient();

const UserInput = z.object({
    username: z.string().min(3, "Username must be 3+ chars"),
    password: z.string().min(8, "Password must be 8+ chars"),
});

export default defineEventHandler(async (event) => {
    // register a new user
    try {
        const body = await readBody(event);
        const { username, password } = UserInput.parse(body);

        const hash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { username: username, password: hash },
        });

        // add the dummy sensor (development only)
        // const sensor = await prisma.sensor.create({
        //     data: {
        //         topicId: "0.0.7001056",
        //         name: "TruSense ESP32-001",
        //         interval: 30000,
        //         subscriberId: user.id,
        //     },
        // });

        const { password: _omit, ...safeUser } = user;

        return safeUser;
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            // Validation error
            throw createError({ statusCode: 400, statusMessage: err.issues[0].message });
        }
        if (err.code === "P2002") {
            // Prisma unique‑constraint error
            throw createError({ statusCode: 409, statusMessage: "Username already in use" });
        }
        sendError(event, err);
    }
});
