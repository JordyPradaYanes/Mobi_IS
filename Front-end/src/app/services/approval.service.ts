import { Injectable } from "@angular/core"
import { type Observable, BehaviorSubject, of, delay, map } from "rxjs"
import type { Property, PropertyWithOwnerInfo } from "../interfaces/property.interface"
import type { ApprovalRecord, ApprovalAction, ApprovalStats } from "../interfaces/approval.interface"

@Injectable({
  providedIn: "root",
})
export class ApprovalService {
  private pendingPropertiesSubject = new BehaviorSubject<PropertyWithOwnerInfo[]>([])
  private approvalStatsSubject = new BehaviorSubject<ApprovalStats>({
    totalPending: 0,
    totalApproved: 0,
    totalRejected: 0,
    averageReviewTime: 0,
    pendingOlderThan24h: 0,
  })

  // Datos de ejemplo usando tu interfaz original
  private mockPendingProperties: PropertyWithOwnerInfo[] = [
    {
      id: "1",
      title: "Casa moderna en Atalaya",
      description: "Hermosa casa con acabados de lujo y amplios espacios",
      address: "Atalaya, Cúcuta",
      city: "Cúcuta",
      price: 350000000,
      type: "SALE",
      propertyType: "HOUSE",
      status: "PENDING",
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop"],
      amenities: ["Piscina", "Jardín", "Garaje"],
      isApproved: false,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      ownerId: "user1",
      // Campos adicionales para administradores
      ownerName: "Juan Pérez",
      ownerEmail: "juan.perez@email.com",
      ownerPhone: "+57 300 123 4567",
      submittedAt: new Date("2024-01-15"),
      timesPending: 1,
      listingDate: new Date()
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
      status: "PENDING",
      bedrooms: 2,
      bathrooms: 1,
      area: 80,
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"],
      amenities: ["Gimnasio", "Portería", "Ascensor"],
      isApproved: false,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-10"),
      ownerId: "user2",
      // Campos adicionales para administradores
      ownerName: "María González",
      ownerEmail: "maria.gonzalez@email.com",
      ownerPhone: "+57 301 987 6543",
      submittedAt: new Date("2024-01-10"),
      timesPending: 2,
      listingDate: new Date()
    },
    {
      id: "3",
      title: "Oficina comercial",
      description: "Espacio comercial ideal para oficinas",
      address: "Zona Rosa, Cúcuta",
      city: "Cúcuta",
      price: 2500000,
      type: "RENT",
      propertyType: "OFFICE",
      status: "PENDING",
      bedrooms: 0,
      bathrooms: 2,
      area: 150,
      images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop"],
      amenities: ["Aire acondicionado", "Parqueadero", "Seguridad"],
      isApproved: false,
      createdAt: new Date("2024-01-08"),
      updatedAt: new Date("2024-01-08"),
      ownerId: "user3",
      // Campos adicionales para administradores
      ownerName: "Carlos Rodríguez",
      ownerEmail: "carlos.rodriguez@email.com",
      ownerPhone: "+57 302 456 7890",
      submittedAt: new Date("2024-01-08"),
      timesPending: 1,
      listingDate: new Date()
    },
  ]

  constructor() {
    this.updatePendingProperties()
    this.updateStats()
  }

