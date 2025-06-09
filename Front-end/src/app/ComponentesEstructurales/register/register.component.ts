import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from '../../services/auth/register.service';
import { RegisterRequest } from '../../services/auth/registerRequest';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './register.component.html',

})

export class RegisterComponent {
  mensaje: string = "";
  errorMensaje: string = "";
  cargando: boolean = false;
  registroExitoso: boolean = false;

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/),
    ]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private registerService: RegisterService, private router: Router) { }

  // Validador personalizado para confirmar contraseña
  passwordMatchValidator(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  register() {
    // Validar que las contraseñas coincidan
    if (!this.passwordMatchValidator()) {
      this.errorMensaje = "Las contraseñas no coinciden";
      this.registerForm.get('confirmPassword')?.setErrors({ 'mismatch': true });
      window.scrollTo(0, 0);
      return;
    }

    if (this.registerForm.valid) {
      this.cargando = true;
      this.errorMensaje = "";
      this.mensaje = "";

      // Crear objeto sin confirmPassword para el servicio
      const formData: RegisterRequest = {
        name: this.registerForm.value.name!,
        lastname: this.registerForm.value.lastname!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!
      };

      this.registerService.register(formData).subscribe({
        next: (response) => {
          console.log("Registro exitoso:", response);
          this.registroExitoso = true;
          this.mensaje = "¡Usuario registrado exitosamente! Redirigiendo al login...";

          // Limpiar completamente el formulario
          this.registerForm.reset();
          this.registerForm.markAsPristine();
          this.registerForm.markAsUntouched();

          window.scrollTo(0, 0);

          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (errorData) => {
          console.error("Error durante el registro:", errorData);
          this.errorMensaje = "Error al registrar: " + (errorData.message || "Error desconocido");
          this.cargando = false;
          window.scrollTo(0, 0);
        },
        complete: () => {
          console.info("Registro Completo");
          this.cargando = false;
        }
      });
    } else {
      this.errorMensaje = "Por favor, completa correctamente todos los campos";

      // Resaltar los campos con errores
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });

      window.scrollTo(0, 0);
    }
  }
}