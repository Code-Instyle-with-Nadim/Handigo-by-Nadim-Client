"use server"

import { revalidatePath } from "next/cache"

import { requireActionUser } from "@/lib/actions/guard"
import type { ActionResult } from "@/lib/actions/action-result"
import {
  servicesCollection,
  toObjectId,
  type ServiceDoc,
} from "@/lib/collections"
import type { ServiceMode } from "@/lib/dashboard-types"
import { SERVICE_CATEGORIES } from "@/lib/site-data"

export type ServiceInput = {
  title: string
  category: string
  description: string
  basePrice: number
  duration: string
  serviceMode: ServiceMode
  serviceArea: string
  image: string
}

type NormalizedServiceInput = {
  title: string
  category: string
  description: string
  basePrice: number
  duration: string
  serviceMode: ServiceMode
  serviceArea: string
  image: string
}

function normalizeServiceInput(
  input: ServiceInput
):
  | { ok: true; value: NormalizedServiceInput }
  | { ok: false; error: string } {
  const title = input.title?.trim() ?? ""
  const category = input.category?.trim() ?? ""
  const description = input.description?.trim() ?? ""
  const duration = input.duration?.trim() ?? ""
  const serviceArea = input.serviceArea?.trim() ?? ""
  const image = input.image?.trim() ?? ""
  const basePrice = Number(input.basePrice)
  const serviceMode = input.serviceMode

  if (title.length < 3) {
    return { ok: false, error: "Service title must be at least 3 characters." }
  }

  if (!SERVICE_CATEGORIES.some((item) => item.name === category)) {
    return { ok: false, error: "Please choose a valid service category." }
  }

  if (description.length < 10) {
    return { ok: false, error: "Description must be at least 10 characters." }
  }

  if (!Number.isFinite(basePrice) || basePrice <= 0) {
    return { ok: false, error: "Base price must be a positive number." }
  }

  if (basePrice > 1_000_000) {
    return { ok: false, error: "Base price looks too large. Please check the amount." }
  }

  if (!duration) {
    return { ok: false, error: "Estimated duration is required." }
  }

  if (serviceMode !== "home-visit" && serviceMode !== "shop-drop-off") {
    return { ok: false, error: "Please choose a service mode." }
  }

  if (!serviceArea) {
    return { ok: false, error: "Service area is required." }
  }

  if (!/^https?:\/\/.+/i.test(image)) {
    return { ok: false, error: "Please upload a service image." }
  }

  return {
    ok: true,
    value: {
      title,
      category,
      description,
      basePrice: Math.round(basePrice * 100) / 100,
      duration,
      serviceMode,
      serviceArea,
      image,
    },
  }
}

function revalidateServicePaths() {
  revalidatePath("/services")
  revalidatePath("/dashboard/technician")
  revalidatePath("/dashboard/technician/my-services")
  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/admin/services")
}

export async function createService(
  input: ServiceInput
): Promise<ActionResult<{ id: string }>> {
  const guard = await requireActionUser("technician")

  if (!guard.ok) {
    return { ok: false, error: guard.error }
  }

  const normalized = normalizeServiceInput(input)

  if (!normalized.ok) {
    return { ok: false, error: normalized.error }
  }

  const now = new Date()
  const doc: Omit<ServiceDoc, "_id"> = {
    ...normalized.value,
    technicianId: guard.user.id,
    technicianName: guard.user.name || guard.user.email,
    technicianEmail: guard.user.email,
    approvalStatus: "pending",
    isAvailable: true,
    createdAt: now,
    updatedAt: now,
  }

  const result = await servicesCollection.insertOne(doc as ServiceDoc)

  revalidateServicePaths()

  return {
    ok: true,
    message:
      "Service submitted successfully. It is waiting for admin approval.",
    data: { id: result.insertedId.toString() },
  }
}

export async function updateService(
  serviceId: string,
  input: ServiceInput
): Promise<ActionResult> {
  const guard = await requireActionUser("technician")

  if (!guard.ok) {
    return { ok: false, error: guard.error }
  }

  const id = toObjectId(serviceId)

  if (!id) {
    return { ok: false, error: "That service could not be found." }
  }

  const normalized = normalizeServiceInput(input)

  if (!normalized.ok) {
    return { ok: false, error: normalized.error }
  }

  const result = await servicesCollection.updateOne(
    {
      _id: id,
      $or: [
        { technicianId: guard.user.id },
        { technicianEmail: guard.user.email },
      ],
    },
    {
      $set: {
        ...normalized.value,
        approvalStatus: "pending",
        updatedAt: new Date(),
      },
    }
  )

  if (result.matchedCount === 0) {
    return { ok: false, error: "That service could not be found." }
  }

  revalidateServicePaths()

  return {
    ok: true,
    message:
      "Service updated. It has been sent back to the admin queue for approval.",
  }
}

export async function deleteService(serviceId: string): Promise<ActionResult> {
  const guard = await requireActionUser("technician")

  if (!guard.ok) {
    return { ok: false, error: guard.error }
  }

  const id = toObjectId(serviceId)

  if (!id) {
    return { ok: false, error: "That service could not be found." }
  }

  const result = await servicesCollection.deleteOne({
    _id: id,
    $or: [
      { technicianId: guard.user.id },
      { technicianEmail: guard.user.email },
    ],
  })

  if (result.deletedCount === 0) {
    return { ok: false, error: "That service could not be found." }
  }

  revalidateServicePaths()

  return { ok: true, message: "Service deleted." }
}

export async function toggleServiceAvailability(
  serviceId: string,
  isAvailable: boolean
): Promise<ActionResult> {
  const guard = await requireActionUser("technician")

  if (!guard.ok) {
    return { ok: false, error: guard.error }
  }

  const id = toObjectId(serviceId)

  if (!id) {
    return { ok: false, error: "That service could not be found." }
  }

  const result = await servicesCollection.updateOne(
    {
      _id: id,
      $or: [
        { technicianId: guard.user.id },
        { technicianEmail: guard.user.email },
      ],
    },
    {
      $set: {
        isAvailable: Boolean(isAvailable),
        updatedAt: new Date(),
      },
    }
  )

  if (result.matchedCount === 0) {
    return { ok: false, error: "That service could not be found." }
  }

  revalidateServicePaths()

  return {
    ok: true,
    message: isAvailable
      ? "Service is now available to customers."
      : "Service hidden. It no longer appears on public pages.",
  }
}

export async function setServiceApproval(
  serviceId: string,
  approvalStatus: "approved" | "rejected"
): Promise<ActionResult> {
  const guard = await requireActionUser("admin")

  if (!guard.ok) {
    return { ok: false, error: guard.error }
  }

  if (approvalStatus !== "approved" && approvalStatus !== "rejected") {
    return { ok: false, error: "Please choose a valid approval status." }
  }

  const id = toObjectId(serviceId)

  if (!id) {
    return { ok: false, error: "That service could not be found." }
  }

  const result = await servicesCollection.updateOne(
    { _id: id },
    {
      $set: {
        approvalStatus,
        updatedAt: new Date(),
      },
    }
  )

  if (result.matchedCount === 0) {
    return { ok: false, error: "That service could not be found." }
  }

  revalidateServicePaths()

  return {
    ok: true,
    message:
      approvalStatus === "approved"
        ? "Service approved and published."
        : "Service rejected. The technician can edit and resubmit it.",
  }
}
