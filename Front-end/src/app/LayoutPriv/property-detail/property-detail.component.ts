import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router } from "@angular/router"
import { Subject, takeUntil } from "rxjs"
import type { Property } from "../../interfaces/property.interface"
import { PropertyService } from "../../services/property/property.service"
import { PropertyGalleryComponent } from "../property-gallery/property-gallery.component"

@Component({
  selector: "app-property-detail",
  imports: [CommonModule, PropertyGalleryComponent],
  templateUrl: "./property-detail.component.html",
  styleUrls: ["./property-detail.component.css"],
})
export class PropertyDetailComponent implements OnInit, OnDestroy {
  property: Property | null = null
  loading = true
  error = false

  private destroy$ = new Subject<void>()

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params["id"]) {
        this.loadProperty(params["id"])
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadProperty(id: string) {
    this.loading = true
    this.error = false

    this.propertyService
      .getPropertyById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (property) => {
          this.property = property
          this.loading = false
          if (!property) {
            this.error = true
          }
        },
        error: () => {
          this.loading = false
          this.error = true
        },
      })
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  getPropertyTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      HOUSE: "Casa",
      APARTMENT: "Departamento",
      OFFICE: "Oficina",
      LAND: "Terreno",
    }
    return labels[type] || type
  }

  getOperationTypeLabel(type: string): string {
    return type === "SALE" ? "Venta" : "Arriendo"
  }

  goBack() {
    this.router.navigate(["/propiedades"])
  }

  contactOwner() {
    alert("Funcionalidad de contacto - Se enviará solicitud de reunión supervisada")
  }

  shareProperty() {
    if (navigator.share) {
      navigator.share({
        title: this.property?.title,
        text: this.property?.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Enlace copiado al portapapeles")
    }
  }

  scheduleVisit() {
    alert("Funcionalidad de agendamiento - Se coordinará visita supervisada")
  }
}
