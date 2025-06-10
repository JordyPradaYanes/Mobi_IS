import { CommonModule } from "@angular/common"
import { Component, type OnInit } from "@angular/core"
import { Router } from "@angular/router"

// Importar los nuevos componentes
import { PropertyListComponent } from "../property-list/property-list.component"
import { PropertyFormComponent } from "../property-form/property-form.component"

// Usar las interfaces actualizadas
import type { Property } from "../../interfaces/property.interface"

interface DashboardStats {
  totalProperties: number
  rentedProperties: number
  soldProperties: number
  availableProperties: number
  totalRevenue: number
  monthlyRevenue: number
}

interface UserInfo {
  name: string
  email: string
  avatar: string
}

@Component({
  selector: "app-dashboard",
  imports: [CommonModule, PropertyListComponent, PropertyFormComponent],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  userInfo: UserInfo = {
    name: "Usuario Demo",
    email: "usuario@ejemplo.com",
    avatar: "https://ui-avatars.com/api/?name=Usuario+Demo&background=6366f1&color=fff",
  }

  stats: DashboardStats = {
    totalProperties: 45,
    rentedProperties: 23,
    soldProperties: 12,
    availableProperties: 10,
    totalRevenue: 1250000000,
    monthlyRevenue: 85000000,
  }

  recentProperties: Property[] = [
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
      isApproved: true,
      createdAt: new Date("2024-06-01"),
      updatedAt: new Date("2024-06-01"),
      ownerId: "user1",
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
      status: "APPROVED",
      bedrooms: 2,
      bathrooms: 1,
      area: 80,
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"],
      amenities: ["Gimnasio", "Portería", "Ascensor"],
      isApproved: true,
      createdAt: new Date("2024-06-05"),
      updatedAt: new Date("2024-06-05"),
      ownerId: "user2",
    },
  ]

  activeTab: "overview" | "properties" | "add-property" | "analytics" | "settings" = "overview"
  isLoading = false
  showPropertyForm = false
  editingProperty: Property | undefined = undefined

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadDashboardData()
    this.updateStats()
  }

  // Métodos de navegación actualizados
  setActiveTab(tab: "overview" | "properties" | "add-property" | "analytics" | "settings"): void {
    this.activeTab = tab

    // Resetear estados del formulario cuando cambiamos de tab
    if (tab !== "add-property") {
      this.showPropertyForm = false
      this.editingProperty = undefined
    }

    console.log(`Navegando a la pestaña: ${tab}`)
  }

  getTabClass(tab: string): string {
    const baseClasses = "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
    const activeClasses = "border-indigo-500 text-indigo-600"
    const inactiveClasses = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"

    return `${baseClasses} ${this.activeTab === tab ? activeClasses : inactiveClasses}`
  }

  // Métodos actualizados para integración con nuevos componentes
  loadDashboardData(): void {
    this.isLoading = true
    console.log("Cargando datos del dashboard...")

    // Simular llamada a API
    setTimeout(() => {
      this.isLoading = false
      console.log("Datos cargados exitosamente")
    }, 1000)
  }

  updateStats(): void {
    // Actualizar estadísticas basadas en las propiedades actuales
    const total = this.recentProperties.length
    const rented = this.recentProperties.filter((p) => p.status === "RENTED").length
    const sold = this.recentProperties.filter((p) => p.status === "SOLD").length
    const available = this.recentProperties.filter((p) => p.status === "APPROVED").length

    this.stats = {
      ...this.stats,
      totalProperties: total,
      rentedProperties: rented,
      soldProperties: sold,
      availableProperties: available,
    }
  }

  // Métodos de formato actualizados
  getStatusBadgeClass(status: string): string {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"

    switch (status) {
      case "APPROVED":
        return `${baseClasses} bg-green-100 text-green-800`
      case "RENTED":
        return `${baseClasses} bg-blue-100 text-blue-800`
      case "SOLD":
        return `${baseClasses} bg-gray-100 text-gray-800`
      case "PENDING":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "REJECTED":
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case "APPROVED":
        return "Disponible"
      case "RENTED":
        return "Alquilado"
      case "SOLD":
        return "Vendido"
      case "PENDING":
        return "Pendiente"
      case "REJECTED":
        return "Rechazado"
      default:
        return status
    }
  }

  getTypeText(type: string): string {
    return type === "RENT" ? "Alquiler" : "Venta"
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  getOccupancyRate(): number {
    if (this.stats.totalProperties === 0) return 0
    return Math.round((this.stats.rentedProperties / this.stats.totalProperties) * 100)
  }

  getAveragePrice(): number {
    if (this.recentProperties.length === 0) return 0
    const total = this.recentProperties.reduce((sum, property) => sum + property.price, 0)
    return Math.round(total / this.recentProperties.length)
  }

  // Métodos actualizados para trabajar con los nuevos componentes
  addNewProperty(): void {
    console.log("Abriendo formulario para agregar nueva propiedad...")
    this.editingProperty = undefined
    this.setActiveTab("add-property")
  }

  editProperty(propertyId: string): void {
    console.log("Editando propiedad con ID:", propertyId)

    const property = this.recentProperties.find((p) => p.id === propertyId)
    if (property) {
      console.log("Propiedad encontrada:", property)
      this.editingProperty = property
      this.setActiveTab("add-property")
    }
  }

  deleteProperty(propertyId: string): void {
    console.log("Intentando eliminar propiedad con ID:", propertyId)

    const property = this.recentProperties.find((p) => p.id === propertyId)
    if (property) {
      const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar "${property.title}"?`)

      if (confirmDelete) {
        this.recentProperties = this.recentProperties.filter((p) => p.id !== propertyId)
        this.updateStats()
        console.log("Propiedad eliminada exitosamente")
      }
    }
  }

  // Método para navegar a los detalles de una propiedad
  viewPropertyDetails(propertyId: string): void {
    this.router.navigate(["/propiedades", propertyId])
  }

  // Método para manejar cuando se guarda una propiedad desde el formulario
  onPropertySaved(property: Property): void {
    if (this.editingProperty) {
      // Actualizar propiedad existente
      const index = this.recentProperties.findIndex((p) => p.id === this.editingProperty!.id)
      if (index !== -1) {
        this.recentProperties[index] = property
      }
    } else {
      // Agregar nueva propiedad
      this.recentProperties.unshift(property)
    }

    this.updateStats()
    this.setActiveTab("properties")

    // Mostrar mensaje de éxito
    const message = this.editingProperty ? "Propiedad actualizada exitosamente" : "Propiedad creada exitosamente"
    alert(message)
  }

  // Método para cancelar la edición/creación
  onPropertyFormCancel(): void {
    this.setActiveTab("properties")
    this.editingProperty = undefined
  }

  // Métodos existentes mantenidos
  logout(): void {
    console.log("Cerrando sesión...")

    const confirmLogout = confirm("¿Estás seguro de que deseas cerrar sesión?")
    if (confirmLogout) {
      localStorage.removeItem("authToken")
      localStorage.removeItem("userInfo")

      console.log("Sesión cerrada exitosamente")
      alert("Sesión cerrada. Redirigiendo al login...")

      // this.router.navigate(['/login']);
    }
  }

  saveSettings(): void {
    console.log("Guardando configuración...")

    this.isLoading = true

    setTimeout(() => {
      this.isLoading = false
      console.log("Configuración guardada exitosamente")
      alert("Configuración guardada exitosamente")
    }, 1000)
  }

  refreshData(): void {
    console.log("Refrescando datos del dashboard...")
    this.loadDashboardData()
  }

  handleApiError(error: any): void {
    console.error("Error en la API:", error)
    alert("Ha ocurrido un error. Por favor, intenta nuevamente.")
  }

  exportData(): void {
    console.log("Exportando datos...")

    const dataToExport = {
      stats: this.stats,
      properties: this.recentProperties,
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `dashboard-data-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    console.log("Datos exportados exitosamente")
  }

  // Getters actualizados
  get totalProperties(): number {
    return this.stats.totalProperties
  }

  get isDataLoaded(): boolean {
    return !this.isLoading && this.recentProperties.length > 0
  }

  get hasProperties(): boolean {
    return this.recentProperties.length > 0
  }

  get isEditMode(): boolean {
    return !!this.editingProperty
  }
}
