"use server"

import { revalidatePath } from "next/cache"


import { normalizeRole } from "@/lib/roles"
import { getServerSession } from "@/lib/session"
import { ServiceDataType } from "../AllofType"

const SERVICE_CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const

const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const

type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]
type ServiceMode = (typeof SERVICE_MODES)[number]

type CreateServiceResult =
  { success: true; id: string } | { success: false; message: string }

function readText(formData: FormData, key: string) {
  const value = formData.get(key)

  return typeof value === "string" ? value.trim() : ""
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value)

    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function isCategory(value: string): value is ServiceCategory {
  return SERVICE_CATEGORIES.includes(value as ServiceCategory)
}

function isServiceMode(value: string): value is ServiceMode {
  return SERVICE_MODES.includes(value as ServiceMode)
}

export async function createService(
  formData: FormData
): Promise<CreateServiceResult> {
  const session = await getServerSession()

  if (!session?.user) {
    return {
      success: false,
      message: "Please sign in as a technician before adding a service.",
    }
  }

  if (normalizeRole(session.user.role) !== "technician") {
    return {
      success: false,
      message: "Only technician accounts can add services.",
    }
  }

  const title = readText(formData, "title")
  const category = readText(formData, "category")
  const description = readText(formData, "description")
  const image = readText(formData, "image")
  const estimatedDuration = readText(formData, "estimatedDuration")
  const serviceMode = readText(formData, "serviceMode")
  const serviceArea = readText(formData, "serviceArea")
  const basePrice = Number(readText(formData, "basePrice"))

  if (!title) {
    return { success: false, message: "Please add a service title." }
  }

  if (title.length > 80) {
    return {
      success: false,
      message: "Keep the service title under 80 characters.",
    }
  }

  if (!isCategory(category)) {
    return { success: false, message: "Please choose a valid category." }
  }

  if (description.length < 20) {
    return {
      success: false,
      message: "Describe the service in at least 20 characters.",
    }
  }

  if (description.length > 600) {
    return {
      success: false,
      message: "Keep the description under 600 characters.",
    }
  }

  if (!image || !isHttpUrl(image)) {
    return {
      success: false,
      message: "Please upload a service banner before submitting.",
    }
  }

  if (!Number.isFinite(basePrice) || basePrice <= 0) {
    return {
      success: false,
      message: "Please enter a starting price greater than 0.",
    }
  }

  if (!estimatedDuration) {
    return { success: false, message: "Please add an estimated duration." }
  }

  if (!isServiceMode(serviceMode)) {
    return { success: false, message: "Please choose a valid service mode." }
  }

  if (!serviceArea) {
    return { success: false, message: "Please add the area you cover." }
  }

  // The client can send these fields, but the server always owns the
  // approval state, availability default and ownership details.
  const isAvailable = formData.get("isAvailable") !== "false"
  const now = new Date()

try {
  const FinalData = {
    title,
    category,
    description,
    image,
    basePrice,
    estimatedDuration,
    serviceMode,
    serviceArea,
    technicianId: session.user.id,
    technicianName: session.user.name || "Technician",
    technicianEmail: session.user.email,
    approvalStatus: "pending",
    isAvailable,
    createdAt: now,
    updatedAt: now,
  }

  const BASE_URL = process.env.MONGODB_BACKEND_URI

  if (!BASE_URL) {
    throw new Error("Backend URL is missing")
  }

  const res = await fetch(`${BASE_URL}/service`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(FinalData),
  })

  const result = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: result.message || "Unable to create service.",
    }
  }

  revalidatePath("/dashboard/technician")
  revalidatePath("/dashboard/technician/my-services")
  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/admin/services")

  return {
    success: true,
    id: result.id,
  }

} catch (error) {
  console.error("Unable to create service", error)

  return {
    success: false,
    message: "Could not save your service. Please try again.",
  }
}


}  

    

