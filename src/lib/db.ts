import { getRequestContext } from "@cloudflare/next-on-pages";

export const getDB = async () => {
    if (process.env.NODE_ENV === "development") {
        // In local dev (npm run dev), we might not have D1 access easily without 'wrangler pages dev'
        // So we'll return null and fallback to mock data in the data layer
        // OR we can try to use the binding if setupDevPlatform works correctly
        try {
            const ctx = getRequestContext();
            return ctx.env.DB;
        } catch (e) {
            return null;
        }
    }
    const ctx = getRequestContext();
    return ctx.env.DB;
};
