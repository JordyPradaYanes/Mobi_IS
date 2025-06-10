import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import type { Property } from "../../interfaces/property.interface"

@Component({
  selector: "app-property-card",
  imports: [CommonModule],
  templateUrl: "./property-card.component.html",
  styleUrls: ["./property-card.component.css"],
})
export class PropertyCardComponent {
  @Input() property!: Property

  constructor(private router: Router) {}

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

  getOperationTypeBadgeClass(type: string): string {
    return type === "SALE" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
  }

  viewDetails() {
    this.router.navigate(["/propiedades", this.property.id])
  }

  onImageError(event: any) {
    event.target.src = "/placeholder.svg?height=200&width=300&text=Sin+Imagen"
  }
}
