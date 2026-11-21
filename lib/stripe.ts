const STRIPE_API = "https://api.stripe.com/v1"

export type StripeCheckoutSession = {
  id: string
  url: string | null
  status: string | null
  payment_status: string | null
  amount_total: number | null
  currency: string | null
  client_reference_id: string | null
  metadata: Record<string, string> | null
  payment_intent: string | { id: string } | null
  created: number
}

type StripeErrorResponse = {
  error?: {
    message?: string
  }
}

export function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.BETTER_AUTH_URL?.trim() ||
    "http://localhost:3000"
  ).replace(/\/$/, "")
}

function getStripeSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY?.trim()

  if (!key) {
    throw new Error(
      "Stripe is not configured. Add STRIPE_SECRET_KEY to your environment."
    )
  }

  return key
}

async function stripeRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${STRIPE_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getStripeSecretKey()}`,
      ...init.headers,
    },
    cache: "no-store",
  })

  const payload = (await response.json().catch(() => null)) as
    | (T & StripeErrorResponse)
    | null

  if (!response.ok) {
    throw new Error(
      payload?.error?.message ||
        "Stripe could not process this request. Please try again."
    )
  }

  if (!payload) {
    throw new Error("Stripe returned an empty response.")
  }

  return payload
}

export async function createBookingCheckoutSession({
  bookingId,
  customerId,
  customerEmail,
  serviceTitle,
  amount,
}: {
  bookingId: string
  customerId: string
  customerEmail: string
  serviceTitle: string
  amount: number
}) {
  const body = new URLSearchParams()
  const appUrl = getAppUrl()

  body.set("mode", "payment")
  body.set("customer_email", customerEmail)
  body.set("client_reference_id", bookingId)
  body.set("metadata[bookingId]", bookingId)
  body.set("metadata[customerId]", customerId)
  body.set("payment_intent_data[metadata][bookingId]", bookingId)
  body.set("line_items[0][quantity]", "1")
  body.set("line_items[0][price_data][currency]", "usd")
  body.set(
    "line_items[0][price_data][unit_amount]",
    String(Math.round(amount * 100))
  )
  body.set(
    "line_items[0][price_data][product_data][name]",
    serviceTitle.slice(0, 120)
  )
  body.set(
    "success_url",
    `${appUrl}/api/payments/verify?session_id={CHECKOUT_SESSION_ID}`
  )
  body.set("cancel_url", `${appUrl}/dashboard/customer/bookings?payment=cancelled`)

  const encodedBody = body
    .toString()
    .replace(/%7BCHECKOUT_SESSION_ID%7D/gi, "{CHECKOUT_SESSION_ID}")

  return stripeRequest<StripeCheckoutSession>("/checkout/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encodedBody,
  })
}

export async function retrieveCheckoutSession(sessionId: string) {
  return stripeRequest<StripeCheckoutSession>(
    `/checkout/sessions/${encodeURIComponent(sessionId)}`,
    { method: "GET" }
  )
}

export function getStripeTransactionId(session: StripeCheckoutSession) {
  if (typeof session.payment_intent === "string") {
    return session.payment_intent
  }

  if (session.payment_intent && typeof session.payment_intent.id === "string") {
    return session.payment_intent.id
  }

  return session.id
}
