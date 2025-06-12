import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { Subject, takeUntil } from "rxjs"

import { ApprovalService } from "../../services/approval.service"
import type { PropertyWithOwnerInfo } from "../../interfaces/property.interface"
import type { ApprovalStats } from "../../interfaces/approval.interface"

@Component({
  selector: "app-pending-approvals",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./pending-approvals.component.html",
  styleUrls: ["./pending-approvals.component.css"],
})
export class PendingApprovalsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()

  pendingProperties: PropertyWithOwnerInfo[] = []
  filteredProperties: PropertyWithOwnerInfo[] = []
  stats: ApprovalStats = {
    totalPending: 0,
    totalApproved: 0,
    totalRejected: 0,
    averageReviewTime: 0,
    pendingOlderThan24h: 0,
  }

  isLoading = false
  viewMode: "table" | "grid" = "grid"

  // Filtros
  filters = {
    search: "",
    status: "",
    city: "",
    propertyType: "",
    sortBy: "submittedAt",
    sortOrder: "desc" as "asc" | "desc",
  }

  // Paginación
  currentPage = 1
  itemsPerPage = 12
  totalPages = 1

  // Selección múltiple
  selectedProperties: string[] = []
  selectAll = false
Math: any

  constructor(
    private approvalService: ApprovalService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadPendingApprovals()
    this.loadStats()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadPendingApprovals(): void {
    this.isLoading = true

    this.approvalService
      .getPendingApprovals(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (properties: PropertyWithOwnerInfo[]) => {
          this.pendingProperties = properties
          this.applyFiltersAndSort()
          this.isLoading = false
        },
        error: (error) => {
          console.error("Error cargando propiedades pendientes:", error)
          this.isLoading = false
        },
      })
  }

  loadStats(): void {
    this.approvalService
      .getApprovalStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stats = stats
        },
        error: (error) => {
          console.error("Error cargando estadísticas:", error)
        },
      })
  }

  applyFiltersAndSort(): void {
    let filtered = [...this.pendingProperties]

    // Aplicar filtros
    if (this.filters.search) {
      const searchTerm = this.filters.search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm) ||
          (p.ownerName && p.ownerName.toLowerCase().includes(searchTerm)) ||
          p.address.toLowerCase().includes(searchTerm),
      )
    }

    if (this.filters.status) {
      filtered = filtered.filter((p) => p.status === this.filters.status)
    }

    if (this.filters.city) {
      filtered = filtered.filter((p) => p.city.toLowerCase().includes(this.filters.city.toLowerCase()))
    }

    if (this.filters.propertyType) {
      filtered = filtered.filter((p) => p.propertyType === this.filters.propertyType)
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (this.filters.sortBy) {
        case "submittedAt":
          aValue = new Date(a.submittedAt ?? 0).getTime()
          bValue = new Date(b.submittedAt ?? 0).getTime()
          break
        case "price":
          aValue = a.price
          bValue = b.price
          break
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        default:
          aValue = a.submittedAt
          bValue = b.submittedAt
      }

      if (this.filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    this.filteredProperties = filtered
    this.updatePagination()
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProperties.length / this.itemsPerPage)
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1
    }
  }

  get paginatedProperties(): PropertyWithOwnerInfo[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    return this.filteredProperties.slice(startIndex, endIndex)
  }

  onFilterChange(): void {
    this.currentPage = 1
    this.applyFiltersAndSort()
  }

  clearFilters(): void {
    this.filters = {
      search: "",
      status: "",
      city: "",
      propertyType: "",
      sortBy: "submittedAt",
      sortOrder: "desc",
    }
    this.onFilterChange()
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === "table" ? "grid" : "table"
  }

  viewPropertyDetail(propertyId: string): void {
    this.router.navigate(["/admin/approval-detail", propertyId])
  }

  quickApprove(propertyId: string): void {
    const property = this.pendingProperties.find((p) => p.id === propertyId)
    if (property && confirm(`¿Aprobar la propiedad "${property.title}"?`)) {
      this.approvalService
        .approveProperty({
          propertyId,
          action: "APPROVE",
          comments: "Aprobación rápida desde lista",
        })
        .subscribe({
          next: () => {
            this.loadPendingApprovals()
            this.loadStats()
            alert("Propiedad aprobada exitosamente")
          },
          error: (error) => {
            console.error("Error aprobando propiedad:", error)
            alert("Error al aprobar la propiedad")
          },
        })
    }
  }

  quickReject(propertyId: string): void {
    const property = this.pendingProperties.find((p) => p.id === propertyId)
    if (property) {
      const comments = prompt(`Motivo del rechazo para "${property.title}":`)
      if (comments && comments.trim()) {
        this.approvalService
          .approveProperty({
            propertyId,
            action: "REJECT",
            comments: comments.trim(),
          })
          .subscribe({
            next: () => {
              this.loadPendingApprovals()
              this.loadStats()
              alert("Propiedad rechazada")
            },
            error: (error) => {
              console.error("Error rechazando propiedad:", error)
              alert("Error al rechazar la propiedad")
            },
          })
      }
    }
  }

  markAsReviewing(propertyId: string): void {
    const property = this.pendingProperties.find((p) => p.id === propertyId)
    if (property) {
      property.status = "UNDER_REVIEW"
      alert('Propiedad marcada como "En revisión"')
    }
  }

  togglePropertySelection(propertyId: string): void {
    const index = this.selectedProperties.indexOf(propertyId)
    if (index > -1) {
      this.selectedProperties.splice(index, 1)
    } else {
      this.selectedProperties.push(propertyId)
    }
    this.updateSelectAllState()
  }

  toggleSelectAll(): void {
    if (this.selectAll) {
      this.selectedProperties = this.paginatedProperties.map((p) => p.id)
    } else {
      this.selectedProperties = []
    }
  }

  updateSelectAllState(): void {
    const currentPageIds = this.paginatedProperties.map((p) => p.id)
    this.selectAll = currentPageIds.length > 0 && currentPageIds.every((id) => this.selectedProperties.includes(id))
  }

  batchApprove(): void {
    if (this.selectedProperties.length === 0) return

    if (confirm(`¿Aprobar ${this.selectedProperties.length} propiedades seleccionadas?`)) {
      // Implementar aprobación en lote
      console.log("Aprobando propiedades:", this.selectedProperties)
    }
  }

  batchReject(): void {
    if (this.selectedProperties.length === 0) return

    const comments = prompt(`Motivo del rechazo para ${this.selectedProperties.length} propiedades:`)
    if (comments && comments.trim()) {
      // Implementar rechazo en lote
      console.log("Rechazando propiedades:", this.selectedProperties, "Motivo:", comments)
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page
      this.selectedProperties = []
      this.selectAll = false
    }
  }

  getStatusBadgeClass(status: string): string {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"

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
        return "Pendiente"
      case "UNDER_REVIEW":
        return "En Revisión"
      case "APPROVED":
        return "Aprobado"
      case "REJECTED":
        return "Rechazado"
      default:
        return status
    }
  }

  getTypeText(type: string): string {
    return type === "RENT" ? "Alquiler" : "Venta"
  }

  getPropertyTypeText(type: string): string {
    switch (type) {
      case "HOUSE":
        return "Casa"
      case "APARTMENT":
        return "Apartamento"
      case "OFFICE":
        return "Oficina"
      case "LAND":
        return "Terreno"
      default:
        return type
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

  getTimePending(submittedAt?: Date): string {
    if (!submittedAt) return "N/A"

    const now = new Date()
    const submitted = new Date(submittedAt)
    const diffInHours = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours}h`
    } else {
      const days = Math.floor(diffInHours / 24)
      return `${days}d`
    }
  }

  getPriorityClass(submittedAt?: Date): string {
    if (!submittedAt) return ""

    const now = new Date()
    const submitted = new Date(submittedAt)
    const diffInHours = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60))

    if (diffInHours >= 48) {
      return "border-l-4 border-red-500 bg-red-50"
    } else if (diffInHours >= 24) {
      return "border-l-4 border-yellow-500 bg-yellow-50"
    }
    return ""
  }
}
