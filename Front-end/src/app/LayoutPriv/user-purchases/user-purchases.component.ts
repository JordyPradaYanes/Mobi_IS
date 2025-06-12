import { Component, type OnInit, type OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, combineLatest } from 'rxjs';

import { PurchaseService } from '../../services/purchase.service';
import type {
  Purchase,
  PaymentSchedule,
  TransactionSummary,
} from '../../interfaces/user-dashboard.interface';

@Component({
  selector: 'app-user-purchases',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-purchases.component.html',
  styleUrls: ['./user-purchases.component.css'],
})
export class UserPurchasesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  paymentAmount: number = 0;
  paymentMethod: string = '';
  purchases: Purchase[] = [];
  filteredPurchases: Purchase[] = [];
  transactionSummary: TransactionSummary = {
    totalPurchases: 0,
    completedPurchases: 0,
    totalSpent: 0,
    activeRentals: 0,
    totalRentPaid: 0,
    pendingBills: 0,
    overdueAmount: 0,
  };

  selectedPurchase: Purchase | null = null;
  paymentSchedule: PaymentSchedule[] = [];
  showTimelineModal = false;
  showPaymentModal = false;

  isLoading = false;

  // Filtros
  filters = {
    status: '',
    dateRange: '',
    search: '',
  };

  // Datos del usuario actual
  currentUserId = 'user1';

  constructor(
    private purchaseService: PurchaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserPurchases();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserPurchases(): void {
    this.isLoading = true;

    combineLatest([
      this.purchaseService.getUserPurchases(this.currentUserId),
      this.purchaseService.getTransactionSummary(this.currentUserId),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([purchases, summary]) => {
          this.purchases = purchases;
          this.transactionSummary = summary;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error cargando compras del usuario:', error);
          this.isLoading = false;
        },
      });
  }

  getInProcessCount(): number {
    return this.purchases.filter((p) => p.status === 'IN_PROCESS').length;
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filters.status ||
      this.filters.search ||
      this.filters.dateRange
    );
  }

  navigateToProperties(): void {
    this.router.navigate(['/propiedades']);
  }

  getTimelineStepClass(step: any): string {
    if (step.completed) {
      return 'bg-green-500';
    } else if (step.status === 'in-progress') {
      return 'bg-blue-500';
    } else {
      return 'bg-gray-300';
    }
  }

  getPaymentStatusClass(status: string): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';

    switch (status) {
      case 'PAID':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'OVERDUE':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'PENDING':
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  }

  getPaymentStatusText(status: string): string {
    switch (status) {
      case 'PAID':
        return 'Pagado';
      case 'OVERDUE':
        return 'Vencido';
      case 'PENDING':
      default:
        return 'Pendiente';
    }
  }

  processPayment(): void {
    if (!this.paymentAmount || !this.paymentMethod) {
      alert('Por favor, complete todos los campos');
      return;
    }

    if (this.paymentAmount <= 0) {
      alert('El monto debe ser mayor a cero');
      return;
    }

    if (
      this.selectedPurchase &&
      this.paymentAmount > this.selectedPurchase.remainingAmount
    ) {
      alert('El monto no puede ser mayor al monto pendiente');
      return;
    }

    // Aquí implementarías la lógica de procesamiento de pago
    console.log('Procesando pago:', {
      purchaseId: this.selectedPurchase?.id,
      amount: this.paymentAmount,
      method: this.paymentMethod,
    });

    // Simular éxito del pago
    alert('Pago procesado exitosamente');
    this.closePaymentModal();

    // Recargar datos
    this.loadUserPurchases();
  }

  applyFilters(): void {
    let filtered = [...this.purchases];

    if (this.filters.status) {
      filtered = filtered.filter((p) => p.status === this.filters.status);
    }

    if (this.filters.search) {
      const searchTerm = this.filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.property.title.toLowerCase().includes(searchTerm) ||
          p.property.address.toLowerCase().includes(searchTerm) ||
          p.property.city.toLowerCase().includes(searchTerm)
      );
    }

    this.filteredPurchases = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = {
      status: '',
      dateRange: '',
      search: '',
    };
    this.applyFilters();
  }

  viewPurchaseTimeline(purchase: Purchase): void {
    this.selectedPurchase = purchase;
    this.loadPaymentSchedule(purchase.id);
    this.showTimelineModal = true;
  }

  loadPaymentSchedule(purchaseId: string): void {
    this.purchaseService.getPaymentSchedule(purchaseId).subscribe({
      next: (schedule) => {
        this.paymentSchedule = schedule;
      },
      error: (error) => {
        console.error('Error cargando cronograma de pagos:', error);
      },
    });
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedPurchase = null;
    this.paymentSchedule = [];
  }

  openPaymentModal(purchase: Purchase): void {
    this.selectedPurchase = purchase;
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedPurchase = null;
  }

  downloadDocument(documentId: string): void {
    this.purchaseService.downloadDocument(documentId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `documento-${documentId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error descargando documento:', error);
        alert('Error al descargar el documento');
      },
    });
  }

  getStatusBadgeClass(status: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';

    switch (status) {
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'IN_PROCESS':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'COMPLETED':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'CANCELLED':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'IN_PROCESS':
        return 'En Proceso';
      case 'COMPLETED':
        return 'Completada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  }

  getStatusDescription(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Oferta enviada, esperando respuesta del vendedor';
      case 'IN_PROCESS':
        return 'Documentación y pagos en proceso';
      case 'COMPLETED':
        return 'Compra completada, propiedad transferida';
      case 'CANCELLED':
        return 'Proceso de compra cancelado';
      default:
        return '';
    }
  }

  getProgressPercentage(purchase: Purchase): number {
    if (purchase.purchasePrice === 0) return 0;
    return Math.round((purchase.totalPaid / purchase.purchasePrice) * 100);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  }

  getTimelineSteps(purchase: Purchase): any[] {
    const steps = [
      {
        title: 'Oferta Enviada',
        description: 'Oferta de compra enviada al vendedor',
        date: purchase.purchaseDate,
        completed: true,
        status: 'completed',
      },
    ];

    if (purchase.contractDate) {
      steps.push({
        title: 'Contrato Firmado',
        description: 'Contrato de compraventa firmado',
        date: purchase.contractDate,
        completed: true,
        status: 'completed',
      });
    }

    if (purchase.status === 'IN_PROCESS') {
      steps.push({
        title: 'Pagos en Proceso',
        description: `${this.getProgressPercentage(purchase)}% pagado`,
        date: new Date(),
        completed: false,
        status: 'in-progress',
      });
    }

    if (purchase.completionDate) {
      steps.push({
        title: 'Compra Completada',
        description: 'Propiedad transferida exitosamente',
        date: purchase.completionDate,
        completed: true,
        status: 'completed',
      });
    }

    return steps;
  }
}
