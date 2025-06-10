import { Injectable } from '@angular/core';
import { RegisterRequest } from './registerRequest';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError, tap } from 'rxjs';
import { User } from '../user/user';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  register(credentials: RegisterRequest): Observable<any> {
    // Transformar las propiedades del modelo de Angular a los nombres esperados por el backend
    const backendRequest = {
      nombres: credentials.name,
      apellidos: credentials.lastname,
      email: credentials.email,
      password: credentials.password
    };

    // Configurar para aceptar respuestas de texto en lugar de solo JSON
    const headers = new HttpHeaders({
      'Accept': 'text/plain, application/json'
    });

    return this.http.post(`${this.apiUrl}/register`, backendRequest, {
      headers: headers,
      responseType: 'text' // Especificar que esperamos texto
    }).pipe(
      tap(response => {
        console.log('Registro exitoso:', response);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Algo falló. Por favor intentar nuevamente';

    if (error.status === 0) {
      console.error("Error de conexión:", error.error);
      errorMessage = "Error de conexión. Compruebe su conexión a internet o que el servidor esté funcionando.";
    } else {
      console.error(`Backend retornó el código ${error.status}:`, error.error);

      // Si el servidor devuelve un mensaje de error, usarlo
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 400) {
        errorMessage = "Error en los datos enviados. Puede que el correo ya esté registrado.";
      } else if (error.status === 500) {
        errorMessage = "Error en el servidor. Intente más tarde.";
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}