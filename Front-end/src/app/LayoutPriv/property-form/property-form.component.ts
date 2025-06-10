import { Component, type OnInit, type OnDestroy, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, type FormGroup, Validators, type FormArray } from "@angular/forms"
import { Subject, takeUntil } from "rxjs"
import type { Property } from "../../interfaces/property.interface"
import { PropertyService } from "../../services/property/property.service"

@Component({
  selector: "app-property-form",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./property-form.component.html",
  styleUrls: ["./property-form.component.css"],
})
export class PropertyFormComponent implements OnInit, OnDestroy {
  @Input() property?: Property
  @Input() isEditMode = false

  // Eventos de salida correctamente tipados
  @Output() propertySaved = new EventEmitter<Property>()
  @Output() formCancelled = new EventEmitter<void>()

  propertyForm: FormGroup
  loading = false
  submitting = false
  uploadingImages = false

  selectedImages: File[] = []
  imagePreviewUrls: string[] = []
  existingImages: string[] = []

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
    "Balcón",
    "Chimenea",
    "Bodega",
    "Quincho",
    "Sala de Juegos",
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
    private fb: FormBuilder,
    private propertyService: PropertyService,
  ) {
    this.propertyForm = this.createForm()
  }

  ngOnInit() {
    if (this.isEditMode && this.property) {
      this.loadPropertyData()
    }
    this.setupAutoSave()
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      description: ["", [Validators.required, Validators.minLength(50), Validators.maxLength(1000)]],
      price: ["", [Validators.required, Validators.min(1)]],
      type: ["SALE", Validators.required],
      propertyType: ["HOUSE", Validators.required],
      bedrooms: [""],
      bathrooms: [""],
      area: ["", [Validators.required, Validators.min(1)]],
      address: ["", [Validators.required, Validators.minLength(10)]],
      city: ["", Validators.required],
      amenities: this.fb.array([]),
    })
  }

  loadPropertyData() {
    if (!this.property) return

    this.propertyForm.patchValue({
      title: this.property.title,
      description: this.property.description,
      price: this.property.price,
      type: this.property.type,
      propertyType: this.property.propertyType,
      bedrooms: this.property.bedrooms,
      bathrooms: this.property.bathrooms,
      area: this.property.area,
      address: this.property.address,
      city: this.property.city,
    })

    this.existingImages = [...this.property.images]

    // Load amenities
    const amenitiesArray = this.propertyForm.get("amenities") as FormArray
    amenitiesArray.clear()
    this.property.amenities.forEach((amenity) => {
      if (this.amenitiesList.includes(amenity)) {
        amenitiesArray.push(this.fb.control(amenity))
      }
    })
  }

  setupAutoSave() {
    this.propertyForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.saveAsDraft()
    })
  }

  saveAsDraft() {
    if (this.propertyForm.valid) {
      const draftData = {
        ...this.propertyForm.value,
        images: [...this.existingImages, ...this.imagePreviewUrls],
        lastSaved: new Date(),
      }
      localStorage.setItem("propertyDraft", JSON.stringify(draftData))
    }
  }

  loadDraft() {
    const draft = localStorage.getItem("propertyDraft")
    if (draft) {
      const draftData = JSON.parse(draft)
      this.propertyForm.patchValue(draftData)
      if (draftData.images) {
        this.existingImages = draftData.images
      }
    }
  }

  clearDraft() {
    localStorage.removeItem("propertyDraft")
  }

  get amenitiesFormArray(): FormArray {
    return this.propertyForm.get("amenities") as FormArray
  }

  onAmenityChange(amenity: string, event: any) {
    const amenitiesArray = this.amenitiesFormArray

    if (event.target.checked) {
      amenitiesArray.push(this.fb.control(amenity))
    } else {
      const index = amenitiesArray.controls.findIndex((x) => x.value === amenity)
      if (index >= 0) {
        amenitiesArray.removeAt(index)
      }
    }
  }

  isAmenitySelected(amenity: string): boolean {
    return this.amenitiesFormArray.value.includes(amenity)
  }

  onFileSelect(event: any) {
    const files = Array.from(event.target.files) as File[]

    if (files.length + this.selectedImages.length + this.existingImages.length > 10) {
      alert("Máximo 10 imágenes permitidas")
      return
    }

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        this.selectedImages.push(file)

        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreviewUrls.push(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    })
  }

  removeImage(index: number, isExisting = false) {
    if (isExisting) {
      this.existingImages.splice(index, 1)
    } else {
      this.selectedImages.splice(index, 1)
      this.imagePreviewUrls.splice(index, 1)
    }
  }

  async uploadImages(): Promise<string[]> {
    if (this.selectedImages.length === 0) {
      return this.existingImages
    }

    this.uploadingImages = true

    try {
      const uploadedUrls = await this.propertyService.uploadImages(this.selectedImages).toPromise()
      return [...this.existingImages, ...(uploadedUrls || [])]
    } catch (error) {
      console.error("Error uploading images:", error)
      throw error
    } finally {
      this.uploadingImages = false
    }
  }

  async onSubmit() {
    if (this.propertyForm.invalid) {
      this.markFormGroupTouched()
      return
    }

    const confirmMessage = this.isEditMode
      ? "¿Estás seguro de que quieres actualizar esta propiedad?"
      : "¿Estás seguro de que quieres enviar esta propiedad para aprobación?"

    if (!confirm(confirmMessage)) {
      return
    }

    this.submitting = true

    try {
      const imageUrls = await this.uploadImages()

      const propertyData = {
        ...this.propertyForm.value,
        images: imageUrls,
        amenities: this.amenitiesFormArray.value,
      }

      let savedProperty: Property

      if (this.isEditMode && this.property) {
        savedProperty = (await this.propertyService
          .updateProperty(this.property.id, propertyData)
          .toPromise()) as Property
      } else {
        savedProperty = (await this.propertyService.createProperty(propertyData).toPromise()) as Property
      }

      this.clearDraft()

      // Emitir el evento con la propiedad guardada
      this.propertySaved.emit(savedProperty)
    } catch (error) {
      console.error("Error saving property:", error)
      alert("Error al guardar la propiedad. Por favor intenta nuevamente.")
    } finally {
      this.submitting = false
    }
  }

  markFormGroupTouched() {
    Object.keys(this.propertyForm.controls).forEach((key) => {
      const control = this.propertyForm.get(key)
      control?.markAsTouched()
    })
  }

  getFieldError(fieldName: string): string {
    const field = this.propertyForm.get(fieldName)
    if (field?.errors && field.touched) {
      if (field.errors["required"]) return `${fieldName} es requerido`
      if (field.errors["minlength"])
        return `${fieldName} debe tener al menos ${field.errors["minlength"].requiredLength} caracteres`
      if (field.errors["maxlength"])
        return `${fieldName} debe tener máximo ${field.errors["maxlength"].requiredLength} caracteres`
      if (field.errors["min"]) return `${fieldName} debe ser mayor a ${field.errors["min"].min}`
    }
    return ""
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.propertyForm.get(fieldName)
    return !!(field?.invalid && field.touched)
  }

  cancel() {
    if (confirm("¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados.")) {
      this.clearDraft()
      // Emitir evento de cancelación
      this.formCancelled.emit()
    }
  }
}
