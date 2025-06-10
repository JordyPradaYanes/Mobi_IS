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
  status: "PENDING" | "APPROVED" | "REJECTED" | "SOLD" | "RENTED"
  createdAt: Date
  updatedAt: Date
  ownerId: string
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
