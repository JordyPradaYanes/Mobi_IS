import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { Subject, takeUntil } from "rxjs"

import { RentalService } from "../../services/rental.service"
import type { Rental, MaintenanceRequest, RentalEvaluation } from "../../interfaces/user-dashboard.interface"

@Component({
  selector: "app-user-rentals",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./user-rentals.component.html",
  styleUrls: ["./user-rentals.component.css"],
})
export class UserRentalsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()

  rentals: Rental[] = []
  filteredRentals: Rental[] = []
  maintenanceRequests: MaintenanceRequest[] = []

  selectedRental: Rental | null = null
  showMaintenanceModal = false
  showEvaluationModal = false
  showRenewalModal = false

  maintenanceForm: FormGroup
  evaluationForm: FormGroup

  isLoading = false
  activeTab: "active" | "history" | "maintenance" = "active"

  // Filtros
  filters = {
    status: "",
    search: "",
  }

  // Datos del usuario actual
  currentUserId = "user1"

  constructor(
    private rentalService: RentalService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.maintenanceForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(5)]],
      description: ["", [Validators.required, Validators.minLength(10)]],
      priority: ["MEDIUM", Validators.required],
    })

    this.evaluationForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      propertyCondition: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      landlordRating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      neighborhoodRating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comments: ["", Validators.required],
      wouldRecommend: [true],
    })
  }

  ngOnInit(): void {
    this.loadUserRentals()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadUserRentals(): void {
    this.isLoading = true

    this.rentalService
      .getUserRentals(this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rentals) => {
          this.rentals = rentals
          this.applyFilters()
          this.isLoading = false
        },
        error: (error) => {
          console.error("Error cargando arriendos del usuario:", error)
          this.isLoading = false
        },
      })
  }

  loadMaintenanceRequests(rentalId: string): void {
    this.rentalService.getMaintenanceRequests(rentalId).subscribe({
      next: (requests) => {
        this.maintenanceRequests = requests
      },
      error: (error) => {
        console.error("Error cargando solicitudes de mantenimiento:", error)
      },
    })
  }

  setActiveTab(tab: "active" | "history" | "maintenance"): void {
    this.activeTab = tab
    if (tab === "maintenance") {
      // Cargar solicitudes de mantenimiento de todos los arriendos activos
      const activeRentals = this.rentals.filter((r) => r.status === "ACTIVE")
      if (activeRentals.length > 0) {
        this.loadMaintenanceRequests(activeRentals[0].id)
      }
    }
    this.applyFilters()
  }

  applyFilters(): void {
    let filtered = [...this.rentals]

    // Filtrar por tab activo
    switch (this.activeTab) {
      case "active":
        filtered = filtered.filter((r) => r.status === "ACTIVE")
        break
      case "history":
        filtered = filtered.filter((r) => r.status !== "ACTIVE")
        break
    }

    if (this.filters.status) {
      filtered = filtered.filter((r) => r.status === this.filters.status)
    }

    if (this.filters.search) {
      const searchTerm = this.filters.search.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.property.title.toLowerCase().includes(searchTerm) ||
          r.property.address.toLowerCase().includes(searchTerm) ||
          r.property.city.toLowerCase().includes(searchTerm),
      )
    }

    this.filteredRentals = filtered
  }

  onFilterChange(): void {
    this.applyFilters()
  }

  clearFilters(): void {
    this.filters = {
      status: "",
      search: "",
    }
    this.applyFilters()
  }

  openMaintenanceModal(rental: Rental): void {
    this.selectedRental = rental
    this.maintenanceForm.reset({
      title: "",
      description: "",
      priority: "MEDIUM",
    })
    this.showMaintenanceModal = true
  }

  closeMaintenanceModal(): void {
    this.showMaintenanceModal = false
    this.selectedRental = null
  }

  submitMaintenanceRequest(): void {
    if (this.maintenanceForm.invalid || !this.selectedRental) return

    const formValue = this.maintenanceForm.value
    const request: MaintenanceRequest = {
      id: "",
      rentalId: this.selectedRental.id,
      title: formValue.title,
      description: formValue.description,
      priority: formValue.priority,
      status: "PENDING",
      requestDate: new Date(),
    }

    this.rentalService.submitMaintenanceRequest(request).subscribe({
      next: (newRequest) => {
        this.maintenanceRequests.unshift(newRequest)
        this.closeMaintenanceModal()
        alert("Solicitud de mantenimiento enviada exitosamente")
      },
      error: (error) => {
        console.error("Error enviando solicitud:", error)
        alert("Error al enviar la solicitud")
      },
    })
  }

  openEvaluationModal(rental: Rental): void {
    this.selectedRental = rental
    this.evaluationForm.reset({
      rating: 5,
      propertyCondition: 5,
      landlordRating: 5,
      neighborhoodRating: 5,
      comments: "",
      wouldRecommend: true,
    })
    this.showEvaluationModal = true
  }

  closeEvaluationModal(): void {
    this.showEvaluationModal = false
    this.selectedRental = null
  }

  submitEvaluation(): void {
    if (this.evaluationForm.invalid || !this.selectedRental) return

    const formValue = this.evaluationForm.value
    const evaluation: RentalEvaluation = {
      id: "",
      rentalId: this.selectedRental.id,
      rating: formValue.rating,
      propertyCondition: formValue.propertyCondition,
      landlordRating: formValue.landlordRating,
      neighborhoodRating: formValue.neighborhoodRating,
      comments: formValue.comments,
      wouldRecommend: formValue.wouldRecommend,
      evaluationDate: new Date(),
    }

    this.rentalService.evaluateRental(this.selectedRental.id, evaluation).subscribe({
      next: () => {
        this.closeEvaluationModal()
        alert("Evaluación enviada exitosamente")
      },
      error: (error) => {
        console.error("Error enviando evaluación:", error)
        alert("Error al enviar la evaluación")
      },
    })
  }

  openRenewalModal(rental: Rental): void {
    this.selectedRental = rental
    this.showRenewalModal = true
  }

  closeRenewalModal(): void {
    this.showRenewalModal = false
    this.selectedRental = null
  }

  renewRental(): void {
    if (!this.selectedRental) return

    if (confirm(`¿Deseas renovar el contrato de "${this.selectedRental.property.title}"?`)) {
      this.rentalService.renewRental(this.selectedRental.id).subscribe({
        next: (renewedRental) => {
          const index = this.rentals.findIndex((r) => r.id === renewedRental.id)
          if (index !== -1) {
            this.rentals[index] = renewedRental
            this.applyFilters()
          }
          this.closeRenewalModal()
          alert("Solicitud de renovación enviada exitosamente")
        },
        error: (error) => {
          console.error("Error renovando contrato:", error)
          alert("Error al renovar el contrato")
        },
      })
    }
  }

  getStatusBadgeClass(status: string): string {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium"

    switch (status) {
      case "ACTIVE":
        return `${baseClasses} bg-green-100 text-green-800`
      case "PENDING":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "EXPIRED":
        return `${baseClasses} bg-gray-100 text-gray-800`
      case "TERMINATED":
        return `${baseClasses} bg-red-100 text-red-800`
      case "RENEWED":
        return `${baseClasses} bg-blue-100 text-blue-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case "ACTIVE":
        return "Activo"
      case "PENDING":
        return "Pendiente"
      case "EXPIRED":
        return "Expirado"
      case "TERMINATED":
        return "Terminado"
      case "RENEWED":
        return "Renovado"
      default:
        return status
    }
  }

  getPriorityBadgeClass(priority: string): string {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"

    switch (priority) {
      case "LOW":
        return `${baseClasses} bg-gray-100 text-gray-800`
      case "MEDIUM":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "HIGH":
        return `${baseClasses} bg-orange-100 text-orange-800`
      case "URGENT":
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  getPriorityText(priority: string): string {
    switch (priority) {
      case "LOW":
        return "Baja"
      case "MEDIUM":
        return "Media"
      case "HIGH":
        return "Alta"
      case "URGENT":
        return "Urgente"
      default:
        return priority
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date))
  }

  getDaysUntilExpiry(endDate: Date): number {
    const now = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  get rentalsByTab() {
    return {
      active: this.rentals.filter((r) => r.status === "ACTIVE").length,
      history: this.rentals.filter((r) => r.status !== "ACTIVE").length,
      maintenance: this.maintenanceRequests.length,
    }
  }
}
