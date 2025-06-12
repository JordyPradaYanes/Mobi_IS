import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { Subject, takeUntil } from "rxjs"

import { ApprovalService } from "../../services/approval.service"
import type { PropertyWithOwnerInfo } from "../../interfaces/property.interface"
import type { ApprovalRecord } from "../../interfaces/approval.interface"

@Component({
  selector: "app-approval-detail",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./approval-detail.component.html",
  styleUrls: ["./approval-detail.component.css"],
})
export class ApprovalDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()

  property: PropertyWithOwnerInfo | null = null
  approvalHistory: ApprovalRecord[] = []
  approvalForm: FormGroup

  isLoading = false
  isSubmitting = false
  selectedImageIndex = 0
  showApprovalModal = false
  approvalAction: "APPROVE" | "REJECT" | "REQUEST_CHANGES" = "APPROVE"

  // Checklist de revisión
  reviewChecklist = {
    hasImages: false,
    hasDescription: false,
    hasPrice: false,
    hasLocation: false,
    hasContact: false,
    priceReasonable: false,
    imagesQuality: false,
    informationComplete: false,
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private approvalService: ApprovalService,
    private fb: FormBuilder,
  ) {
    this.approvalForm = this.fb.group({
      action: ["APPROVE", Validators.required],
      comments: [""],
      adminNotes: [""],
      requestedChanges: [[]],
    })
  }

  ngOnInit(): void {
    const propertyId = this.route.snapshot.paramMap.get("id")
    if (propertyId) {
      this.loadPropertyDetail(propertyId)
      this.loadApprovalHistory(propertyId)
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadPropertyDetail(propertyId: string): void {
    this.isLoading = true

    this.approvalService
      .getPropertyForReview(propertyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (property: PropertyWithOwnerInfo) => {
          this.property = property
          this.evaluateChecklist()
          this.isLoading = false
        },
        error: (error) => {
          console.error("Error cargando detalle de propiedad:", error)
          this.isLoading = false
          alert("Error al cargar la propiedad")
          this.router.navigate(["/admin/pending-approvals"])
        },
      })
  }

  loadApprovalHistory(propertyId: string): void {
    this.approvalService
      .getApprovalHistory(propertyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (history) => {
          this.approvalHistory = history
        },
        error: (error) => {
          console.error("Error cargando historial:", error)
        },
      })
  }

  evaluateChecklist(): void {
    if (!this.property) return

    this.reviewChecklist = {
      hasImages: this.property.images.length > 0,
      hasDescription: this.property.description.length > 20,
      hasPrice: this.property.price > 0,
      hasLocation: !!this.property.address && !!this.property.city,
      hasContact: !!this.property.ownerEmail && !!this.property.ownerPhone,
      priceReasonable: this.isPriceReasonable(),
      imagesQuality: this.property.images.length >= 3,
      informationComplete: this.isInformationComplete(),
    }
  }

  isPriceReasonable(): boolean {
    if (!this.property) return false
    // Lógica simple para validar precio razonable
    const minPrice = this.property.type === "RENT" ? 500000 : 50000000
    const maxPrice = this.property.type === "RENT" ? 10000000 : 2000000000
    return this.property.price >= minPrice && this.property.price <= maxPrice
  }

  isInformationComplete(): boolean {
    if (!this.property) return false
    return !!(
      this.property.title &&
      this.property.description &&
      this.property.address &&
      this.property.city &&
      this.property.area &&
      this.property.propertyType
    )
  }

  get checklistScore(): number {
    const checkedItems = Object.values(this.reviewChecklist).filter(Boolean).length
    return Math.round((checkedItems / Object.keys(this.reviewChecklist).length) * 100)
  }

  get canApprove(): boolean {
    return this.checklistScore >= 80
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index
  }

  previousImage(): void {
    if (this.property && this.selectedImageIndex > 0) {
      this.selectedImageIndex--
    }
  }

  nextImage(): void {
    if (this.property && this.selectedImageIndex < this.property.images.length - 1) {
      this.selectedImageIndex++
    }
  }

  openApprovalModal(action: "APPROVE" | "REJECT" | "REQUEST_CHANGES"): void {
    this.approvalAction = action
    this.approvalForm.patchValue({ action })

    // Hacer comentarios obligatorios para rechazos
    if (action === "REJECT") {
      this.approvalForm.get("comments")?.setValidators([Validators.required, Validators.minLength(10)])
    } else {
      this.approvalForm.get("comments")?.clearValidators()
    }
    this.approvalForm.get("comments")?.updateValueAndValidity()

    this.showApprovalModal = true
  }

  closeApprovalModal(): void {
    this.showApprovalModal = false
    this.approvalForm.reset({ action: "APPROVE" })
  }

  submitApproval(): void {
    if (this.approvalForm.invalid || !this.property) return

    const formValue = this.approvalForm.value

    // Confirmación adicional para aprobaciones de alto valor
    if (formValue.action === "APPROVE" && this.property.price > 500000000) {
      if (
        !confirm(
          `Esta propiedad tiene un valor alto (${this.formatPrice(this.property.price)}). ¿Confirmar aprobación?`,
        )
      ) {
        return
      }
    }

    this.isSubmitting = true

    this.approvalService
      .approveProperty({
        propertyId: this.property.id,
        action: formValue.action,
        comments: formValue.comments || "",
        adminNotes: formValue.adminNotes || "",
        requestedChanges: formValue.requestedChanges || [],
      })
      .subscribe({
        next: (record) => {
          this.isSubmitting = false
          this.closeApprovalModal()

          const actionText =
            formValue.action === "APPROVE"
              ? "aprobada"
              : formValue.action === "REJECT"
                ? "rechazada"
                : "marcada para cambios"

          alert(`Propiedad ${actionText} exitosamente`)
          this.router.navigate(["/admin/pending-approvals"])
        },
        error: (error) => {
          console.error("Error procesando aprobación:", error)
          this.isSubmitting = false
          alert("Error al procesar la aprobación")
        },
      })
  }

  markAsReviewing(): void {
    if (this.property) {
      this.property.status = "UNDER_REVIEW"
      alert('Propiedad marcada como "En revisión"')
    }
  }

  goBack(): void {
    this.router.navigate(["/admin/pending-approvals"])
  }

  contactOwner(): void {
    if (this.property) {
      const subject = encodeURIComponent(`Consulta sobre propiedad: ${this.property.title}`)
      const body = encodeURIComponent(
        `Hola ${this.property.ownerName},\n\nMe comunico desde la plataforma respecto a su propiedad "${this.property.title}".\n\nSaludos.`,
      )
      window.open(`mailto:${this.property.ownerEmail}?subject=${subject}&body=${body}`)
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

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  getTimePending(): string {
    if (!this.property || !this.property.submittedAt) return ""

    const now = new Date()
    const submitted = new Date(this.property.submittedAt)
    const diffInHours = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours} horas`
    } else {
      const days = Math.floor(diffInHours / 24)
      return `${days} días`
    }
  }
}
