import jwt from "jsonwebtoken";
import { defineEventHandler, getCookie, getRequestURL, sendRedirect } from "h3";
// import { createError } from "@h3/create-error";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default defineEventHandler(async (event) => {
    // console.log("auth.js running");
    const url = getRequestURL(event).pathname;
    const method = event.method;

    const publicRoutes = [
        { path: "/", method: "ANY" },
        { path: "/login", method: "ANY" },
        { path: "/register", method: "ANY" },
        { pathPrefix: "/topic/", method: "ANY" },
        { pathPrefix: "/api/hcs", method: "ANY" },
        { pathPrefix: "/api/auth", method: "ANY" },
        { pathPrefix: "/api/users", method: "ANY" },
        { pathPrefix: "/api/sensors", method: "GET" },
        { pathPrefix: "/api/send-email", method: "POST" },
    ];

    const isPublic = publicRoutes.some(({ path, pathPrefix }) => {
        const matchPath = (path && url === path) || (pathPrefix && url.startsWith(pathPrefix));
        return matchPath;
    });

    if (isPublic) return;

    const token = getCookie(event, "auth_token");
    if (!token) {
        return sendRedirect(event, "/login", 302);
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        event.context.user = decoded;
    } catch (err) {
        // throw createError({ statusCode: 401, message: "Invalid or expired token" });
    }
});
