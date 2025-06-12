import { Component, type OnInit, type OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, combineLatest } from 'rxjs';

import { UserPropertyService } from '../../services/user-property.service';
import type { Property } from '../../interfaces/property.interface';
import type { PropertyStats } from '../../interfaces/user-dashboard.interface';

@Component({
  selector: 'app-user-properties',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-properties.component.html',
  styleUrls: ['./user-properties.component.css'],
})
export class UserPropertiesComponent implements OnInit, OnDestroy {
  [x: string]: any;
  private destroy$ = new Subject<void>();

  properties: Property[] = [];
  filteredProperties: Property[] = [];
  stats: PropertyStats = {
    totalProperties: 0,
    activeListings: 0,
    soldProperties: 0,
    rentedProperties: 0,
    totalEarnings: 0,
    monthlyRentalIncome: 0,
  };

  isLoading = false;
  viewMode: 'grid' | 'list' = 'grid';
  activeTab: 'active' | 'rented' | 'sold' | 'pending' = 'active';

  // Filtros
  filters = {
    search: '',
    type: '',
    propertyType: '',
    city: '',
    status: '',
    dateRange: '',
  };

  // Datos del usuario actual
  currentUserId = 'user1';

  constructor(
    private userPropertyService: UserPropertyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserData(): void {
    this.isLoading = true;

    combineLatest([
      this.userPropertyService.getUserProperties(this.currentUserId),
      this.userPropertyService.getPropertyStats(this.currentUserId),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([properties, stats]) => {
          this.properties = properties;
          this.stats = stats;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error cargando datos del usuario:', error);
          this.isLoading = false;
        },
      });
  }

  setActiveTab(tab: 'active' | 'rented' | 'sold' | 'pending'): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  public navigateToAddProperty(): void {
    this.router.navigate(['add-property']);
  }

  applyFilters(): void {
    let filtered = [...this.properties];

    // Filtrar por tab activo
    switch (this.activeTab) {
      case 'active':
        filtered = filtered.filter((p) => p.status === 'APPROVED');
        break;
      case 'rented':
        filtered = filtered.filter((p) => p.status === 'RENTED');
        break;
      case 'sold':
        filtered = filtered.filter((p) => p.status === 'SOLD');
        break;
      case 'pending':
        filtered = filtered.filter((p) => p.status === 'PENDING');
        break;
    }

    // Aplicar filtros adicionales
    if (this.filters.search) {
      const searchTerm = this.filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm) ||
          p.address.toLowerCase().includes(searchTerm) ||
          p.city.toLowerCase().includes(searchTerm)
      );
    }

    if (this.filters.type) {
      filtered = filtered.filter((p) => p.type === this.filters.type);
    }

    if (this.filters.propertyType) {
      filtered = filtered.filter(
        (p) => p.propertyType === this.filters.propertyType
      );
    }

    if (this.filters.city) {
      filtered = filtered.filter((p) =>
        p.city.toLowerCase().includes(this.filters.city.toLowerCase())
      );
    }

    this.filteredProperties = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = {
      search: '',
      type: '',
      propertyType: '',
      city: '',
      status: '',
      dateRange: '',
    };
    this.applyFilters();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  editProperty(propertyId: string): void {
    this.router.navigate(['/propiedades/editar', propertyId]);
  }

  viewPropertyMetrics(propertyId: string): void {
    this.userPropertyService.getPropertyMetrics(propertyId).subscribe({
      next: (metrics) => {
        console.log('Métricas de la propiedad:', metrics);
        // Aquí podrías abrir un modal con las métricas
      },
      error: (error) => {
        console.error('Error cargando métricas:', error);
      },
    });
  }

  deactivateProperty(propertyId: string): void {
    const property = this.properties.find((p) => p.id === propertyId);
    if (property && confirm(`¿Desactivar la propiedad "${property.title}"?`)) {
      this.userPropertyService.deactivateProperty(propertyId).subscribe({
        next: (success) => {
          if (success) {
            this.loadUserData();
            alert('Propiedad desactivada exitosamente');
          }
        },
        error: (error) => {
          console.error('Error desactivando propiedad:', error);
          alert('Error al desactivar la propiedad');
        },
      });
    }
  }

  renewContract(propertyId: string): void {
    // Implementar renovación de contrato
    console.log('Renovando contrato para propiedad:', propertyId);
  }

  getStatusBadgeClass(status: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';

    switch (status) {
      case 'ACTIVE':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'RENTED':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'SOLD':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'INACTIVE':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'Activa';
      case 'RENTED':
        return 'Alquilada';
      case 'SOLD':
        return 'Vendida';
      case 'PENDING':
        return 'Pendiente';
      case 'INACTIVE':
        return 'Inactiva';
      default:
        return status;
    }
  }

  getTypeText(type: string): string {
    return type === 'RENT' ? 'Alquiler' : 'Venta';
  }

  getPropertyTypeText(type: string): string {
    switch (type) {
      case 'HOUSE':
        return 'Casa';
      case 'APARTMENT':
        return 'Apartamento';
      case 'OFFICE':
        return 'Oficina';
      case 'LAND':
        return 'Terreno';
      default:
        return type;
    }
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

  getDaysOnMarket(listingDate?: Date): number {
    if (!listingDate) return 0;
    const now = new Date();
    const listing = new Date(listingDate);
    const diffTime = Math.abs(now.getTime() - listing.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get propertiesByTab() {
    return {
      active: this.properties.filter((p) => p.status === 'APPROVED').length,
      rented: this.properties.filter((p) => p.status === 'RENTED').length,
      sold: this.properties.filter((p) => p.status === 'SOLD').length,
      pending: this.properties.filter((p) => p.status === 'PENDING').length,
    };
  }
}
