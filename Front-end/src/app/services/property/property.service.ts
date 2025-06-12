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
      listingDate: new Date()
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
      listingDate: new Date()
    },
    {
      id: "3",
      title: "Penthouse de Lujo",
      description: "Espectacular penthouse con vista panorámica de 360 grados y acabados premium.",
      price: 850000000,
      type: "SALE",
      propertyType: "APARTMENT",
      bedrooms: 3,
      bathrooms: 3,
      area: 220,
      address: "Torre Mirador Piso 20",
      city: "Vitacura",
      images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop"],
      amenities: ["Jacuzzi", "Terraza privada", "Bodega", "2 Estacionamientos", "Gimnasio"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      ownerId: "user3",
      listingDate: new Date("2024-01-15")
    },
    {
      id: "4",
      title: "Casa Familiar en Ñuñoa",
      description: "Acogedora casa familiar con amplio jardín, perfecta para niños.",
      price: 280000000,
      type: "SALE",
      propertyType: "HOUSE",
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
      address: "Ñuñoa 4567",
      city: "Ñuñoa",
      images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop"],
      amenities: ["Jardín", "Quincho", "Garaje", "Patio trasero"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-01"),
      ownerId: "user4",
      listingDate: new Date("2024-02-01")
    },
    {
      id: "5",
      title: "Estudio en Providencia",
      description: "Moderno estudio completamente amoblado, ideal para profesionales jóvenes.",
      price: 800000,
      type: "RENT",
      propertyType: "APARTMENT",
      bedrooms: 1,
      bathrooms: 1,
      area: 45,
      address: "Providencia 890",
      city: "Providencia",
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop"],
      amenities: ["Amoblado", "WiFi", "Cocina equipada", "Seguridad 24h"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date("2024-03-10"),
      updatedAt: new Date("2024-03-10"),
      ownerId: "user5",
      listingDate: new Date("2024-03-10")
    },
    {
      id: "6",
      title: "Casa Campestre en Pirque",
      description: "Hermosa casa campestre con vistas a la cordillera y amplio terreno.",
      price: 380000000,
      type: "SALE",
      propertyType: "HOUSE",
      bedrooms: 4,
      bathrooms: 3,
      area: 320,
      address: "Parcela 15, Pirque",
      city: "Pirque",
      images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop"],
      amenities: ["Piscina", "Quincho", "Caballerizas", "Pozo", "Jardín de 2000m²"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date("2023-12-05"),
      updatedAt: new Date("2023-12-05"),
      ownerId: "user6",
      listingDate: new Date("2023-12-05")
    },
    {
      id: "7",
      title: "Departamento en Condominio",
      description: "Departamento en exclusivo condominio con múltiples amenities.",
      price: 1800000,
      type: "RENT",
      propertyType: "APARTMENT",
      bedrooms: 3,
      bathrooms: 2,
      area: 95,
      address: "Condominio El Bosque",
      city: "Las Condes",
      images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop"],
      amenities: ["Piscina", "Cancha de tenis", "Sala de eventos", "Playground", "Gimnasio"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date("2024-04-20"),
      updatedAt: new Date("2024-04-20"),
      ownerId: "user7",
      listingDate: new Date("2024-04-20")
    },
    {
      id: "8",
      title: "Loft Industrial en Barrio Italia",
      description: "Único loft de estilo industrial con techos altos y diseño contemporáneo.",
      price: 350000000,
      type: "SALE",
      propertyType: "APARTMENT",
      bedrooms: 2,
      bathrooms: 2,
      area: 120,
      address: "Barrio Italia 123",
      city: "Ñuñoa",
      images: ["https://i.pinimg.com/564x/07/e9/ae/07e9ae27c9b9d4582cab297a63968db5.jpg"],
      amenities: ["Techos altos", "Ventanales", "Terraza", "Bodega", "Estacionamiento"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date("2024-01-25"),
      updatedAt: new Date("2024-01-25"),
      ownerId: "user8",
      listingDate: new Date("2024-01-25")
    },
    {
      id: "9",
      title: "Casa con Piscina en Macul",
      description: "Espaciosa casa familiar con piscina y amplio jardín.",
      price: 2200000,
      type: "RENT",
      propertyType: "HOUSE",
      bedrooms: 4,
      bathrooms: 3,
      area: 180,
      address: "Macul 5678",
      city: "Macul",
      images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop"],
      amenities: ["Piscina", "Jardín", "BBQ", "Garaje doble", "Bodega"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date("2024-05-15"),
      updatedAt: new Date("2024-05-15"),
      ownerId: "user9",
      listingDate: new Date("2024-05-15")
    },
    {
      id: "10",
      title: "Departamento Nuevo en San Miguel",
      description: "Departamento a estrenar con acabados modernos y excelente ubicación.",
      price: 180000000,
      type: "SALE",
      propertyType: "APARTMENT",
      bedrooms: 2,
      bathrooms: 2,
      area: 70,
      address: "San Miguel 456",
      city: "San Miguel",
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop"],
      amenities: ["Terraza", "Bodega", "Estacionamiento", "Portería"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date("2024-06-01"),
      updatedAt: new Date("2024-06-01"),
      ownerId: "user10",
      listingDate: new Date("2024-06-01")
    },
    {
      id: "11",
      title: "Casa de Playa en Viña del Mar",
      description: "Hermosa casa a solo 2 cuadras de la playa con vista al mar.",
      price: 520000000,
      type: "SALE",
      propertyType: "HOUSE",
      bedrooms: 5,
      bathrooms: 4,
      area: 250,
      address: "Viña del Mar 789",
      city: "Viña del Mar",
      images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop"],
      amenities: ["Vista al mar", "Terraza", "Jardín", "Quincho", "Garaje"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date("2023-11-10"),
      updatedAt: new Date("2023-11-10"),
      ownerId: "user11",
      listingDate: new Date("2023-11-10")
    },
    {
      id: "12",
      title: "Oficina Comercial Centro",
      description: "Moderna oficina en el centro financiero, ideal para empresas.",
      price: 2500000,
      type: "RENT",
      propertyType: "OFFICE",
      bedrooms: 0,
      bathrooms: 2,
      area: 120,
      address: "Moneda 1234",
      city: "Santiago Centro",
      images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop"],
      amenities: ["Recepción", "Sala de reuniones", "Estacionamiento", "Seguridad 24h"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date("2024-03-01"),
      updatedAt: new Date("2024-03-01"),
      ownerId: "user12",
      listingDate: new Date("2024-03-01")
    },
    {
      id: "13",
      title: "Departamento Estudiantes",
      description: "Departamento económico perfecto para estudiantes universitarios.",
      price: 600000,
      type: "RENT",
      propertyType: "APARTMENT",
      bedrooms: 2,
      bathrooms: 1,
      area: 55,
      address: "Republica 567",
      city: "Santiago Centro",
      images: ["https://i.pinimg.com/736x/6d/ed/b1/6dedb1d9ba29c4919b9650a023e5a432.jpg"],
      amenities: ["Cerca universidades", "Internet", "Lavandería", "Cocina equipada"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2024-02-15"),
      ownerId: "user13",
      listingDate: new Date("2024-02-15")
    },
    {
      id: "14",
      title: "Casa en Condominio Cerrado",
      description: "Exclusiva casa en condominio privado con máxima seguridad.",
      price: 650000000,
      type: "SALE",
      propertyType: "HOUSE",
      bedrooms: 4,
      bathrooms: 4,
      area: 300,
      address: "Condominio Los Almendros",
      city: "Lo Barnechea",
      images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop"],
      amenities: ["Seguridad 24h", "Piscina", "Cancha de tenis", "Sala de eventos", "Playground"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date("2023-10-20"),
      updatedAt: new Date("2023-10-20"),
      ownerId: "user14",
      listingDate: new Date("2023-10-20")
    },
    {
      id: "15",
      title: "Duplex Moderno en Maipú",
      description: "Amplio duplex con diseño contemporáneo y excelente distribución.",
      price: 320000000,
      type: "SALE",
      propertyType: "HOUSE",
      bedrooms: 3,
      bathrooms: 3,
      area: 140,
      address: "Maipú 890",
      city: "Maipú",
      images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop"],
      amenities: ["Doble altura", "Terraza", "Patio", "Estacionamiento", "Bodega"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date("2024-04-05"),
      updatedAt: new Date("2024-04-05"),
      ownerId: "user15",
      listingDate: new Date("2024-04-05")
    },
    {
      id: "16",
      title: "Local Comercial en Plaza",
      description: "Excelente local comercial en plaza de alto tráfico peatonal.",
      price: 1800000,
      type: "RENT",
      propertyType: "OFFICE",
      bedrooms: 0,
      bathrooms: 1,
      area: 80,
      address: "Plaza Baquedano",
      city: "Providencia",
      images: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"],
      amenities: ["Vitrina", "Bodega", "Alto tráfico", "Acceso independiente"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date("2024-05-01"),
      updatedAt: new Date("2024-05-01"),
      ownerId: "user16",
      listingDate: new Date("2024-05-01")
    },
    {
      id: "17",
      title: "Casa Patrimonial Restaurada",
      description: "Hermosa casa patrimonial completamente restaurada con detalles originales.",
      price: 480000000,
      type: "SALE",
      propertyType: "HOUSE",
      bedrooms: 4,
      bathrooms: 3,
      area: 200,
      address: "Barrio Yungay 345",
      city: "Santiago Centro",
      images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop"],
      amenities: ["Valor patrimonial", "Jardín interior", "Techos altos", "Parquet original"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date("2023-09-15"),
      updatedAt: new Date("2023-09-15"),
      ownerId: "user17",
      listingDate: new Date("2023-09-15")
    },
    {
      id: "18",
      title: "Departamento con Terraza",
      description: "Moderno departamento con amplia terraza y vista despejada.",
      price: 1500000,
      type: "RENT",
      propertyType: "APARTMENT",
      bedrooms: 2,
      bathrooms: 2,
      area: 90,
      address: "Ñuñoa 123",
      city: "Ñuñoa",
      images: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop"],
      amenities: ["Terraza 30m²", "Parrilla", "Vista despejada", "Estacionamiento"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date("2024-03-25"),
      updatedAt: new Date("2024-03-25"),
      ownerId: "user18",
      listingDate: new Date("2024-03-25")
    },
    {
      id: "19",
      title: "Casa con Quincho en Puente Alto",
      description: "Amplia casa familiar con quincho equipado y jardín maduro.",
      price: 290000000,
      type: "SALE",
      propertyType: "HOUSE",
      bedrooms: 3,
      bathrooms: 2,
      area: 160,
      address: "Puente Alto 678",
      city: "Puente Alto",
      images: ["https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=600&h=400&fit=crop"],
      amenities: ["Quincho equipado", "Jardín maduro", "Garaje", "Bodega", "Patio trasero"],
      isApproved: true,
      status: "APPROVED",
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-10"),
      ownerId: "user19",
      listingDate: new Date("2024-01-10")
    },
    {
      id: "20",
      title: "Penthouse en Construcción",
      description: "Exclusivo penthouse en pre-venta con entrega programada para 2025.",
      price: 920000000,
      type: "SALE",
      propertyType: "APARTMENT",
      bedrooms: 4,
      bathrooms: 4,
      area: 280,
      address: "Proyecto Torre Vista",
      city: "Las Condes",
      images: ["https://images.unsplash.com/photo-1515263487990-61b07816b643?w=600&h=400&fit=crop"],
      amenities: ["Terraza 80m²", "Jacuzzi", "Gimnasio", "Pool", "Concierge"],
      isApproved: false,
      status: "PENDING",
      createdAt: new Date("2024-06-10"),
      updatedAt: new Date("2024-06-10"),
      ownerId: "user20",
      listingDate: new Date("2024-06-10")
    }
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
      listingDate: new Date()
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