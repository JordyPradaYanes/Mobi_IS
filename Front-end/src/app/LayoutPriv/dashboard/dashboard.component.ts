import { CommonModule } from "@angular/common"
import { Component, type OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { FormsModule } from "@angular/forms"

// Importar los componentes existentes
import { PropertyListComponent } from "../property-list/property-list.component"
import { PropertyFormComponent } from "../property-form/property-form.component"

// Importar los nuevos componentes de gestión personal
import { UserPropertiesComponent } from "../user-properties/user-properties.component"
import { UserPurchasesComponent } from "../user-purchases/user-purchases.component"
import { UserRentalsComponent } from "../user-rentals/user-rentals.component"
import { MonthlyBillsComponent } from "../monthly-bills/monthly-bills.component"

// Usar las interfaces actualizadas
import type { Property } from "../../interfaces/property.interface"

interface DashboardStats {
  totalProperties: number
  rentedProperties: number
  soldProperties: number
  availableProperties: number
  totalRevenue: number
  monthlyRevenue: number
  // Nuevas estadísticas
  totalPurchases: number
  activeRentals: number
  pendingBills: number
  monthlyExpenses: number
}

interface UserInfo {
  name: string
  email: string
  avatar: string
  userType: "OWNER" | "TENANT" | "BUYER" | "ADMIN" // Nuevo campo para tipo de usuario
}

type TabType = 
  | "overview"
  | "properties" 
  | "add-property"
  | "analytics"
  | "settings"
  | "my-properties"
  | "my-purchases"
  | "my-rentals"
  | "my-bills";

@Component({
  selector: "app-dashboard",
  imports: [
    CommonModule,
    FormsModule, // Agregado para ngModel
    PropertyListComponent,
    PropertyFormComponent,
    // Nuevos componentes
    UserPropertiesComponent,
    UserPurchasesComponent,
    UserRentalsComponent,
    MonthlyBillsComponent,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {

  colors = {
    primary: '#6366f1', // Color morado para botones y elementos destacados
    textDark: '#1e293b', // Texto principal oscuro
    textLight: '#64748b', // Texto secundario más claro
    backgroundColor: '#eeeeff', // Fondo lila claro
    buttonText: '#ffffff', // Texto blanco para botones
    borderColor: '#e2e8f0' // Color de bordes
  };

  userInfo: UserInfo = {
    name: "Jordy Prada",
    email: "jpradayanes@egmail.com",
    avatar: "https://avatars.githubusercontent.com/u/117767943?v=4",
    userType: "OWNER", // Determina qué tabs mostrar
  }

  stats: DashboardStats = {
    totalProperties: 45,
    rentedProperties: 23,
    soldProperties: 12,
    availableProperties: 10,
    totalRevenue: 1250000000,
    monthlyRevenue: 85000000,
    totalPurchases: 2,
    activeRentals: 1,
    pendingBills: 1,
    monthlyExpenses: 3500000,
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
      listingDate: new Date(),
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
      listingDate: new Date(),
    },
  ]

  // Actualizar tipo de tabs para incluir los nuevos
  activeTab: TabType = "overview"

  isLoading = false
  showPropertyForm = false
  editingProperty: Property | undefined = undefined

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadDashboardData()
    this.updateStats()
  }

  // Métodos de navegación actualizados para incluir nuevos tabs
  setActiveTab(tab: TabType): void {
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

  // Método para determinar qué tabs mostrar según el tipo de usuario
  getAvailableTabs(): TabType[] {
    const baseTabs: TabType[] = ["overview", "analytics", "settings"]

    switch (this.userInfo.userType) {
      case "OWNER":
        return [...baseTabs, "properties", "add-property", "my-properties"]
      case "TENANT":
        return [...baseTabs, "my-rentals", "my-bills"]
      case "BUYER":
        return [...baseTabs, "my-purchases"]
      case "ADMIN":
        return [...baseTabs, "properties", "add-property", "my-properties", "my-purchases", "my-rentals", "my-bills"]
      default:
        return baseTabs
    }
  }

  // Método para obtener el texto del tab
  getTabText(tab: string): string {
    const tabTexts: { [key: string]: string } = {
      overview: "Resumen",
      properties: "Propiedades",
      "add-property": this.isEditMode ? "Editar Propiedad" : "Agregar Propiedad",
      analytics: "Análisis",
      settings: "Configuración",
      "my-properties": "Mis Propiedades",
      "my-purchases": "Mis Compras",
      "my-rentals": "Mis Arriendos",
      "my-bills": "Facturación",
    }
    return tabTexts[tab] || tab
  }

  // Método para obtener el ícono del tab
  getTabIcon(tab: string): string {
    const tabIcons: { [key: string]: string } = {
      overview: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z",
      properties:
        "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      "add-property": "M12 6v6m0 0v6m0-6h6m-6 0H6",
      analytics:
        "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      settings:
        "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      "my-properties": "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11",
      "my-purchases": "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
      "my-rentals":
        "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z",
      "my-bills":
        "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    }
    return tabIcons[tab] || "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  }

  // Métodos existentes mantenidos
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

      this.router.navigate(['/login']);
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

  // Nuevos getters para las estadísticas personales
  get personalStats() {
    return {
      totalPurchases: this.stats.totalPurchases,
      activeRentals: this.stats.activeRentals,
      pendingBills: this.stats.pendingBills,
      monthlyExpenses: this.stats.monthlyExpenses,
      netIncome: this.stats.monthlyRevenue - this.stats.monthlyExpenses,
    }
  }
}