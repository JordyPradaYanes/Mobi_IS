import { Injectable } from "@angular/core"
import { type Observable, of, delay } from "rxjs"
import type { Purchase, PaymentSchedule, TransactionSummary } from "../interfaces/user-dashboard.interface"

@Injectable({
  providedIn: "root",
})
export class PurchaseService {
  // Datos de ejemplo
  private mockPurchases: Purchase[] = [
    {
      id: "1",
      propertyId: "1",
      property: {
        id: "1",
        title: "Casa en Los Patios",
        description: "Casa familiar con jardín",
        address: "Los Patios, Norte de Santander",
        city: "Los Patios",
        price: 280000000,
        type: "SALE",
        propertyType: "HOUSE",
        status: "SOLD",
        bedrooms: 3,
        bathrooms: 2,
        area: 110,
        images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop"],
        amenities: ["Jardín", "Garaje"],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
        ownerId: "seller1",
        isApproved: false,
        listingDate: new Date()
      },
      buyerId: "user1",
      sellerId: "seller1",
      purchasePrice: 280000000,
      purchaseDate: new Date("2024-01-15"),
      status: "IN_PROCESS",
      contractDate: new Date("2024-01-10"),
      documents: [],
      paymentSchedule: [],
      totalPaid: 84000000, // 30%
      remainingAmount: 196000000,
    },
    {
      id: "2",
      propertyId: "2",
      property: {
        id: "2",
        title: "Apartamento Centro",
        description: "Apartamento moderno",
        address: "Centro, Cúcuta",
        city: "Cúcuta",
        price: 180000000,
        type: "SALE",
        propertyType: "APARTMENT",
        status: "SOLD",
        bedrooms: 2,
        bathrooms: 1,
        area: 75,
        images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"],
        amenities: ["Gimnasio"],
        createdAt: new Date("2023-12-01"),
        updatedAt: new Date("2023-12-20"),
        ownerId: "seller2",
        isApproved: false,
        listingDate: new Date()
      },
      buyerId: "user1",
      sellerId: "seller2",
      purchasePrice: 180000000,
      purchaseDate: new Date("2023-12-20"),
      status: "COMPLETED",
      contractDate: new Date("2023-12-15"),
      completionDate: new Date("2023-12-20"),
      documents: [],
      paymentSchedule: [],
      totalPaid: 180000000,
      remainingAmount: 0,
    },
  ]

  getUserPurchases(userId: string): Observable<Purchase[]> {
    return of(this.mockPurchases).pipe(delay(500))
  }

  getPurchaseDetails(purchaseId: string): Observable<Purchase> {
    const purchase = this.mockPurchases.find((p) => p.id === purchaseId)
    if (purchase) {
      return of(purchase).pipe(delay(300))
    }
    throw new Error("Compra no encontrada")
  }

  getPaymentSchedule(purchaseId: string): Observable<PaymentSchedule[]> {
    const mockSchedule: PaymentSchedule[] = [
      {
        id: "1",
        purchaseId,
        installmentNumber: 1,
        amount: 84000000,
        dueDate: new Date("2024-01-10"),
        paidDate: new Date("2024-01-10"),
        status: "PAID",
      },
      {
        id: "2",
        purchaseId,
        installmentNumber: 2,
        amount: 98000000,
        dueDate: new Date("2024-02-10"),
        status: "PENDING",
      },
      {
        id: "3",
        purchaseId,
        installmentNumber: 3,
        amount: 98000000,
        dueDate: new Date("2024-03-10"),
        status: "PENDING",
      },
    ]
    return of(mockSchedule).pipe(delay(300))
  }

  downloadDocument(documentId: string): Observable<Blob> {
    // Simular descarga de documento
    const mockBlob = new Blob(["Documento simulado"], { type: "application/pdf" })
    return of(mockBlob).pipe(delay(1000))
  }

  getTransactionSummary(userId: string): Observable<TransactionSummary> {
    const summary: TransactionSummary = {
      totalPurchases: 2,
      completedPurchases: 1,
      totalSpent: 460000000,
      activeRentals: 1,
      totalRentPaid: 12000000,
      pendingBills: 1,
      overdueAmount: 0,
    }
    return of(summary).pipe(delay(300))
  }
}
