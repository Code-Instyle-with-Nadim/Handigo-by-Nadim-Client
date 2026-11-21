import { ObjectId } from "mongodb"

import { db } from "@/lib/mongodb"
import type {
  ApprovalStatus,
  BookingStatus,
  PaymentStatus,
  ServiceMode,
} from "@/lib/dashboard-types"

export type UserDoc = {
  _id: ObjectId
  name?: string
  email: string
  emailVerified?: boolean
  image?: string | null
  role?: string | null
  phone?: string | null
  area?: string | null
  bio?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export type ServiceDoc = {
  _id: ObjectId
  title: string
  category: string
  description: string
  basePrice: number
  duration: string
  serviceMode: ServiceMode
  serviceArea: string
  image: string
  technicianId: string
  technicianName: string
  technicianEmail: string
  approvalStatus: ApprovalStatus
  isAvailable: boolean
  createdAt?: Date
  updatedAt?: Date
}

export type BookingDoc = {
  _id: ObjectId
  serviceId: string
  serviceTitle: string
  serviceImage: string
  category: string
  basePrice: number
  finalAmount?: number | null
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  technicianId: string
  technicianName: string
  technicianEmail: string
  preferredDate: string
  problemDescription: string
  status: BookingStatus
  paymentStatus: PaymentStatus
  createdAt?: Date
  updatedAt?: Date
}

export type PaymentDoc = {
  _id: ObjectId
  bookingId: string
  customerId: string
  customerName: string
  customerEmail: string
  technicianId: string
  technicianName: string
  technicianEmail: string
  serviceId: string
  serviceTitle: string
  amount: number
  transactionId: string
  stripeSessionId?: string
  paidAt: Date
  createdAt?: Date
}

export const usersCollection = db.collection<UserDoc>("user")
export const servicesCollection = db.collection<ServiceDoc>("services")
export const bookingsCollection = db.collection<BookingDoc>("bookings")
export const paymentsCollection = db.collection<PaymentDoc>("payments")

export function toObjectId(value: string) {
  if (!ObjectId.isValid(value)) {
    return null
  }

  return new ObjectId(value)
}
