package com.backend.backend.controller;

import com.backend.backend.model.User;
import com.backend.backend.payload.LoginRequest;
import com.backend.backend.payload.RegisterRequest;
import com.backend.backend.payload.JwtResponse;
import com.backend.backend.security.jwt.JwtUtils;
import com.backend.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")


public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtils jwtUtils;

    /**
     * Constructor con inyección de dependencias.
     * 
     * @param authenticationManager Manejador de autenticaciones.
     * @param userService           Servicio de usuarios.
     * @param jwtUtils              Utilidad para manejar tokens JWT.
     */

     public AuthController(AuthenticationManager authenticationManager, UserService userService,
            JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    /**
     * Endpoint para registrar un nuevo usuario.
     * 
     * @param registerRequest Datos del usuario a registrar.
     * @return Respuesta con mensaje de éxito o error.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            // Crear un nuevo usuario con los datos proporcionados
            User user = new User();
            user.setNombres(registerRequest.getNombres());
            user.setApellidos(registerRequest.getApellidos());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(registerRequest.getPassword()); // No ciframos aquí, lo hace el servicio

            // Registrar usuario en la base de datos
            User nuevoUsuario = userService.registerUser(user);

            return ResponseEntity.ok("Usuario registrado exitosamente con ID: " + nuevoUsuario.getId());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para iniciar sesión y obtener un token JWT.
     * 
     * @param loginRequest Datos de inicio de sesión.
     * @return Respuesta con el token JWT.
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        // Autenticar usuario con email y contraseña
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        // Establecer autenticación en el contexto de seguridad
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generar token JWT
        String jwt = jwtUtils.generateJwtToken(authentication);

        // Obtener detalles del usuario autenticado
        Optional<User> userOptional = userService.findByEmail(loginRequest.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado.");
        }

        User user = userOptional.get();

        return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getEmail(), user.getNombres(),
                user.getApellidos()));

    }
    
}
