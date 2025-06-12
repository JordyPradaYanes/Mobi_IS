export interface Property {
  id: string
  title: string
  description: string
  price: number
  type: "SALE" | "RENT"
  propertyType: "HOUSE" | "APARTMENT" | "OFFICE" | "LAND"
  bedrooms?: number
  bathrooms?: number
  area: number // m²
  address: string
  city: string
  images: string[]
  amenities: string[]
  isApproved: boolean
  status: "PENDING" | "APPROVED" | "REJECTED" | "SOLD" | "RENTED" | "UNDER_REVIEW"
  createdAt: Date
  updatedAt: Date
  ownerId: string
  listingDate: Date;
  rentedDate?: Date;
  soldDate?: Date;
}

export interface PropertyFilter {
  type?: "SALE" | "RENT"
  propertyType?: string
  minPrice?: number
  maxPrice?: number
  city?: string
  minBedrooms?: number
  maxBedrooms?: number
  amenities?: string[]
  searchText?: string
}

// Extensión para el sistema de aprobación (solo para administradores)
export interface PropertyWithOwnerInfo extends Property {
  ownerName?: string
  ownerEmail?: string
  ownerPhone?: string
  submittedAt?: Date
  reviewedAt?: Date
  reviewedBy?: string
  timesPending?: number
}