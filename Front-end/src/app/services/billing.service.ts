import { Injectable } from "@angular/core"
import { type Observable, of, delay } from "rxjs"
import type { MonthlyBill } from "../interfaces/user-dashboard.interface"

@Injectable({
  providedIn: "root",
})
export class BillingService {
  // Datos de ejemplo
  private mockBills: MonthlyBill[] = [
    {
      id: "1",
      rentalId: "1",
      rental: {
        id: "1",
        propertyId: "1",
        property: {
            id: "1",
            title: "Apartamento Moderno",
            description: "Apartamento en excelente ubicación",
            address: "Av. Circunvalar, Ocaña",
            city: "Ocaña",
            price: 1500000,
            type: "RENT",
            propertyType: "APARTMENT",
            status: "RENTED",
            bedrooms: 2,
            bathrooms: 2,
            area: 85,
            images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"],
            amenities: ["Gimnasio", "Piscina"],
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01"),
            ownerId: "landlord1",
            isApproved: false,
            listingDate: new Date()
        },
        tenantId: "user1",
        landlordId: "landlord1",
        monthlyRent: 1500000,
        securityDeposit: 1500000,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        status: "ACTIVE",
        contractDate: new Date("2023-12-20"),
        documents: [],
      },
      month: 2,
      year: 2025,
      rentAmount: 1500000,
      additionalCharges: [
        {
          id: "1",
          description: "Administración",
          amount: 150000,
          type: "ADMINISTRATION",
        },
        {
          id: "2",
          description: "Servicios públicos",
          amount: 200000,
          type: "UTILITIES",
        },
      ],
      totalAmount: 1850000,
      dueDate: new Date("2024-02-05"),
      status: "PENDING",
      lateFeesApplied: 0,
    },
    {
      id: "2",
      rentalId: "1",
      rental: {
        id: "1",
        propertyId: "1",
        property: {
            id: "1",
            title: "Apartamento Moderno",
            description: "Apartamento en excelente ubicación",
            address: "Av. Circunvalar, Ocaña",
            city: "Ocaña",
            price: 1500000,
            type: "RENT",
            propertyType: "APARTMENT",
            status: "RENTED",
            bedrooms: 2,
            bathrooms: 2,
            area: 85,
            images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"],
            amenities: ["Gimnasio", "Piscina"],
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01"),
            ownerId: "landlord1",
            isApproved: false,
            listingDate: new Date()
        },
        tenantId: "user1",
        landlordId: "landlord1",
        monthlyRent: 1500000,
        securityDeposit: 1500000,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        status: "ACTIVE",
        contractDate: new Date("2023-12-20"),
        documents: [],
      },
      month: 1,
      year: 2024,
      rentAmount: 1500000,
      additionalCharges: [
        {
          id: "3",
          description: "Administración",
          amount: 150000,
          type: "ADMINISTRATION",
        },
        {
          id: "4",
          description: "Servicios públicos",
          amount: 180000,
          type: "UTILITIES",
        },
      ],
      totalAmount: 1830000,
      dueDate: new Date("2024-01-05"),
      paidDate: new Date("2024-01-03"),
      status: "PAID",
      paymentMethod: "Transferencia bancaria",
      lateFeesApplied: 0,
    },
  ]

  getUserBills(userId: string, filters?: any): Observable<MonthlyBill[]> {
    let filteredBills = [...this.mockBills]

    if (filters) {
      if (filters.status) {
        filteredBills = filteredBills.filter((bill) => bill.status === filters.status)
      }
      if (filters.year) {
        filteredBills = filteredBills.filter((bill) => bill.year === filters.year)
      }
    }

    return of(filteredBills).pipe(delay(500))
  }

  getBillDetails(billId: string): Observable<MonthlyBill> {
    const bill = this.mockBills.find((b) => b.id === billId)
    if (bill) {
      return of(bill).pipe(delay(300))
    }
    throw new Error("Factura no encontrada")
  }

  payBill(billId: string, paymentData: any): Observable<any> {
    const bill = this.mockBills.find((b) => b.id === billId)
    if (bill) {
      bill.status = "PAID"
      bill.paidDate = new Date()
      bill.paymentMethod = paymentData.method
      return of({ success: true, transactionId: Date.now().toString() }).pipe(delay(2000))
    }
    throw new Error("Factura no encontrada")
  }

  setupAutoPay(rentalId: string, autoPayConfig: any): Observable<boolean> {
    // Simular configuración de pago automático
    console.log("Configurando pago automático:", autoPayConfig)
    return of(true).pipe(delay(1000))
  }

  downloadReceipt(billId: string): Observable<Blob> {
    // Simular descarga de recibo
    const mockBlob = new Blob(["Recibo de pago simulado"], { type: "application/pdf" })
    return of(mockBlob).pipe(delay(1000))
  }

  disputeBill(billId: string, disputeData: any): Observable<any> {
    // Simular disputa de factura
    console.log("Disputa enviada:", disputeData)
    return of({ disputeId: Date.now().toString(), status: "PENDING" }).pipe(delay(1000))
  }
}
