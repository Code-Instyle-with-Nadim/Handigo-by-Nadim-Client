import type { Filter } from "mongodb"

import {
  bookingsCollection,
  paymentsCollection,
  servicesCollection,
  usersCollection,
  type BookingDoc,
  type PaymentDoc,
  type ServiceDoc,
  type UserDoc,
} from "@/lib/collections"
import type {
  AdminOverview,
  BookingRecord,
  CustomerOverview,
  DashboardUserRecord,
  PaymentRecord,
  ServiceRecord,
  TechnicianOverview,
  TransactionSummary,
} from "@/lib/dashboard-types"
import { normalizeRole } from "@/lib/roles"

function dateValue(value?: Date | string | null) {
  if (!value) return ""

  if (value instanceof Date) {
    return value.toISOString()
  }

  return value
}

export function mapService(doc: ServiceDoc): ServiceRecord {
  return {
    id: doc._id.toString(),
    title: doc.title ?? "Untitled service",
    category: doc.category ?? "General",
    description: doc.description ?? "",
    basePrice: Number(doc.basePrice) || 0,
    duration: doc.duration ?? "",
    serviceMode: doc.serviceMode === "shop-drop-off" ? "shop-drop-off" : "home-visit",
    serviceArea: doc.serviceArea ?? "",
    image: doc.image ?? "",
    technicianId: doc.technicianId ?? "",
    technicianName: doc.technicianName ?? "",
    technicianEmail: doc.technicianEmail ?? "",
    approvalStatus:
      doc.approvalStatus === "approved" || doc.approvalStatus === "rejected"
        ? doc.approvalStatus
        : "pending",
    isAvailable: Boolean(doc.isAvailable),
    createdAt: dateValue(doc.createdAt),
    updatedAt: dateValue(doc.updatedAt),
  }
}

export function mapBooking(doc: BookingDoc): BookingRecord {
  return {
    id: doc._id.toString(),
    serviceId: doc.serviceId ?? "",
    serviceTitle: doc.serviceTitle ?? "Service",
    serviceImage: doc.serviceImage ?? "",
    category: doc.category ?? "General",
    basePrice: Number(doc.basePrice) || 0,
    finalAmount:
      typeof doc.finalAmount === "number" && Number.isFinite(doc.finalAmount)
        ? doc.finalAmount
        : null,
    customerId: doc.customerId ?? "",
    customerName: doc.customerName ?? "",
    customerEmail: doc.customerEmail ?? "",
    customerPhone: doc.customerPhone ?? "",
    customerAddress: doc.customerAddress ?? "",
    technicianId: doc.technicianId ?? "",
    technicianName: doc.technicianName ?? "",
    technicianEmail: doc.technicianEmail ?? "",
    preferredDate: dateValue(doc.preferredDate),
    problemDescription: doc.problemDescription ?? "",
    status: doc.status ?? "requested",
    paymentStatus: doc.paymentStatus === "paid" ? "paid" : "unpaid",
    createdAt: dateValue(doc.createdAt),
    updatedAt: dateValue(doc.updatedAt),
  }
}

export function mapPayment(doc: PaymentDoc): PaymentRecord {
  return {
    id: doc._id.toString(),
    bookingId: doc.bookingId ?? "",
    customerId: doc.customerId ?? "",
    customerName: doc.customerName ?? "",
    customerEmail: doc.customerEmail ?? "",
    technicianId: doc.technicianId ?? "",
    technicianName: doc.technicianName ?? "",
    technicianEmail: doc.technicianEmail ?? "",
    serviceId: doc.serviceId ?? "",
    serviceTitle: doc.serviceTitle ?? "Service",
    amount: Number(doc.amount) || 0,
    transactionId: doc.transactionId ?? "",
    paidAt: dateValue(doc.paidAt),
    createdAt: dateValue(doc.createdAt),
  }
}

export function mapUser(doc: UserDoc): DashboardUserRecord {
  return {
    id: doc._id.toString(),
    name: doc.name ?? "",
    email: doc.email ?? "",
    image: doc.image ?? "",
    role: normalizeRole(doc.role),
    phone: doc.phone ?? "",
    area: doc.area ?? "",
    bio: doc.bio ?? "",
    joinedAt: dateValue(doc.createdAt),
  }
}

function customerBookingFilter(
  customerId: string,
  customerEmail: string
): Filter<BookingDoc> {
  return {
    $or: [{ customerId }, { customerEmail }],
  }
}

function technicianServiceFilter(
  technicianEmail: string,
  technicianId: string
): Filter<ServiceDoc> {
  return {
    $or: [{ technicianEmail }, { technicianId }],
  }
}

function technicianBookingFilter(
  technicianEmail: string,
  technicianId: string
): Filter<BookingDoc> {
  return {
    $or: [{ technicianEmail }, { technicianId }],
  }
}

