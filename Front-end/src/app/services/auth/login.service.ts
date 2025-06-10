import { Injectable,Inject,PLATFORM_ID } from '@angular/core';
import { LoginRequest } from './loginRequest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError, BehaviorSubject, tap, ReplaySubject } from 'rxjs';
import { User } from '../user/user';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserLoginOnSubject = new BehaviorSubject<boolean>(false);
  private currentUserDataSubject = new BehaviorSubject<User>({id:0, email:''});
  private token: string = '';
  private isBrowser: boolean;

  // Exponer como Observables (no Subjects directamente)
  currentUserLoginOn$ = this.currentUserLoginOnSubject.asObservable();
  currentUserData$ = this.currentUserDataSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    if (!this.isBrowser) return;

    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      this.token = storedToken;
      this.currentUserLoginOnSubject.next(true);
      try {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{"id":0,"email":""}');
        this.currentUserDataSubject.next(userData);
      } catch (e) {
        console.error('Error parsing user data', e);
        this.clearAuthData();
      }
    }
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (!this.isBrowser) return;

        console.log('Login exitoso:', response);
        this.token = response.token;
        
        const userData: User = {
          id: response.id,
          email: response.email,
          name: response.nombres,
          lastName: response.apellidos
        };

        this.saveAuthData(this.token, userData);
        this.currentUserDataSubject.next(userData);
        this.currentUserLoginOnSubject.next(true);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.clearAuthData();
    this.currentUserLoginOnSubject.next(false);
    this.currentUserDataSubject.next({id:0, email:''});
  }

  private saveAuthData(token: string, userData: User): void {
    if (!this.isBrowser) return;
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
  }

  private clearAuthData(): void {
    if (!this.isBrowser) return;
    
    this.token = '';
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  getToken(): string {
    return this.token;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.status === 0) {
      console.error("Error de conexión:", error.error);
      errorMessage = "Error de conexión. Compruebe su conexión a internet o que el servidor esté funcionando.";
    } else {
      console.error(`Backend retornó el código ${error.status}:`, error.error);

      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 401) {
        errorMessage = "Credenciales inválidas. Verifique su correo y contraseña.";
      } else if (error.status === 404) {
        errorMessage = "Usuario no encontrado.";
      } else if (error.status === 500) {
        errorMessage = "Error en el servidor. Intente más tarde.";
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
