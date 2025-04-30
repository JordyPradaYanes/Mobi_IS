import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {
  submitted = false;
  loading = false;
  error = '';
  registerForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmaContrasena: ['', Validators.required]
    }, {
      validator: MustMatch('contrasena', 'confirmaContrasena')
    });
  }

  // Getter para acceder fácilmente a los campos del formulario
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Si el formulario es inválido, detenemos aquí
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    
    const userData = {
      nombre: this.f['nombre'].value,
      apellidos: this.f['apellidos'].value,
      email: this.f['email'].value,
      password: this.f['contrasena'].value
    };

    
  }
}

function MustMatch(arg0: string, arg1: string): any {
  throw new Error('Function not implemented.');
}
