import { Injectable } from "@angular/core"
import { type Observable, BehaviorSubject, of, delay } from "rxjs"
import type { Property } from "../interfaces/property.interface"
import type { PropertyStats, PropertyMetrics } from "../interfaces/user-dashboard.interface"

@Injectable({
  providedIn: "root",
})
export class UserPropertyService {
  private userPropertiesSubject = new BehaviorSubject<Property[]>([])
  private propertyStatsSubject = new BehaviorSubject<PropertyStats>({
    totalProperties: 0,
    activeListings: 0,
    soldProperties: 0,
    rentedProperties: 0,
    totalEarnings: 0,
    monthlyRentalIncome: 0,
  })

  // Datos de ejemplo
  private mockUserProperties: Property[] = [
    {
        id: "1",
        title: "Casa moderna en Atalaya",
        description: "Hermosa casa con acabados de lujo y amplios espacios",
        address: "Atalaya, Cúcuta",
        city: "Cúcuta",
        price: 350000000,
        type: "SALE",
        propertyType: "HOUSE",
        status: "APPROVED",
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop"],
        amenities: ["Piscina", "Jardín", "Garaje"],
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        ownerId: "user1",
        listingDate: new Date("2024-01-15"),
        isApproved: false
    },
    {
        id: "2",
        title: "Apartamento en Centro",
        description: "Moderno departamento en el corazón de la ciudad",
        address: "Centro, Cúcuta",
        city: "Cúcuta",
        price: 1200000,
        type: "RENT",
        propertyType: "APARTMENT",
        status: "RENTED",
        bedrooms: 2,
        bathrooms: 1,
        area: 80,
        images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"],
        amenities: ["Gimnasio", "Portería", "Ascensor"],
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-12"),
        ownerId: "user1",
        listingDate: new Date("2024-01-10"),
        rentedDate: new Date("2024-01-12"),
        isApproved: false
    },
    {
        id: "3",
        title: "Local Comercial Zona Rosa",
        description: "Excelente local comercial en zona de alto tráfico",
        address: "Zona Rosa, Cúcuta",
        city: "Cúcuta",
        price: 450000000,
        type: "SALE",
        propertyType: "OFFICE",
        status: "SOLD",
        bedrooms: 0,
        bathrooms: 2,
        area: 150,
        images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop"],
        amenities: ["Aire acondicionado", "Parqueadero", "Seguridad"],
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-20"),
        ownerId: "user1",
        listingDate: new Date("2024-01-05"),
        soldDate: new Date("2024-01-20"),
        isApproved: false
    },
  ]

  constructor() {
    this.updateUserProperties()
    this.updatePropertyStats()
  }

  getUserProperties(userId: string): Observable<Property[]> {
    return this.userPropertiesSubject.asObservable().pipe(delay(500))
  }

  getPropertyStats(userId: string): Observable<PropertyStats> {
    return this.propertyStatsSubject.asObservable().pipe(delay(300))
  }

  updateProperty(propertyId: string, updates: Partial<Property>): Observable<Property> {
    const property = this.mockUserProperties.find((p) => p.id === propertyId)
    if (property) {
      Object.assign(property, updates)
      property.updatedAt = new Date()
      this.updateUserProperties()
      return of(property).pipe(delay(1000))
    }
    throw new Error("Propiedad no encontrada")
  }

  deactivateProperty(propertyId: string): Observable<boolean> {
    const property = this.mockUserProperties.find((p) => p.id === propertyId)
    if (property) {
      property.status = "REJECTED"
      property.updatedAt = new Date()
      this.updateUserProperties()
      this.updatePropertyStats()
      return of(true).pipe(delay(1000))
    }
    return of(false)
  }

  getPropertyMetrics(propertyId: string): Observable<PropertyMetrics> {
    const mockMetrics: PropertyMetrics = {
      propertyId,
      daysOnMarket: 45,
      viewsCount: 234,
      inquiriesCount: 12,
      totalEarnings: 15000000,
      occupancyRate: 85,
      averageRent: 1200000,
      maintenanceCosts: 500000,
      roi: 8.5,
    }
    return of(mockMetrics).pipe(delay(500))
  }

  private updateUserProperties(): void {
    this.userPropertiesSubject.next([...this.mockUserProperties])
  }

  private updatePropertyStats(): void {
    const stats: PropertyStats = {
      totalProperties: this.mockUserProperties.length,
      activeListings: this.mockUserProperties.filter((p) => p.status === "APPROVED").length,
      soldProperties: this.mockUserProperties.filter((p) => p.status === "SOLD").length,
      rentedProperties: this.mockUserProperties.filter((p) => p.status === "RENTED").length,
      totalEarnings: 46500000, // Suma de ventas
      monthlyRentalIncome: 1200000, // Suma de arriendos activos
    }
    this.propertyStatsSubject.next(stats)
  }
}