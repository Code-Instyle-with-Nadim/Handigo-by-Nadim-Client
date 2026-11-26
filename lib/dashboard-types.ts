import type { UserRole } from "@/lib/roles"

export type BookingStatus =
  | "requested"
  | "accepted"
  | "in-progress"
  | "completed"
  | "rejected"
  | "cancelled"

export type PaymentStatus = "unpaid" | "paid"

export type ApprovalStatus = "pending" | "approved" | "rejected"

export type ServiceMode = "Home Visit" | "Shop Drop-off"

export type ServiceRecord = {
  id: string
  title: string
  category: string
  description: string
  basePrice: number
  estimatedDuration: string
  serviceMode: ServiceMode
  serviceArea: string
  image: string
  technicianId: string
  technicianName: string
  technicianEmail: string
  approvalStatus: ApprovalStatus
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export type BookingRecord = {
  id: string
  serviceId: string
  serviceTitle: string
  serviceImage: string
  category: string
  basePrice: number
  finalAmount: number | null
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
  createdAt: string
  updatedAt: string
}

export type PaymentRecord = {
  id: string
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
  paidAt: string
  createdAt: string
}

export type DashboardUserRecord = {
  id: string
  name: string
  email: string
  image: string
  role: UserRole
  phone: string
  area: string
  bio: string
  joinedAt: string
}

export type CustomerOverview = {
  totalRequests: number
  activeJobs: number
  completedJobs: number
  recentBookings: BookingRecord[]
}

export type TechnicianOverview = {
  totalServices: number
  approvedServices: number
  pendingRequests: number
  recentRequests: BookingRecord[]
}

export type AdminOverview = {
  totalUsers: number
  totalTechnicians: number
  pendingServices: number
  pendingServiceList: ServiceRecord[]
}

export type TransactionSummary = {
  payments: PaymentRecord[]
  totalRevenue: number
}
