import { Component, Input, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-property-gallery",
  imports: [CommonModule],
  templateUrl: "./property-gallery.component.html",
  styleUrls: ["./property-gallery.component.css"],
})
export class PropertyGalleryComponent implements OnInit {
  @Input() images: string[] = []

  currentImageIndex = 0
  showModal = false
  modalImageIndex = 0

  ngOnInit() {
    if (this.images.length === 0) {
      this.images = ["/placeholder.svg?height=400&width=600&text=Sin+Imágenes"]
    }
  }

  get currentImage(): string {
    return this.images[this.currentImageIndex] || "/placeholder.svg?height=400&width=600"
  }

  get modalImage(): string {
    return this.images[this.modalImageIndex] || "/placeholder.svg?height=400&width=600"
  }

  selectImage(index: number) {
    this.currentImageIndex = index
  }

  openModal(index: number) {
    this.modalImageIndex = index
    this.showModal = true
    document.body.style.overflow = "hidden"
  }

  closeModal() {
    this.showModal = false
    document.body.style.overflow = "auto"
  }

  previousImage() {
    this.modalImageIndex = this.modalImageIndex > 0 ? this.modalImageIndex - 1 : this.images.length - 1
  }

  nextImage() {
    this.modalImageIndex = this.modalImageIndex < this.images.length - 1 ? this.modalImageIndex + 1 : 0
  }

  onImageError(event: any) {
    event.target.src = "/placeholder.svg?height=400&width=600&text=Error+al+cargar"
  }

  onKeydown(event: KeyboardEvent) {
    if (!this.showModal) return

    switch (event.key) {
      case "Escape":
        this.closeModal()
        break
      case "ArrowLeft":
        this.previousImage()
        break
      case "ArrowRight":
        this.nextImage()
        break
    }
  }
}
