"use server"

import type { ActionResult } from "@/lib/actions/action-result"
import { requireActionUser } from "@/lib/actions/guard"
import { bookingsCollection, toObjectId } from "@/lib/collections"
import { createBookingCheckoutSession } from "@/lib/stripe"

export async function startBookingPayment(
  bookingId: string
): Promise<ActionResult<{ url: string }>> {
  const guard = await requireActionUser("customer")

  if (!guard.ok) {
    return { ok: false, error: guard.error }
  }

  const id = toObjectId(bookingId)

  if (!id) {
    return { ok: false, error: "That booking could not be found." }
  }

  const booking = await bookingsCollection.findOne({
    _id: id,
    $or: [
      { customerId: guard.user.id },
      { customerEmail: guard.user.email },
    ],
  })

  if (!booking) {
    return { ok: false, error: "That booking could not be found." }
  }

  if (booking.status !== "completed") {
    return {
      ok: false,
      error: "Payment becomes available once the technician completes the job.",
    }
  }

  if (booking.paymentStatus === "paid") {
    return { ok: false, error: "This booking has already been paid." }
  }

  const amount =
    typeof booking.finalAmount === "number" && booking.finalAmount > 0
      ? booking.finalAmount
      : booking.basePrice

  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "This booking has no payable amount." }
  }

  try {
    const checkout = await createBookingCheckoutSession({
      bookingId: booking._id.toString(),
      customerId: guard.user.id,
      customerEmail: guard.user.email,
      serviceTitle: booking.serviceTitle || "HandiGo! service",
      amount,
    })

    if (!checkout.url) {
      return {
        ok: false,
        error: "Stripe did not return a checkout link. Please try again.",
      }
    }

    return {
      ok: true,
      message: "Redirecting to Stripe Checkout…",
      data: { url: checkout.url },
    }
  } catch (error) {
    console.error("Unable to create Stripe checkout session", error)

    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to start payment. Please try again.",
    }
  }
}
