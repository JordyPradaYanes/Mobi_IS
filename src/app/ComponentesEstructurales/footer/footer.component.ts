import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-footer',
  imports: [RouterLink, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})


export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  
  // Variables de colores usados en el componente
  colors = {
    primary: '#6366f1', // Color morado para el logo
    textDark: '#333333', // Texto principal oscuro
    textLight: '#666666', // Texto secundario más claro
    borderColor: '#e5e7eb', // Color de borde
    hoverColor: '#4f46e5', // Color para hover
    backgroundColor: '#ffffff' // Fondo blanco
  };

  // Columnas del footer
  footerColumns = [
    {
      title: 'SELL A HOME',
      links: [
        { name: 'Request an offer', url: '/request-offer' },
        { name: 'Pricing', url: '/pricing' },
        { name: 'Reviews', url: '/reviews' },
        { name: 'Stories', url: '/stories' }
      ]
    },
    {
      title: 'BUY A HOME',
      links: [
        { name: 'Buy', url: '/buy' },
        { name: 'Finance', url: '/finance' }
      ]
    },
    {
      title: 'BUY, RENT AND SELL',
      links: [
        { name: 'Buy and sell properties', url: '/properties' },
        { name: 'Rent home', url: '/rent' },
        { name: 'Builder trade-up', url: '/builder-trade' }
      ]
    },
    {
      title: 'TERMS & PRIVACY',
      links: [
        { name: 'Trust & Safety', url: '/trust-safety' },
        { name: 'Terms of Service', url: '/terms' },
        { name: 'Privacy Policy', url: '/privacy' }
      ]
    },
    {
      title: 'ABOUT',
      links: [
        { name: 'Company', url: '/company' },
        { name: 'How it works', url: '/how-it-works' },
        { name: 'Contact', url: '/contact' },
        { name: 'Investors', url: '/investors' }
      ]
    },
    {
      title: 'RESOURCES',
      links: [
        { name: 'Blog', url: '/blog' },
        { name: 'Guides', url: '/guides' },
        { name: 'FAQ', url: '/faq' },
        { name: 'Help Center', url: '/help' }
      ]
    }
  ];

  // Íconos de redes sociales
  socialLinks = [
    { name: 'Facebook', icon: 'fab fa-facebook-f', url: 'https://facebook.com/' },
    { name: 'Instagram', icon: 'fab fa-instagram', url: 'https://instagram.com/' },
    { name: 'Twitter', icon: 'fab fa-twitter', url: 'https://twitter.com/' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin-in', url: 'https://linkedin.com/' }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}