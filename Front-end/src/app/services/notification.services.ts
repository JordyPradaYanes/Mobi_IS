import { Injectable } from "@angular/core"
import { type Observable, BehaviorSubject, of, delay } from "rxjs"

export interface Notification {
  id: string
  userId: string
  propertyId?: string
  title: string
  message: string
  type: "success" | "warning" | "error" | "info"
  isRead: boolean
  createdAt: Date
}

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([])

  // Datos de ejemplo
  private mockNotifications: Notification[] = [
    {
      id: "1",
      userId: "user1",
      propertyId: "1",
      title: "Propiedad en revisión",
      message: 'Tu propiedad "Casa moderna en Atalaya" está siendo revisada por un administrador.',
      type: "info",
      isRead: false,
      createdAt: new Date("2024-01-16"),
    },
    {
      id: "2",
      userId: "user1",
      propertyId: "2",
      title: "Propiedad aprobada",
      message: 'Tu propiedad "Apartamento en Centro" ha sido aprobada y ya está visible públicamente.',
      type: "success",
      isRead: true,
      createdAt: new Date("2024-01-12"),
    },
  ]

  constructor() {
    this.updateNotifications()
  }

  notifyStatusChange(userId: string, propertyId: string, newStatus: string, propertyTitle: string): void {
    let title = ""
    let message = ""
    let type: "success" | "warning" | "error" | "info" = "info"

    switch (newStatus) {
      case "APPROVED":
        title = "Propiedad aprobada"
        message = `Tu propiedad "${propertyTitle}" ha sido aprobada y ya está visible públicamente.`
        type = "success"
        break
      case "REJECTED":
        title = "Propiedad rechazada"
        message = `Tu propiedad "${propertyTitle}" ha sido rechazada. Por favor revisa los comentarios.`
        type = "error"
        break
      case "UNDER_REVIEW":
        title = "Propiedad en revisión"
        message = `Tu propiedad "${propertyTitle}" está siendo revisada por un administrador.`
        type = "info"
        break
      default:
        title = "Actualización de propiedad"
        message = `El estado de tu propiedad "${propertyTitle}" ha cambiado a ${newStatus}.`
    }

    const notification: Notification = {
      id: Date.now().toString(),
      userId,
      propertyId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date(),
    }

    this.mockNotifications.unshift(notification)
    this.updateNotifications()

    // Aquí se podría implementar notificaciones push o emails
  }

  getUnreadNotifications(userId: string): Observable<Notification[]> {
    return of(this.mockNotifications.filter((n) => n.userId === userId && !n.isRead)).pipe(delay(300))
  }

  getAllNotifications(userId: string): Observable<Notification[]> {
    return of(this.mockNotifications.filter((n) => n.userId === userId)).pipe(delay(300))
  }

  markAsRead(notificationId: string): void {
    const notification = this.mockNotifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.isRead = true
      this.updateNotifications()
    }
  }

  markAllAsRead(userId: string): void {
    this.mockNotifications.forEach((n) => {
      if (n.userId === userId) {
        n.isRead = true
      }
    })
    this.updateNotifications()
  }

  deleteNotification(notificationId: string): void {
    this.mockNotifications = this.mockNotifications.filter((n) => n.id !== notificationId)
    this.updateNotifications()
  }

  private updateNotifications(): void {
    this.notificationsSubject.next([...this.mockNotifications])
  }
}
