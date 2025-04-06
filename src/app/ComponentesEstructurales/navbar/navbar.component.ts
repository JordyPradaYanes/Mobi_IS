import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  
  // Variables de colores usados en el componente
  colors = {
    primary: '#6366f1', // Color morado para el logo y botones
    textDark: '#333333', // Texto principal oscuro
    textLight: '#666666', // Texto secundario más claro
    borderColor: '#e5e7eb', // Color de borde
    backgroundColor: '#ffffff', // Fondo blanco
    buttonText: '#ffffff' // Texto blanco para botones
  };

  // Enlaces de navegación
  navLinks = [
    { name: 'Alquilar', url: '/alquilar' },
    { name: 'Comprar', url: '/comprar' },
    { name: 'Vender', url: '/vender' },
    { name: 'Me gusta', url: '/favoritos', hasIcon: true }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  // Detectar scroll para cambiar estilos de navbar
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  // Alternar menú móvil
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}