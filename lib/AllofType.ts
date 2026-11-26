export interface ServiceDataType {
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  isAvailable: boolean;
  technicianId: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}