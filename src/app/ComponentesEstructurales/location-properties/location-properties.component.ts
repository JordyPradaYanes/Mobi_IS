import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Property {
  id: number;
  title: string;
  price: number;
  rentType: string; // 'month', 'day', etc.
  imgSrc: string;
  isFavorite: boolean;
  location: string;
  beds: number;
  baths: number;
  area: number;
  areaUnit: string;
  type: 'venta' | 'alquiler';
  isPopular?: boolean;
}

@Component({
  selector: 'app-location-properties',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-properties.component.html',
  styleUrls: ['./location-properties.component.css']
})
export class LocationPropertiesComponent implements OnInit {
  // Variables de colores y estilos
  colors = {
    primary: '#6366f1', // Color morado para botones
    secondary: '#1e293b', // Color para texto principal
    textLight: '#64748b', // Texto secundario 
    accent: '#3730a3', // Color para botón oscuro
    lightBg: '#f8fafc', // Fondo gris claro
    white: '#ffffff', // Color blanco
    border: '#e2e8f0', // Color bordes
    favoriteActive: '#ef4444', // Color para favoritos (rojo)
    popularBg: '#6366f1', // Color de fondo para etiqueta "popular"
  };

  // Filtros activos
  activeFilter: 'todos' | 'venta' | 'alquiler' = 'todos';

  // Propiedades mostradas
  properties: Property[] = [
    {
      id: 1,
      title: 'Palm Harbor',
      price: 2095,
      rentType: 'month',
      imgSrc: 'assets/images/property1.jpg',
      isFavorite: false,
      location: '2699 Green Valley, Highland Lake, FL',
      beds: 3,
      baths: 2,
      area: 6.7,
      areaUnit: 'm²',
      type: 'alquiler',
      isPopular: true
    },
    {
      id: 2,
      title: 'Beverly Springfield',
      price: 2700,
      rentType: 'month',
      imgSrc: 'assets/images/property2.jpg',
      isFavorite: false,
      location: '2821 Lake Sevilla, Palm Harbor, TX',
      beds: 4,
      baths: 2,
      area: 47.5,
      areaUnit: 'm²',
      type: 'alquiler',
      isPopular: true
    },
    {
      id: 3,
      title: 'Faulkner Ave',
      price: 4550,
      rentType: 'month',
      imgSrc: 'assets/images/property3.jpg',
      isFavorite: false,
      location: '909 Woodland St, Michigan, IN',
      beds: 4,
      baths: 3,
      area: 80,
      areaUnit: 'm²',
      type: 'venta',
      isPopular: true
    },
    {
      id: 4,
      title: 'St. Crystal',
      price: 2400,
      rentType: 'month',
      imgSrc: 'assets/images/property4.jpg',
      isFavorite: false,
      location: '210 Highway, Highland Lake, FL',
      beds: 4,
      baths: 2,
      area: 48,
      areaUnit: 'm²',
      type: 'venta'
    },
    {
      id: 5,
      title: 'Cove Red',
      price: 1500,
      rentType: 'month',
      imgSrc: 'assets/images/property5.jpg',
      isFavorite: false,
      location: '243 Curlew Road, Palm Harbor, TX',
      beds: 2,
      baths: 1,
      area: 37.5,
      areaUnit: 'm²',
      type: 'alquiler'
    },
    {
      id: 6,
      title: 'Tarpon Bay',
      price: 1600,
      rentType: 'month',
      imgSrc: 'assets/images/property6.jpg',
      isFavorite: false,
      location: '101 Lake Shores, Michigan, IN',
      beds: 3,
      baths: 1,
      area: 35,
      areaUnit: 'm²',
      type: 'venta'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  // Cambiar filtro activo
  setFilter(filter: 'todos' | 'venta' | 'alquiler'): void {
    this.activeFilter = filter;
  }

  // Alternar favorito
  toggleFavorite(property: Property): void {
    property.isFavorite = !property.isFavorite;
  }

  // Filtrar propiedades según el filtro activo
  get filteredProperties(): Property[] {
    if (this.activeFilter === 'todos') {
      return this.properties;
    }
    return this.properties.filter(property => property.type === this.activeFilter);
  }

  // Formatear precio
  formatPrice(price: number): string {
    return '$' + price.toLocaleString();
  }
}