import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

try {
    prisma = globalThis.prisma || new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
} catch (error) {
    console.error("❌ Critical: Failed to initialize Prisma Client", error);
    prisma = new Proxy({} as PrismaClient, {
        get: () => {
            throw new Error("Database not initialized. Check your DATABASE_URL.");
        }
    });
}

export const db = prisma;

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}
