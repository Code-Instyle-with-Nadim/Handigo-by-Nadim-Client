"use server"

import { revalidatePath } from "next/cache"

import type { ActionResult } from "@/lib/actions/action-result"
import { requireActionUser } from "@/lib/actions/guard"
import { bookingsCollection, toObjectId } from "@/lib/collections"
import type { BookingStatus } from "@/lib/dashboard-types"

function revalidateBookingPaths() {
  revalidatePath("/dashboard/customer")
  revalidatePath("/dashboard/customer/bookings")
  revalidatePath("/dashboard/customer/payments")
  revalidatePath("/dashboard/technician")
  revalidatePath("/dashboard/technician/requests")
  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/admin/bookings")
  revalidatePath("/dashboard/admin/transactions")
}

export async function cancelBooking(bookingId: string): Promise<ActionResult> {
  const guard = await requireActionUser("customer")

  if (!guard.ok) {
    return { ok: false, error: guard.error }
  }

  const id = toObjectId(bookingId)

  if (!id) {
    return { ok: false, error: "That booking could not be found." }
  }

  const result = await bookingsCollection.updateOne(
    {
      _id: id,
      status: "requested",
      $or: [
        { customerId: guard.user.id },
        { customerEmail: guard.user.email },
      ],
    },
    {
      $set: {
        status: "cancelled",
        updatedAt: new Date(),
      },
    }
  )

  if (result.matchedCount === 0) {
    return {
      ok: false,
      error:
        "Only requests that are still waiting for a technician can be cancelled.",
    }
  }

  revalidateBookingPaths()

  return { ok: true, message: "Booking cancelled." }
}

async function moveBookingStatus(
  bookingId: string,
  from: BookingStatus,
  to: BookingStatus,
  successMessage: string
): Promise<ActionResult> {
  const guard = await requireActionUser("technician")

  if (!guard.ok) {
    return { ok: false, error: guard.error }
  }

  const id = toObjectId(bookingId)

  if (!id) {
    return { ok: false, error: "That booking could not be found." }
  }

  const result = await bookingsCollection.updateOne(
    {
      _id: id,
      status: from,
      $or: [
        { technicianEmail: guard.user.email },
        { technicianId: guard.user.id },
      ],
    },
    {
      $set: {
        status: to,
        updatedAt: new Date(),
      },
    }
  )

  if (result.matchedCount === 0) {
    return {
      ok: false,
      error: "This booking is no longer in a state that allows that action.",
    }
  }

  revalidateBookingPaths()

  return { ok: true, message: successMessage }
}

export async function acceptBooking(bookingId: string): Promise<ActionResult> {
  return moveBookingStatus(
    bookingId,
    "requested",
    "accepted",
    "Booking accepted. You can start the work when you arrive."
  )
}

export async function rejectBooking(bookingId: string): Promise<ActionResult> {
  return moveBookingStatus(
    bookingId,
    "requested",
    "rejected",
    "Booking rejected."
  )
}

export async function startBooking(bookingId: string): Promise<ActionResult> {
  return moveBookingStatus(
    bookingId,
    "accepted",
    "in-progress",
    "Work started. The customer can see the job is in progress."
  )
}

export async function completeBooking(
  bookingId: string,
  finalAmount: number
): Promise<ActionResult> {
  const guard = await requireActionUser("technician")

  if (!guard.ok) {
    return { ok: false, error: guard.error }
  }

  const amount = Number(finalAmount)

  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "Final amount must be a positive number." }
  }

  if (amount > 1_000_000) {
    return { ok: false, error: "Final amount looks too large." }
  }

  const id = toObjectId(bookingId)

  if (!id) {
    return { ok: false, error: "That booking could not be found." }
  }

  const result = await bookingsCollection.updateOne(
    {
      _id: id,
      status: "in-progress",
      $or: [
        { technicianEmail: guard.user.email },
        { technicianId: guard.user.id },
      ],
    },
    {
      $set: {
        status: "completed",
        finalAmount: Math.round(amount * 100) / 100,
        updatedAt: new Date(),
      },
    }
  )

  if (result.matchedCount === 0) {
    return {
      ok: false,
      error: "Only jobs that are in progress can be marked as completed.",
    }
  }

  revalidateBookingPaths()

  return {
    ok: true,
    message: "Job completed. The customer can now pay the final amount.",
  }
}
