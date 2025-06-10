import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { FormBuilder, ReactiveFormsModule, type FormGroup } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from "rxjs"
import type { Property, PropertyFilter } from "../../interfaces/property.interface"
import { PropertyService } from "../../services/property/property.service"
import { PropertyCardComponent } from "../property-card/property-card.component"

@Component({
  selector: "app-property-list",
  imports: [CommonModule, ReactiveFormsModule, PropertyCardComponent],
  templateUrl: "./property-list.component.html",
  styleUrls: ["./property-list.component.css"],
})
export class PropertyListComponent implements OnInit, OnDestroy {
  properties: Property[] = []
  filteredProperties: Property[] = []
  loading = false
  showFilters = false
  currentPage = 1
  itemsPerPage = 9
  totalPages = 0

  filterForm: FormGroup
  private destroy$ = new Subject<void>()

  amenitiesList = [
    "Piscina",
    "Gimnasio",
    "Jardín",
    "Terraza",
    "Garaje",
    "Portería",
    "Ascensor",
    "Aire Acondicionado",
    "Calefacción",
  ]

  cities = [
    "Centro",
    "La Castellana",
    "Aprisco",
    "El Carmen",
    "Santa Lucía",
    "Juan XXIII",
    "San Francisco",
    "Colina de Oro",
    "Kennedy",
    "Villanueva",
    "Bellavista",
    "Uribe",
    "Simón Bolívar",
    "Ciudadela Norte",
    "El Progreso",
    "La Esperanza",
    "Villa Natalia",
    "Manuel Ángel Velandia",
    "Mariano Moreno",
    "La Candelaria",
    "Chapinero",
    "San Agustín",
    "Las Vegas",
    "Comuneros",
    "Brisas del Norte",
    "Los Almendros",
    "Aeropuerto",
    "Terranova",
    "José Eusebio Caro",
    "La Pradera",
    "Balcones de Venecia",
    "Portal de Los Alpes",
    "Los Robles",
    "Monte Carlo",
    "Nuevo Amanecer",
    "Buenos Aires",
    "La Luz",
    "Divino Niño",
    "El Dorado",
    "La Florida",
    "Los Arrayanes",
    "Puerta de Oro",
    "Valle de Los Estudiantes",
    "Villa Clara",
    "Villa Olímpica",
    "Aldea de San Antón",
    "Hacienda Santa Bárbara",
    "Torres de San Agustín"
  ]

  constructor(
    private propertyService: PropertyService,
    private fb: FormBuilder,
  ) {
    this.filterForm = this.fb.group({
      searchText: [""],
      type: [""],
      propertyType: [""],
      minPrice: [""],
      maxPrice: [""],
      city: [""],
      minBedrooms: [""],
      maxBedrooms: [""],
      amenities: [[]],
    })
  }

  ngOnInit() {
    this.loadProperties()
    this.setupFilterSubscription()
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadProperties() {
    this.loading = true
    this.propertyService
      .getProperties()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (properties) => {
          this.properties = properties
          this.applyFilters()
          this.loading = false
        },
        error: () => {
          this.loading = false
        },
      })
  }

  setupFilterSubscription() {
    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyFilters()
      })
  }

  applyFilters() {
    const filters: PropertyFilter = this.filterForm.value

    let filtered = [...this.properties]

    if (filters.searchText) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(filters.searchText!.toLowerCase()) ||
          p.description.toLowerCase().includes(filters.searchText!.toLowerCase()),
      )
    }

    if (filters.type) {
      filtered = filtered.filter((p) => p.type === filters.type)
    }

    if (filters.propertyType) {
      filtered = filtered.filter((p) => p.propertyType === filters.propertyType)
    }

    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!)
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!)
    }

    if (filters.city) {
      filtered = filtered.filter((p) => p.city === filters.city)
    }

    if (filters.minBedrooms) {
      filtered = filtered.filter((p) => p.bedrooms && p.bedrooms >= filters.minBedrooms!)
    }

    if (filters.maxBedrooms) {
      filtered = filtered.filter((p) => p.bedrooms && p.bedrooms <= filters.maxBedrooms!)
    }

    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter((p) => filters.amenities!.every((amenity) => p.amenities.includes(amenity)))
    }

    this.filteredProperties = filtered
    this.totalPages = Math.ceil(this.filteredProperties.length / this.itemsPerPage)
    this.currentPage = 1
  }

  get paginatedProperties(): Property[] {
    const start = (this.currentPage - 1) * this.itemsPerPage
    const end = start + this.itemsPerPage
    return this.filteredProperties.slice(start, end)
  }

  toggleFilters() {
    this.showFilters = !this.showFilters
  }

  clearFilters() {
    this.filterForm.reset()
  }

  onPageChange(page: number) {
    this.currentPage = page
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  onAmenityChange(amenity: string, event: any) {
    const amenities = this.filterForm.get("amenities")?.value || []
    if (event.target.checked) {
      amenities.push(amenity)
    } else {
      const index = amenities.indexOf(amenity)
      if (index > -1) {
        amenities.splice(index, 1)
      }
    }
    this.filterForm.patchValue({ amenities })
  }

  isAmenitySelected(amenity: string): boolean {
    const amenities = this.filterForm.get("amenities")?.value || []
    return amenities.includes(amenity)
  }
}
