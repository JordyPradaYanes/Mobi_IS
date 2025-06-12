import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { Subject, takeUntil } from "rxjs"

import { BillingService } from "../../services/billing.service"
import type { MonthlyBill } from "../../interfaces/user-dashboard.interface"

@Component({
  selector: "app-monthly-bills",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./monthly-bills.component.html",
  styleUrls: ["./monthly-bills.component.css"],
})
export class MonthlyBillsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()

  bills: MonthlyBill[] = []
  filteredBills: MonthlyBill[] = []
  selectedBill: MonthlyBill | null = null

  showPaymentModal = false
  showDisputeModal = false
  showAutoPayModal = false

  paymentForm: FormGroup
  disputeForm: FormGroup
  autoPayForm: FormGroup

  isLoading = false
  isProcessingPayment = false

  // Filtros
  filters = {
    status: "",
    year: new Date().getFullYear(),
    search: "",
  }

  // Datos del usuario actual
  currentUserId = "user1"

  constructor(
    private billingService: BillingService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.paymentForm = this.fb.group({
      amount: ["", [Validators.required, Validators.min(1)]],
      paymentMethod: ["", Validators.required],
      cardNumber: [""],
      expiryDate: [""],
      cvv: [""],
      bankAccount: [""],
    })

    this.disputeForm = this.fb.group({
      reason: ["", Validators.required],
      description: ["", [Validators.required, Validators.minLength(10)]],
      evidence: [""],
    })

    this.autoPayForm = this.fb.group({
      enabled: [false],
      paymentMethod: ["", Validators.required],
      dayOfMonth: [5, [Validators.required, Validators.min(1), Validators.max(28)]],
      cardNumber: [""],
      bankAccount: [""],
    })
  }

  ngOnInit(): void {
    this.loadUserBills()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadUserBills(): void {
    this.isLoading = true

    this.billingService
      .getUserBills(this.currentUserId, this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bills) => {
          this.bills = bills
          this.applyFilters()
          this.isLoading = false
        },
        error: (error) => {
          console.error("Error cargando facturas del usuario:", error)
          this.isLoading = false
        },
      })
  }

  applyFilters(): void {
    let filtered = [...this.bills]

    if (this.filters.status) {
      filtered = filtered.filter((b) => b.status === this.filters.status)
    }

    if (this.filters.year) {
      filtered = filtered.filter((b) => b.year === this.filters.year)
    }

    if (this.filters.search) {
      const searchTerm = this.filters.search.toLowerCase()
      filtered = filtered.filter(
        (b) =>
          b.rental.property.title.toLowerCase().includes(searchTerm) ||
          b.rental.property.address.toLowerCase().includes(searchTerm),
      )
    }

    // Ordenar por fecha de vencimiento (más recientes primero)
    filtered.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())

    this.filteredBills = filtered
  }

  onFilterChange(): void {
    this.applyFilters()
  }

  clearFilters(): void {
    this.filters = {
      status: "",
      year: new Date().getFullYear(),
      search: "",
    }
    this.loadUserBills()
  }

  openPaymentModal(bill: MonthlyBill): void {
    this.selectedBill = bill
    this.paymentForm.patchValue({
      amount: bill.totalAmount,
      paymentMethod: "",
    })
    this.showPaymentModal = true
  }

  closePaymentModal(): void {
    this.showPaymentModal = false
    this.selectedBill = null
    this.paymentForm.reset()
  }

  processPayment(): void {
    if (this.paymentForm.invalid || !this.selectedBill) return

    this.isProcessingPayment = true
    const formValue = this.paymentForm.value

    const paymentData = {
      billId: this.selectedBill.id,
      amount: formValue.amount,
      method: formValue.paymentMethod,
      cardNumber: formValue.cardNumber,
      expiryDate: formValue.expiryDate,
      cvv: formValue.cvv,
      bankAccount: formValue.bankAccount,
    }

    this.billingService.payBill(this.selectedBill.id, paymentData).subscribe({
      next: (result) => {
        this.isProcessingPayment = false
        this.closePaymentModal()
        this.loadUserBills()
        alert(`Pago procesado exitosamente. ID de transacción: ${result.transactionId}`)
      },
      error: (error) => {
        console.error("Error procesando pago:", error)
        this.isProcessingPayment = false
        alert("Error al procesar el pago. Intenta nuevamente.")
      },
    })
  }

  openDisputeModal(bill: MonthlyBill): void {
    this.selectedBill = bill
    this.disputeForm.reset()
    this.showDisputeModal = true
  }

  closeDisputeModal(): void {
    this.showDisputeModal = false
    this.selectedBill = null
    this.disputeForm.reset()
  }

  submitDispute(): void {
    if (this.disputeForm.invalid || !this.selectedBill) return

    const formValue = this.disputeForm.value
    const disputeData = {
      billId: this.selectedBill.id,
      reason: formValue.reason,
      description: formValue.description,
      evidence: formValue.evidence,
    }

    this.billingService.disputeBill(this.selectedBill.id, disputeData).subscribe({
      next: (result) => {
        this.closeDisputeModal()
        alert(`Disputa enviada exitosamente. ID: ${result.disputeId}`)
      },
      error: (error) => {
        console.error("Error enviando disputa:", error)
        alert("Error al enviar la disputa")
      },
    })
  }

  openAutoPayModal(): void {
    this.autoPayForm.reset({
      enabled: false,
      dayOfMonth: 5,
    })
    this.showAutoPayModal = true
  }

  closeAutoPayModal(): void {
    this.showAutoPayModal = false
    this.autoPayForm.reset()
  }

  setupAutoPay(): void {
    if (this.autoPayForm.invalid) return

    const formValue = this.autoPayForm.value
    const autoPayConfig = {
      enabled: formValue.enabled,
      paymentMethod: formValue.paymentMethod,
      dayOfMonth: formValue.dayOfMonth,
      cardNumber: formValue.cardNumber,
      bankAccount: formValue.bankAccount,
    }

    // Usar el primer arriendo activo para configurar autopago
    const activeRental = this.bills.find((b) => b.rental.status === "ACTIVE")
    if (activeRental) {
      this.billingService.setupAutoPay(activeRental.rental.id, autoPayConfig).subscribe({
        next: () => {
          this.closeAutoPayModal()
          alert("Pago automático configurado exitosamente")
        },
        error: (error) => {
          console.error("Error configurando pago automático:", error)
          alert("Error al configurar el pago automático")
        },
      })
    }
  }

  downloadReceipt(billId: string): void {
    this.billingService.downloadReceipt(billId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `recibo-${billId}.pdf`
        link.click()
        window.URL.revokeObjectURL(url)
      },
      error: (error) => {
        console.error("Error descargando recibo:", error)
        alert("Error al descargar el recibo")
      },
    })
  }

  getStatusBadgeClass(status: string): string {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium"

    switch (status) {
      case "PENDING":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "PAID":
        return `${baseClasses} bg-green-100 text-green-800`
      case "OVERDUE":
        return `${baseClasses} bg-red-100 text-red-800`
      case "PARTIALLY_PAID":
        return `${baseClasses} bg-orange-100 text-orange-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case "PENDING":
        return "Pendiente"
      case "PAID":
        return "Pagado"
      case "OVERDUE":
        return "Vencido"
      case "PARTIALLY_PAID":
        return "Pago Parcial"
      default:
        return status
    }
  }

  getChargeTypeText(type: string): string {
    switch (type) {
      case "MAINTENANCE":
        return "Mantenimiento"
      case "UTILITIES":
        return "Servicios Públicos"
      case "ADMINISTRATION":
        return "Administración"
      case "INSURANCE":
        return "Seguro"
      case "OTHER":
        return "Otros"
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
      month: "short",
      day: "numeric",
    }).format(new Date(date))
  }

  getMonthName(month: number): string {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]
    return months[month] || ""
  }

  getDaysOverdue(dueDate: Date): number {
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = now.getTime() - due.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  get billsSummary() {
    return {
      total: this.bills.length,
      pending: this.bills.filter((b) => b.status === "PENDING").length,
      paid: this.bills.filter((b) => b.status === "PAID").length,
      overdue: this.bills.filter((b) => b.status === "OVERDUE").length,
      totalAmount: this.bills.reduce((sum, bill) => sum + bill.totalAmount, 0),
      pendingAmount: this.bills
        .filter((b) => b.status === "PENDING" || b.status === "OVERDUE")
        .reduce((sum, bill) => sum + bill.totalAmount, 0),
    }
  }

  get availableYears(): number[] {
    const currentYear = new Date().getFullYear()
    return [currentYear - 2, currentYear - 1, currentYear, currentYear + 1]
  }
}