export async function getCustomerOverview(
  customerId: string,
  customerEmail: string
): Promise<CustomerOverview> {
  const filter = customerBookingFilter(customerId, customerEmail)

  const [totalRequests, activeJobs, completedJobs, recentDocs] =
    await Promise.all([
      bookingsCollection.countDocuments(filter),
      bookingsCollection.countDocuments({
        ...filter,
        status: { $in: ["requested", "accepted", "in-progress"] },
      }),
      bookingsCollection.countDocuments({ ...filter, status: "completed" }),
      bookingsCollection
        .find(filter)
        .sort({ createdAt: -1 })
        .limit(4)
        .toArray(),
    ])

  return {
    totalRequests,
    activeJobs,
    completedJobs,
    recentBookings: recentDocs.map(mapBooking),
  }
}

export async function getCustomerBookings(
  customerId: string,
  customerEmail: string
): Promise<BookingRecord[]> {
  const docs = await bookingsCollection
    .find(customerBookingFilter(customerId, customerEmail))
    .sort({ createdAt: -1 })
    .toArray()

  return docs.map(mapBooking)
}

export async function getCustomerPayments(
  customerId: string,
  customerEmail: string
): Promise<PaymentRecord[]> {
  const docs = await paymentsCollection
    .find({
      $or: [{ customerId }, { customerEmail }],
    })
    .sort({ paidAt: -1 })
    .toArray()

  return docs.map(mapPayment)
}

export async function getTechnicianOverview(
  technicianEmail: string,
  technicianId: string
): Promise<TechnicianOverview> {
  const serviceFilter = technicianServiceFilter(technicianEmail, technicianId)
  const bookingFilter = technicianBookingFilter(technicianEmail, technicianId)

  const [totalServices, approvedServices, pendingRequests, recentDocs] =
    await Promise.all([
      servicesCollection.countDocuments(serviceFilter),
      servicesCollection.countDocuments({
        ...serviceFilter,
        approvalStatus: "approved",
      }),
      bookingsCollection.countDocuments({
        ...bookingFilter,
        status: "requested",
      }),
      bookingsCollection
        .find({ ...bookingFilter, status: "requested" })
        .sort({ createdAt: -1 })
        .limit(4)
        .toArray(),
    ])

  return {
    totalServices,
    approvedServices,
    pendingRequests,
    recentRequests: recentDocs.map(mapBooking),
  }
}

export async function getTechnicianServices(
  technicianEmail: string,
  technicianId: string
): Promise<ServiceRecord[]> {
  const docs = await servicesCollection
    .find(technicianServiceFilter(technicianEmail, technicianId))
    .sort({ createdAt: -1 })
    .toArray()

  return docs.map(mapService)
}

export async function getTechnicianBookings(
  technicianEmail: string,
  technicianId: string
): Promise<BookingRecord[]> {
  const docs = await bookingsCollection
    .find(technicianBookingFilter(technicianEmail, technicianId))
    .sort({ createdAt: -1 })
    .toArray()

  return docs.map(mapBooking)
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const [totalUsers, totalTechnicians, pendingServices, pendingDocs] =
    await Promise.all([
      usersCollection.countDocuments({}),
      usersCollection.countDocuments({ role: "technician" }),
      servicesCollection.countDocuments({ approvalStatus: "pending" }),
      servicesCollection
        .find({ approvalStatus: "pending" })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
    ])

  return {
    totalUsers,
    totalTechnicians,
    pendingServices,
    pendingServiceList: pendingDocs.map(mapService),
  }
}

export async function getAdminUsers(): Promise<DashboardUserRecord[]> {
  const docs = await usersCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray()

  return docs.map(mapUser)
}

export async function getAdminServices(): Promise<ServiceRecord[]> {
  const docs = await servicesCollection.find({}).toArray()

  return docs
    .map(mapService)
    .sort((a, b) => {
      const priority = { pending: 0, rejected: 1, approved: 2 } as const
      const byStatus = priority[a.approvalStatus] - priority[b.approvalStatus]

      if (byStatus !== 0) return byStatus

      return b.createdAt.localeCompare(a.createdAt)
    })
}

export async function getAdminBookings(): Promise<BookingRecord[]> {
  const docs = await bookingsCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray()

  return docs.map(mapBooking)
}

export async function getAdminTransactions(): Promise<TransactionSummary> {
  const docs = await paymentsCollection.find({}).sort({ paidAt: -1 }).toArray()
  const payments = docs.map(mapPayment)
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0)

  return { payments, totalRevenue }
}

/**
 * Public listings only ever expose approved services that the technician has
 * left available. Unavailable services disappear from this query entirely.
 */
export async function getPublicServices(): Promise<ServiceRecord[]> {
  const docs = await servicesCollection
    .find({ approvalStatus: "approved", isAvailable: true })
    .sort({ createdAt: -1 })
    .toArray()

  return docs.map(mapService)
}
