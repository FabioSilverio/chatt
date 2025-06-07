        import { defineAuthConfig, defineOAuthProvider } from "convex/server";

        export default defineAuthConfig({
          providers: [
            defineOAuthProvider({
              provider: "google",
              clientId: process.env.GOOGLE_CLIENT_ID!,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            }),
          ],
        });
