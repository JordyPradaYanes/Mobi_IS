import { Injectable } from "@angular/core"
import { type Observable, of, delay } from "rxjs"
import type { Property, PropertyFilter } from "../../interfaces/property.interface"

@Injectable({
  providedIn: "root",
})
export class PropertyService {
  private mockProperties: Property[] = [
    {
      id: "1",
      title: "Casa Moderna en Los Lagos",
      description: "Hermosa casa con vista panorámica, acabados de lujo y amplios espacios.",
      price: 450000000,
      type: "SALE",
      propertyType: "HOUSE",
      bedrooms: 4,
      bathrooms: 3,
      area: 280,
      address: "Lagos Country 5678",
      city: "Las Condes",
      images: ["http://360agenciainmobiliaria.com/inmuebles/20241010021001_Menzuli4.jpg"],
      amenities: ["Piscina", "Jardín", "Garaje", "Terraza"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: "user1",
    },
    {
      id: "2",
      title: "Departamento Céntrico",
      description: "Moderno departamento en el corazón de la ciudad con todas las comodidades.",
      price: 1200000,
      type: "RENT",
      propertyType: "APARTMENT",
      bedrooms: 2,
      bathrooms: 2,
      area: 85,
      address: "Providencia 1234",
      city: "Providencia",
      images: ["https://www.nocnok.com/hubfs/casa-lujo.webp"],
      amenities: ["Gimnasio", "Portería", "Ascensor"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: "user2",
    },
  ]

  getProperties(filters?: PropertyFilter): Observable<Property[]> {
    let filteredProperties = this.mockProperties.filter((p) => p.isApproved)

    if (filters) {
      if (filters.type) {
        filteredProperties = filteredProperties.filter((p) => p.type === filters.type)
      }
      if (filters.propertyType) {
        filteredProperties = filteredProperties.filter((p) => p.propertyType === filters.propertyType)
      }
      if (filters.minPrice) {
        filteredProperties = filteredProperties.filter((p) => p.price >= filters.minPrice!)
      }
      if (filters.maxPrice) {
        filteredProperties = filteredProperties.filter((p) => p.price <= filters.maxPrice!)
      }
      if (filters.city) {
        filteredProperties = filteredProperties.filter((p) =>
          p.city.toLowerCase().includes(filters.city!.toLowerCase()),
        )
      }
      if (filters.searchText) {
        filteredProperties = filteredProperties.filter(
          (p) =>
            p.title.toLowerCase().includes(filters.searchText!.toLowerCase()) ||
            p.description.toLowerCase().includes(filters.searchText!.toLowerCase()),
        )
      }
    }

    return of(filteredProperties).pipe(delay(500))
  }

  getPropertyById(id: string): Observable<Property | null> {
    const property = this.mockProperties.find((p) => p.id === id && p.isApproved)
    return of(property || null).pipe(delay(300))
  }

  createProperty(property: Partial<Property>): Observable<Property> {
    const newProperty: Property = {
      id: Date.now().toString(),
      title: property.title || "",
      description: property.description || "",
      price: property.price || 0,
      type: property.type || "SALE",
      propertyType: property.propertyType || "HOUSE",
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area || 0,
      address: property.address || "",
      city: property.city || "",
      images: property.images || [],
      amenities: property.amenities || [],
      isApproved: false,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: "current-user",
    }

    return of(newProperty).pipe(delay(1000))
  }

  updateProperty(id: string, property: Partial<Property>): Observable<Property> {
    const existingProperty = this.mockProperties.find((p) => p.id === id)
    if (existingProperty) {
      const updatedProperty = { ...existingProperty, ...property, updatedAt: new Date() }
      return of(updatedProperty).pipe(delay(1000))
    }
    throw new Error("Propiedad no encontrada")
  }

  uploadImages(files: File[]): Observable<string[]> {
    // Simular upload de imágenes
    const urls = files.map((_, index) => `/placeholder.svg?height=400&width=600&text=Imagen${index + 1}`)
    return of(urls).pipe(delay(2000))
  }
}
