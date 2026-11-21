import { betterAuth } from "better-auth"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

import { db, mongoClient } from "@/lib/mongodb"

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: mongoClient,
    // Transactions require a replica set (Atlas, or a local replica set).
    // A plain local `mongod` standalone doesn't support them, so this stays
    // off by default and can be enabled with MONGODB_TRANSACTIONS=true.
    transaction: process.env.MONGODB_TRANSACTIONS === "true",
  }),

  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,

    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
        // This runs on the server for sign-up. A client can never persist
        // anything except the two roles the UI offers.
        transform: {
          input: (value) =>
            value === "technician" ? "technician" : "customer",
        },
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      area: {
        type: "string",
        required: false,
        input: true,
      },
      bio: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      const body = ctx.body as Record<string, unknown> | undefined

      // Roles are chosen once at sign-up. Admins are promoted directly in the
      // database, never through a client-side profile update.
      if (
        ctx.path === "/update-user" &&
        body &&
        typeof body === "object" &&
        "role" in body
      ) {
        throw new APIError("BAD_REQUEST", {
          code: "ROLE_NOT_EDITABLE",
          message: "Your role cannot be changed after sign-up.",
        })
      }
    }),
  },
})
