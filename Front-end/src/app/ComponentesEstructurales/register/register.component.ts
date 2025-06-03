import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule,FormControl } from '@angular/forms';
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
  templateUrl: './register.component.html'
})

export class RegisterComponent{
  mensaje: string = "";
  errorMensaje: string = "";
  cargando: boolean = false;
  registroExitoso: boolean = false;

registerForm= new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/),
    ]),
  })

  constructor(private registerService: RegisterService,private router: Router) { }

  register() {
    if (this.registerForm.valid) {
      this.cargando = true;
      this.errorMensaje = "";
      this.mensaje = "";

      const formData = this.registerForm.value as RegisterRequest;
      this.registerService.register(formData).subscribe({
        next: (response) => {
          console.log("Registro exitoso:", response);
          this.registroExitoso = true;
          this.mensaje = "¡Usuario registrado exitosamente! Redirigiendo al login...";

          // Limpiar completamente el formulario excepto los valores por defecto
          this.registerForm.reset();

          // Marcar formulario como pristine y untouched para evitar mensajes de validación
          this.registerForm.markAsPristine();
          this.registerForm.markAsUntouched();

          // Scroll al inicio de la página para que el usuario vea el mensaje
          window.scrollTo(0, 0);

          // Redirigir al login después de un registro exitoso después de 3 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (errorData) => {
          console.error("Error durante el registro:", errorData);
          this.errorMensaje = "Error al registrar: " + (errorData.message || "Error desconocido");
          this.cargando = false;

          // Scroll al inicio de la página para que el usuario vea el mensaje de error
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

      // Scroll al inicio de la página
      window.scrollTo(0, 0);
    }
  }
  

  }


 
  


