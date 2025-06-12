import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { Subject, takeUntil } from "rxjs"

import { ApprovalService } from "../../services/approval.service"
import type { Property } from "../../interfaces/property.interface"
import type { ApprovalRecord } from "../../interfaces/approval.interface"

@Component({
  selector: "app-approval-status",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./approval-status.component.html",
  styleUrls: ["./approval-status.component.css"],
})
export class ApprovalStatusComponent implements OnInit, OnDestroy {
[x: string]: any
  private destroy$ = new Subject<void>()

  userProperties: Property[] = []
  filteredProperties: Property[] = []
  selectedProperty: Property | null = null
  approvalTimeline: ApprovalRecord[] = []

  isLoading = false
  showTimelineModal = false

  // Filtros
  statusFilter = ""

  // Datos del usuario (normalmente vendrían de un servicio de autenticación)
  currentUserId = "user1"

  constructor(
    private approvalService: ApprovalService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadUserProperties()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadUserProperties(): void {
    this.isLoading = true

    this.approvalService
      .getUserPropertyStatus(this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (properties) => {
          this.userProperties = properties
          this.applyFilters()
          this.isLoading = false
        },
        error: (error) => {
          console.error("Error cargando propiedades del usuario:", error)
          this.isLoading = false
        },
      })
  }

  applyFilters(): void {
    this.filteredProperties = this.userProperties.filter((property) => {
      if (this.statusFilter && property.status !== this.statusFilter) {
        return false
      }
      return true
    })
  }

  onFilterChange(): void {
    this.applyFilters()
  }

  clearFilters(): void {
    this.statusFilter = ""
    this.applyFilters()
  }

  viewTimeline(property: Property): void {
    this.selectedProperty = property
    this.loadApprovalTimeline(property.id)
    this.showTimelineModal = true
  }

  loadApprovalTimeline(propertyId: string): void {
    this.approvalService
      .getApprovalTimeline(propertyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (timeline) => {
          this.approvalTimeline = timeline
        },
        error: (error) => {
          console.error("Error cargando timeline:", error)
        },
      })
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false
    this.selectedProperty = null
    this.approvalTimeline = []
  }

  editProperty(propertyId: string): void {
    this.router.navigate(["/propiedades/editar", propertyId])
  }

  resubmitProperty(propertyId: string): void {
    const property = this.userProperties.find((p) => p.id === propertyId)
    if (property && confirm(`¿Reenviar "${property.title}" para revisión?`)) {
      this.approvalService.resubmitProperty(propertyId).subscribe({
        next: () => {
          this.loadUserProperties()
          alert("Propiedad reenviada para revisión")
        },
        error: (error) => {
          console.error("Error reenviando propiedad:", error)
          alert("Error al reenviar la propiedad")
        },
      })
    }
  }

  cancelSubmission(propertyId: string): void {
    const property = this.userProperties.find((p) => p.id === propertyId)
    if (property && confirm(`¿Cancelar el envío de "${property.title}"?`)) {
      // Implementar cancelación
      console.log("Cancelando envío de propiedad:", propertyId)
    }
  }

  getStatusBadgeClass(status: string): string {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium"

    switch (status) {
      case "PENDING":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "UNDER_REVIEW":
        return `${baseClasses} bg-blue-100 text-blue-800`
      case "APPROVED":
        return `${baseClasses} bg-green-100 text-green-800`
      case "REJECTED":
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case "PENDING":
        return "Pendiente de Revisión"
      case "UNDER_REVIEW":
        return "En Revisión"
      case "APPROVED":
        return "Aprobada"
      case "REJECTED":
        return "Rechazada"
      default:
        return status
    }
  }

  getStatusDescription(status: string): string {
    switch (status) {
      case "PENDING":
        return "Tu propiedad está en la cola de revisión. Tiempo estimado: 24-48 horas."
      case "UNDER_REVIEW":
        return "Un administrador está revisando tu propiedad actualmente."
      case "APPROVED":
        return "¡Felicitaciones! Tu propiedad ha sido aprobada y está visible públicamente."
      case "REJECTED":
        return "Tu propiedad fue rechazada. Revisa los comentarios y realiza las correcciones necesarias."
      default:
        return ""
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case "PENDING":
        return "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      case "UNDER_REVIEW":
        return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      case "APPROVED":
        return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      case "REJECTED":
        return "M6 18L18 6M6 6l12 12"
      default:
        return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    }
  }

  getAvailableActions(status: string): string[] {
    switch (status) {
      case "PENDING":
        return ["cancel"]
      case "UNDER_REVIEW":
        return []
      case "APPROVED":
        return ["edit"]
      case "REJECTED":
        return ["edit", "resubmit"]
      default:
        return []
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  getTimeSince(date: Date): string {
    const now = new Date()
    const past = new Date(date)
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `hace ${diffInHours} horas`
    } else {
      const days = Math.floor(diffInHours / 24)
      return `hace ${days} días`
    }
  }

  get statusCounts() {
    return {
      pending: this.userProperties.filter((p) => p.status === "PENDING").length,
      underReview: this.userProperties.filter((p) => p.status === "UNDER_REVIEW").length,
      approved: this.userProperties.filter((p) => p.status === "APPROVED").length,
      rejected: this.userProperties.filter((p) => p.status === "REJECTED").length,
    }
  }
}