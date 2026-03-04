import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/lgpd",
    "/termos",
    "/api/webhook(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
    // Se o modo MOCK estiver ativo e estivermos em desenvolvimento, permitimos acesso total
    const isMock = process.env.MOCK_DATABASE === "true" && process.env.NODE_ENV === "development";

    if (isMock) return;

    if (!isPublicRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
