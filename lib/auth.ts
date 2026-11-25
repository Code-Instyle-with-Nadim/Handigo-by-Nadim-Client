import { betterAuth } from "better-auth"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

import { db, mongoClient } from "@/lib/mongodb"

const PASSWORD_REQUIREMENTS =
  "Password must be at least 6 characters and include at least one uppercase and one lowercase letter."

const baseURL =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ??
  "http://localhost:3000"

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, {
    client: mongoClient,
    // Transactions require a replica set (Atlas, or a local replica set).
    // A standalone `mongod` does not support them, so this stays opt-in.
    transaction: process.env.MONGODB_TRANSACTIONS === "true",
  }),

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
        // Runs on the server for both sign-up and update-user. Anything other
        // than the two self-service roles is stored as "customer", so a
        // client can never grant itself the admin role.
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

      // Mirror the client-side password rules on the server, so the API can
      // only ever store passwords that satisfy the same requirements.
      if (
        ctx.path === "/sign-up/email" &&
        typeof body?.password === "string"
      ) {
        const password = body.password

        if (
          password.length < 6 ||
          !/[A-Z]/.test(password) ||
          !/[a-z]/.test(password)
        ) {
          throw new APIError("BAD_REQUEST", {
            code: "INVALID_PASSWORD",
            message: PASSWORD_REQUIREMENTS,
          })
        }
      }

      // Roles are chosen once at sign-up. Admins are promoted directly in the
      // database, never through a client-side profile update.
      if (
        ctx.path === "/update-user" &&
        body &&
        Object.prototype.hasOwnProperty.call(body, "role")
      ) {
        throw new APIError("BAD_REQUEST", {
          code: "ROLE_NOT_EDITABLE",
          message: "Your role cannot be changed after sign-up.",
        })
      }
    }),
  },
})
