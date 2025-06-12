import type { PropertyWithOwnerInfo } from "./property.interface"

export interface ApprovalRecord {
  id: string
  propertyId: string
  adminId: string
  adminName: string
  previousStatus: string
  newStatus: string
  comments: string
  approvalDate: Date
  reviewNotes?: string
}

export interface ApprovalAction {
  propertyId: string
  action: "APPROVE" | "REJECT" | "REQUEST_CHANGES"
  comments: string
  adminNotes?: string
  requestedChanges?: string[]
}

export interface ApprovalStats {
  totalPending: number
  totalApproved: number
  totalRejected: number
  averageReviewTime: number // en horas
  pendingOlderThan24h: number
}

// Alias para mantener compatibilidad
export type PropertyWithOwner = PropertyWithOwnerInfo