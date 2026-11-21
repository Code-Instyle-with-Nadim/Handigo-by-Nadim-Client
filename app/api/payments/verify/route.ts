import { revalidatePath } from "next/cache"

import {
  bookingsCollection,
  paymentsCollection,
  toObjectId,
} from "@/lib/collections"
import { getStripeTransactionId, retrieveCheckoutSession } from "@/lib/stripe"
import { normalizeRole } from "@/lib/roles"
import { getServerSession } from "@/lib/session"

function redirectTo(request: Request, path: string) {
  return Response.redirect(new URL(path, request.url), 303)
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const sessionId = url.searchParams.get("session_id")

  if (!sessionId) {
    return redirectTo(request, "/dashboard/customer/bookings?payment=failed")
  }

  const session = await getServerSession()

  if (!session?.user || normalizeRole(session.user.role) !== "customer") {
    return redirectTo(
      request,
      `/sign-in?redirect=${encodeURIComponent("/dashboard/customer/bookings")}`
    )
  }

  try {
    const checkout = await retrieveCheckoutSession(sessionId)

    if (checkout.payment_status !== "paid") {
      return redirectTo(request, "/dashboard/customer/bookings?payment=cancelled")
    }

    const bookingId =
      checkout.metadata?.bookingId || checkout.client_reference_id || ""
    const id = toObjectId(bookingId)

    if (!id) {
      return redirectTo(request, "/dashboard/customer/bookings?payment=failed")
    }

    const booking = await bookingsCollection.findOne({
      _id: id,
      $or: [
        { customerId: session.user.id },
        { customerEmail: session.user.email },
      ],
    })

    if (!booking || booking.status !== "completed") {
      return redirectTo(request, "/dashboard/customer/bookings?payment=failed")
    }

    const expectedAmount =
      typeof booking.finalAmount === "number" && booking.finalAmount > 0
        ? booking.finalAmount
        : booking.basePrice
    const paidAmount = (checkout.amount_total ?? 0) / 100

    if (Math.abs(paidAmount - expectedAmount) > 0.01) {
      console.error("Stripe amount mismatch for booking", bookingId, {
        expectedAmount,
        paidAmount,
      })

      return redirectTo(request, "/dashboard/customer/bookings?payment=failed")
    }

    const paidAt = new Date()

    await paymentsCollection.updateOne(
      { bookingId: booking._id.toString() },
      {
        $setOnInsert: {
          bookingId: booking._id.toString(),
          customerId: booking.customerId,
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          technicianId: booking.technicianId,
          technicianName: booking.technicianName,
          technicianEmail: booking.technicianEmail,
          serviceId: booking.serviceId,
          serviceTitle: booking.serviceTitle,
          amount: expectedAmount,
          transactionId: getStripeTransactionId(checkout),
          stripeSessionId: checkout.id,
          paidAt,
          createdAt: paidAt,
        },
      },
      { upsert: true }
    )

    await bookingsCollection.updateOne(
      { _id: booking._id },
      {
        $set: {
          paymentStatus: "paid",
          updatedAt: paidAt,
        },
      }
    )

    revalidatePath("/dashboard/customer")
    revalidatePath("/dashboard/customer/bookings")
    revalidatePath("/dashboard/customer/payments")
    revalidatePath("/dashboard/admin")
    revalidatePath("/dashboard/admin/bookings")
    revalidatePath("/dashboard/admin/transactions")

    return redirectTo(request, "/dashboard/customer/bookings?payment=success")
  } catch (error) {
    console.error("Unable to verify Stripe checkout session", error)

    return redirectTo(request, "/dashboard/customer/bookings?payment=failed")
  }
}
