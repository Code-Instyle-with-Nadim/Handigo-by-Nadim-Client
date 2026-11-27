"use server"

import { revalidatePath } from "next/cache"

import type { ServiceRecord } from "@/lib/dashboard-types"
import { normalizeRole } from "@/lib/roles"
import { getServerSession } from "@/lib/session"
import {
  isServiceCategory,
  isServiceMode,
} from "@/lib/service-constants"

const BASE_URL = process.env.MONGODB_BACKEND_URI

const APPROVAL_STATUSES = ["pending", "approved", "rejected"] as const

export type UpdateMyServiceInput = {
  title: string
  category: string
  description: string
  image: string
  basePrice: number
  estimatedDuration: string
  serviceMode: string
  serviceArea: string
}

type ActionResult =
  | { success: true; message: string }
  | { success: false; message: string }

type ValidatedServiceInput = {
  title: string
  category: string
  description: string
  image: string
  basePrice: number
  estimatedDuration: string
  serviceMode: ServiceRecord["serviceMode"]
  serviceArea: string
}

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : ""
}

function toIsoString(value: unknown) {
  if (typeof value === "string" && value) {
    return value
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  return ""
}

function normalizeService(raw: unknown): ServiceRecord | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null
  }

  const record = raw as Record<string, unknown>
  const id = String(record.id ?? record._id ?? "")

  if (!id) {
    return null
  }

  const rawStatus = String(record.approvalStatus ?? "pending").toLowerCase()
  const approvalStatus = (APPROVAL_STATUSES as readonly string[]).includes(
    rawStatus
  )
    ? (rawStatus as ServiceRecord["approvalStatus"])
    : "pending"

  const rawMode = String(record.serviceMode ?? "")
  const serviceMode = isServiceMode(rawMode)
    ? (rawMode as ServiceRecord["serviceMode"])
    : "Home Visit"

  return {
    id,
    title: String(record.title ?? "Untitled service"),
    category: String(record.category ?? "General"),
    description: String(record.description ?? ""),
    basePrice: Number(record.basePrice ?? 0) || 0,
    estimatedDuration: String(
      record.estimatedDuration ?? record.duration ?? ""
    ),
    serviceMode,
    serviceArea: String(record.serviceArea ?? ""),
    image: String(record.image ?? ""),
    technicianId: String(record.technicianId ?? ""),
    technicianName: String(
      record.technicianName ?? record.TechnicianName ?? ""
    ),
    technicianEmail: normalizeEmail(
      record.technicianEmail ?? record.email ?? record.TechnicianEmail
    ),
    approvalStatus,
    isAvailable: record.isAvailable !== false && record.isAvailable !== "false",
    createdAt: toIsoString(record.createdAt),
    updatedAt: toIsoString(record.updatedAt),
  }
}

async function requestAllServices() {
  if (!BASE_URL) {
    throw new Error("Backend URL is missing")
  }

  const response = await fetch(`${BASE_URL}/service`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch service data")
  }

  const data: unknown = await response.json()

  if (!Array.isArray(data)) {
    return []
  }

  return data
    .map(normalizeService)
    .filter((service): service is ServiceRecord => service !== null)
}

/**
 * The backend currently exposes `GET /service` and stores the owner in the
 * `technicianEmail` field. Filtering here keeps this helper working even when
 * the older `/service/:email` route is unavailable or looks at `email` only.
 */
export async function FindMyService(email: string): Promise<ServiceRecord[]> {
  try {
    const normalizedEmail = normalizeEmail(email)

    if (!normalizedEmail) {
      return []
    }

    const services = await requestAllServices()

    return services
      .filter((service) => service.technicianEmail === normalizedEmail)
      .sort((a, b) => {
        const aTime = Date.parse(a.createdAt) || 0
        const bTime = Date.parse(b.createdAt) || 0

        return bTime - aTime
      })
  } catch (error) {
    console.error("Error fetching service data:", error)
    return []
  }
}

async function getTechnicianSession() {
  const session = await getServerSession()
  const user = session?.user

  if (!user) {
    return {
      ok: false as const,
      message: "Please sign in as a technician before managing services.",
    }
  }

  if (normalizeRole(user.role) !== "technician") {
    return {
      ok: false as const,
      message: "Only technician accounts can manage services.",
    }
  }

  return {
    ok: true as const,
    user,
    email: normalizeEmail(user.email),
  }
}

async function ownsService(id: string, email: string) {
  const services = await FindMyService(email)

  return services.some((service) => service.id === id)
}

function revalidateServicePaths() {
  revalidatePath("/services")
  revalidatePath("/dashboard/technician")
  revalidatePath("/dashboard/technician/my-services")
  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/admin/services")
}

async function readBackendMessage(response: Response, fallback: string) {
  try {
    const data: unknown = await response.json()

    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message
    }
  } catch {
    // The backend did not return JSON; use the fallback message.
  }

  return fallback
}

async function readBackendResult(response: Response) {
  try {
    const data: unknown = await response.json()

    if (data && typeof data === "object") {
      return data as Record<string, unknown>
    }
  } catch {
    // Some successful responses do not include a body.
  }

  return null
}

