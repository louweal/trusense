// ~/server/api/auth/me.ts
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { defineEventHandler, getCookie, createError } from "h3";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET as string;

export default defineEventHandler(async (event) => {
    const token = getCookie(event, "auth_token");
    if (!token) {
        throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);

        if (!decoded?.email) return { user: null };

        // Fetch full user from DB
        const user = await prisma.user.findUnique({
            where: { email: decoded.email },
            select: {
                id: true,
                email: true,
            },
        });

        if (!user) return { user: null };

        return { user };
    } catch {
        throw createError({ statusCode: 401, message: "Invalid or expired token" });
    }
});
