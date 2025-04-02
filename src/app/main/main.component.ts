// Ensure the Main component is defined and exported
import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  // Variables del componente
  title = 'Aplicación Principal';
  welcomeMessage = 'Esta es la página principal de tu aplicación Angular.';
  showMessage = false;
  currentYear: number;

  constructor() { 
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    // Lógica de inicialización si es necesaria
  }

  // Método para manejar el clic del botón
  onButtonClick(): void {
    this.showMessage = !this.showMessage;
    console.log('Botón clickeado!');
  }
}