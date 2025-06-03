package com.backend.backend.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entidad que representa un usuario en la base de datos.
 */
@Entity
@Table(name = "users_mobi", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"), // Restringe emails duplicados
})

@Data // Genera automáticamente getters, setters, toString, equals y hashCode
@NoArgsConstructor // Constructor sin parámetros
@AllArgsConstructor // Constructor con todos los parámetros
@Builder // Permite construir objetos de esta clase con el patrón Builder
public class User {

    @Id // Define la clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Genera automáticamente el ID autoincremental
    private Long id;

    @Column(nullable = false, length = 50) // No permite valores nulos, máximo 50 caracteres
    private String nombres;

    @Column(nullable = false, length = 50) // No permite valores nulos, máximo 50 caracteres
    private String apellidos;

    @Column(nullable = false, unique = true, length = 100) // Email único, no puede ser nulo
    private String email;

    @Column(nullable = false) // No puede ser nula
    private String password; // La contraseña se almacenará cifrada en la base de datos
}