function validateInput(input: UpdateMyServiceInput) {
  const title = input.title?.trim() ?? ""
  const category = input.category?.trim() ?? ""
  const description = input.description?.trim() ?? ""
  const image = input.image?.trim() ?? ""
  const estimatedDuration = input.estimatedDuration?.trim() ?? ""
  const serviceMode = input.serviceMode?.trim() ?? ""
  const serviceArea = input.serviceArea?.trim() ?? ""
  const basePrice = Number(input.basePrice)

  if (title.length < 5) {
    return {
      success: false as const,
      message: "Service title must be at least 5 characters.",
    }
  }

  if (title.length > 80) {
    return {
      success: false as const,
      message: "Keep the service title under 80 characters.",
    }
  }

  if (!isServiceCategory(category)) {
    return {
      success: false as const,
      message: "Please choose a valid service category.",
    }
  }

  if (description.length < 20) {
    return {
      success: false as const,
      message: "Describe the service in at least 20 characters.",
    }
  }

  if (description.length > 600) {
    return {
      success: false as const,
      message: "Keep the description under 600 characters.",
    }
  }

  if (!/^https?:\/\//i.test(image)) {
    return {
      success: false as const,
      message: "Please upload a service banner before saving.",
    }
  }

  if (!Number.isFinite(basePrice) || basePrice <= 0) {
    return {
      success: false as const,
      message: "Please enter a starting price greater than 0.",
    }
  }

  if (!estimatedDuration) {
    return {
      success: false as const,
      message: "Please add an estimated duration.",
    }
  }

  if (!isServiceMode(serviceMode)) {
    return {
      success: false as const,
      message: "Please choose a valid service mode.",
    }
  }

  if (!serviceArea) {
    return {
      success: false as const,
      message: "Please add the area you cover.",
    }
  }

  return {
    success: true as const,
    value: {
      title,
      category,
      description,
      image,
      basePrice,
      estimatedDuration,
      serviceMode: serviceMode as ServiceRecord["serviceMode"],
      serviceArea,
    } satisfies ValidatedServiceInput,
  }
}

function isValidServiceId(id: string) {
  return /^[a-f\d]{24}$/i.test(id)
}

export async function updateMyService(
  id: string,
  input: UpdateMyServiceInput
): Promise<ActionResult> {
  try {
    const session = await getTechnicianSession()

    if (!session.ok) {
      return { success: false, message: session.message }
    }

    if (!isValidServiceId(id)) {
      return { success: false, message: "That service could not be found." }
    }

    const validated = validateInput(input)

    if (!validated.success) {
      return { success: false, message: validated.message }
    }

    if (!(await ownsService(id, session.email))) {
      return {
        success: false,
        message: "That service could not be found on your account.",
      }
    }

    if (!BASE_URL) {
      throw new Error("Backend URL is missing")
    }

    const response = await fetch(`${BASE_URL}/service/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...validated.value,
        approvalStatus: "pending",
        updatedAt: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      return {
        success: false,
        message: await readBackendMessage(
          response,
          "Unable to update this service."
        ),
      }
    }

    const result = await readBackendResult(response)

    if (result?.matchedCount === 0) {
      return { success: false, message: "That service could not be found." }
    }

    revalidateServicePaths()

    return {
      success: true,
      message:
        "Service updated. It has been sent back to the admin queue for approval.",
    }
  } catch (error) {
    console.error("Unable to update service", error)

    return {
      success: false,
      message: "Could not update your service. Please try again.",
    }
  }
}

export async function deleteMyService(id: string): Promise<ActionResult> {
  try {
    const session = await getTechnicianSession()

    if (!session.ok) {
      return { success: false, message: session.message }
    }

    if (!isValidServiceId(id)) {
      return { success: false, message: "That service could not be found." }
    }

    if (!(await ownsService(id, session.email))) {
      return {
        success: false,
        message: "That service could not be found on your account.",
      }
    }

    if (!BASE_URL) {
      throw new Error("Backend URL is missing")
    }

    const response = await fetch(`${BASE_URL}/service/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return {
        success: false,
        message: await readBackendMessage(
          response,
          "Unable to delete this service."
        ),
      }
    }

    const result = await readBackendResult(response)

    if (result?.deletedCount === 0) {
      return { success: false, message: "That service could not be found." }
    }

    revalidateServicePaths()

    return {
      success: true,
      message: "Service deleted. It no longer appears on public pages.",
    }
  } catch (error) {
    console.error("Unable to delete service", error)

    return {
      success: false,
      message: "Could not delete this service. Please try again.",
    }
  }
}

export async function toggleMyServiceAvailability(
  id: string,
  isAvailable: boolean
): Promise<ActionResult> {
  try {
    const session = await getTechnicianSession()

    if (!session.ok) {
      return { success: false, message: session.message }
    }

    if (!isValidServiceId(id)) {
      return { success: false, message: "That service could not be found." }
    }

    if (typeof isAvailable !== "boolean") {
      return {
        success: false,
        message: "Please choose a valid availability state.",
      }
    }

    if (!(await ownsService(id, session.email))) {
      return {
        success: false,
        message: "That service could not be found on your account.",
      }
    }

    if (!BASE_URL) {
      throw new Error("Backend URL is missing")
    }

    const response = await fetch(`${BASE_URL}/service/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isAvailable,
        updatedAt: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      return {
        success: false,
        message: await readBackendMessage(
          response,
          "Unable to change availability."
        ),
      }
    }

    const result = await readBackendResult(response)

    if (result?.matchedCount === 0) {
      return { success: false, message: "That service could not be found." }
    }

    revalidateServicePaths()

    return {
      success: true,
      message: isAvailable
        ? "Service is now available to customers."
        : "Service hidden. It no longer appears on public pages.",
    }
  } catch (error) {
    console.error("Unable to toggle service availability", error)

    return {
      success: false,
      message: "Could not change availability. Please try again.",
    }
  }
}
