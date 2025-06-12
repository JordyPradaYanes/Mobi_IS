import type { Property } from "./property.interface"

export interface Purchase {
  id: string
  propertyId: string
  property: Property
  buyerId: string
  sellerId: string
  purchasePrice: number
  purchaseDate: Date
  status: "PENDING" | "IN_PROCESS" | "COMPLETED" | "CANCELLED"
  contractDate?: Date
  completionDate?: Date
  meetingId?: string
  documents: Document[]
  paymentSchedule: PaymentSchedule[]
  totalPaid: number
  remainingAmount: number
}

export interface Rental {
  id: string
  propertyId: string
  property: Property
  tenantId: string
  landlordId: string
  monthlyRent: number
  securityDeposit: number
  startDate: Date
  endDate: Date
  status: "ACTIVE" | "PENDING" | "EXPIRED" | "TERMINATED" | "RENEWED"
  contractDate: Date
  renewalDate?: Date
  terminationDate?: Date
  meetingId?: string
  documents: Document[]
  specialConditions?: string[]
}

export interface MonthlyBill {
  id: string
  rentalId: string
  rental: Rental
  month: number
  year: number
  rentAmount: number
  additionalCharges: BillCharge[]
  totalAmount: number
  dueDate: Date
  paidDate?: Date
  status: "PENDING" | "PAID" | "OVERDUE" | "PARTIALLY_PAID"
  paymentMethod?: string
  receiptUrl?: string
  lateFeesApplied: number
  notes?: string
}

export interface BillCharge {
  id: string
  description: string
  amount: number
  type: "MAINTENANCE" | "UTILITIES" | "ADMINISTRATION" | "INSURANCE" | "OTHER"
}

export interface PropertyStats {
  totalProperties: number
  activeListings: number
  soldProperties: number
  rentedProperties: number
  totalEarnings: number
  monthlyRentalIncome: number
}

export interface TransactionSummary {
  totalPurchases: number
  completedPurchases: number
  totalSpent: number
  activeRentals: number
  totalRentPaid: number
  pendingBills: number
  overdueAmount: number
}

export interface PaymentSchedule {
  id: string
  purchaseId: string
  installmentNumber: number
  amount: number
  dueDate: Date
  paidDate?: Date
  status: "PENDING" | "PAID" | "OVERDUE"
}

export interface MaintenanceRequest {
  id: string
  rentalId: string
  title: string
  description: string
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  requestDate: Date
  completionDate?: Date
  images?: string[]
  cost?: number
}

export interface RentalEvaluation {
  id: string
  rentalId: string
  rating: number
  propertyCondition: number
  landlordRating: number
  neighborhoodRating: number
  comments: string
  wouldRecommend: boolean
  evaluationDate: Date
}

export interface PropertyMetrics {
  propertyId: string
  daysOnMarket: number
  viewsCount: number
  inquiriesCount: number
  totalEarnings: number
  occupancyRate: number
  averageRent: number
  maintenanceCosts: number
  roi: number
}
