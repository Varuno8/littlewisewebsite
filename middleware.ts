import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', /*Excludes _next (Next.js internals) and static file extensions (html, css, js, jpg, etc.).Meaning: It applies middleware only to non-static routes.*/
        // Always run for API routes
        '/(api|trpc)(.*)', //Ensures that all API and tRPC routes pass through the middleware.
    ],
};

/*
How This Works in Next.js
When a user makes a request:
If it's for a static file (like images, styles, scripts), middleware is skipped.
If it's an API request or a page request, middleware runs.
clerkMiddleware() ensures:
Users are authenticated.
Unauthorized users are redirected to the login page.
Custom logic like role-based access control (RBAC) is applied.

Summary
Middleware intercepts requests before they reach your application.
Clerk’s middleware automatically handles authentication.
The config.matcher ensures middleware runs only for API and page requests, not static assets.
This setup secures routes and ensures only authenticated users access protected areas.
*/