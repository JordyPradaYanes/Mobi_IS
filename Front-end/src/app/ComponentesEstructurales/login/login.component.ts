import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/auth/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  mensaje: string = '';
  errorMensaje: string = '';
  cargando: boolean = false;
  FormLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

   login() {
    if (this.FormLogin.valid) {
      this.cargando = true;
      this.errorMensaje = '';
      this.mensaje = 'Iniciando sesión...';

      const email = this.FormLogin.get('email')!.value!;
      const password = this.FormLogin.get('password')!.value!;
      const credentials = { email, password };

      this.loginService.login(credentials).subscribe({
        next: () => {
          console.log('Login exitoso');
          this.mensaje = '¡Inicio de sesión exitoso! Redirigiendo...';
        },
        error: (error) => {
          console.error('Error durante el login:', error);
          this.errorMensaje = 'Error de inicio de sesión: ' + (error.error || error.message || 'Credenciales inválidas');
          this.mensaje = '';
        },
        complete: () => {
          this.cargando = false;
          setTimeout(() => this.router.navigate(['/dashboard']), 1000);
        }
      });
    } else {
      this.errorMensaje = 'Por favor, completa correctamente todos los campos';
      Object.values(this.FormLogin.controls).forEach(c => c.markAsTouched());
    }
  }

}