  // Para administradores
  getPendingApprovals(filters?: any): Observable<PropertyWithOwnerInfo[]> {
    return this.pendingPropertiesSubject.asObservable().pipe(
      map((properties) => {
        let filtered = [...properties]

        if (filters) {
          if (filters.status) {
            filtered = filtered.filter((p) => p.status === filters.status)
          }
          if (filters.city) {
            filtered = filtered.filter((p) => p.city.toLowerCase().includes(filters.city.toLowerCase()))
          }
          if (filters.propertyType) {
            filtered = filtered.filter((p) => p.propertyType === filters.propertyType)
          }
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase()
            filtered = filtered.filter(
              (p) =>
                p.title.toLowerCase().includes(searchTerm) ||
                (p.ownerName && p.ownerName.toLowerCase().includes(searchTerm)) ||
                p.address.toLowerCase().includes(searchTerm),
            )
          }
        }

        return filtered
      }),
      delay(500), // Simular latencia de red
    )
  }

  getApprovalStats(): Observable<ApprovalStats> {
    return this.approvalStatsSubject.asObservable()
  }

  approveProperty(action: ApprovalAction): Observable<ApprovalRecord> {
    const property = this.mockPendingProperties.find((p) => p.id === action.propertyId)

    if (property) {
      const record: ApprovalRecord = {
        id: Date.now().toString(),
        propertyId: action.propertyId,
        adminId: "admin1",
        adminName: "Admin Usuario",
        previousStatus: property.status,
        newStatus: action.action === "APPROVE" ? "APPROVED" : action.action === "REJECT" ? "REJECTED" : "PENDING",
        comments: action.comments,
        approvalDate: new Date(),
        reviewNotes: action.adminNotes,
      }

      // Actualizar el estado de la propiedad
      property.status = record.newStatus as any
      property.updatedAt = new Date()
      property.reviewedAt = new Date()
      property.reviewedBy = "Admin Usuario"

      // Actualizar isApproved según el nuevo estado
      property.isApproved = record.newStatus === "APPROVED"

      // Si se aprueba o rechaza, remover de pendientes
      if (action.action === "APPROVE" || action.action === "REJECT") {
        this.mockPendingProperties = this.mockPendingProperties.filter((p) => p.id !== action.propertyId)
        this.updatePendingProperties()
        this.updateStats()
      }

      return of(record).pipe(delay(1000))
    }

    throw new Error("Propiedad no encontrada")
  }

  getPropertyForReview(id: string): Observable<PropertyWithOwnerInfo> {
    const property = this.mockPendingProperties.find((p) => p.id === id)
    if (property) {
      return of(property).pipe(delay(500))
    }
    throw new Error("Propiedad no encontrada")
  }

  getApprovalHistory(propertyId: string): Observable<ApprovalRecord[]> {
    // Datos de ejemplo del historial
    const mockHistory: ApprovalRecord[] = [
      {
        id: "1",
        propertyId,
        adminId: "admin1",
        adminName: "Admin Usuario",
        previousStatus: "PENDING",
        newStatus: "PENDING",
        comments: "Propiedad recibida para revisión",
        approvalDate: new Date("2024-01-16"),
        reviewNotes: "Iniciando proceso de revisión",
      },
    ]

    return of(mockHistory).pipe(delay(300))
  }

  // Para usuarios - usando tu interfaz original
  getUserPropertyStatus(userId: string): Observable<Property[]> {
    // Simular propiedades del usuario con diferentes estados
    const userProperties: Property[] = [
      {
        id: "1",
        title: "Mi Casa en Atalaya",
        description: "Casa familiar con jardín",
        address: "Atalaya, Cúcuta",
        city: "Cúcuta",
        price: 350000000,
        type: "SALE",
        propertyType: "HOUSE",
        status: "PENDING",
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop"],
        amenities: ["Piscina", "Jardín"],
        isApproved: false,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        ownerId: userId,
        listingDate: new Date()
      },
      {
        id: "2",
        title: "Apartamento Centro",
        description: "Apartamento moderno",
        address: "Centro, Cúcuta",
        city: "Cúcuta",
        price: 1200000,
        type: "RENT",
        propertyType: "APARTMENT",
        status: "APPROVED",
        bedrooms: 2,
        bathrooms: 1,
        area: 80,
        images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"],
        amenities: ["Gimnasio"],
        isApproved: true,
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-12"),
        ownerId: userId,
        listingDate: new Date()
      },
      {
        id: "3",
        title: "Local Comercial",
        description: "Local en zona comercial",
        address: "Av. Libertadores, Cúcuta",
        city: "Cúcuta",
        price: 3500000,
        type: "RENT",
        propertyType: "OFFICE",
        status: "REJECTED",
        bedrooms: 0,
        bathrooms: 1,
        area: 60,
        images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop"],
        amenities: ["Parqueadero"],
        isApproved: false,
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-07"),
        ownerId: userId,
        listingDate: new Date()
      },
    ]

    return of(userProperties).pipe(delay(500))
  }

  getApprovalTimeline(propertyId: string): Observable<ApprovalRecord[]> {
    return this.getApprovalHistory(propertyId)
  }

  resubmitProperty(propertyId: string): Observable<Property> {
    // Simular reenvío de propiedad
    const property = this.mockPendingProperties.find((p) => p.id === propertyId)
    if (property) {
      property.status = "PENDING"
      property.updatedAt = new Date()
      property.submittedAt = new Date()
      property.isApproved = false
      return of(property).pipe(delay(1000))
    }
    throw new Error("Propiedad no encontrada")
  }

  private updatePendingProperties(): void {
    this.pendingPropertiesSubject.next([...this.mockPendingProperties])
  }

  private updateStats(): void {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const stats: ApprovalStats = {
      totalPending: this.mockPendingProperties.filter((p) => p.status === "PENDING").length,
      totalApproved: 15, // Datos simulados
      totalRejected: 3,
      averageReviewTime: 18.5,
      pendingOlderThan24h: this.mockPendingProperties.filter(
        (p) => p.status === "PENDING" && p.submittedAt && p.submittedAt < oneDayAgo,
      ).length,
    }

    this.approvalStatsSubject.next(stats)
  }
}