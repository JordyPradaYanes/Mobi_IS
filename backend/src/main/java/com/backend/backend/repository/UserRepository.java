package com.backend.backend.repository;

import com.backend.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para la entidad User.
 * Extiende JpaRepository para obtener métodos CRUD predeterminados.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Busca un usuario por su correo electrónico.
     * @param email Correo del usuario.
     * @return Un Optional con el usuario si existe.
     */
    Optional<User> findByEmail(String email);

    /**
     * Verifica si un correo ya está registrado.
     * @param email Correo del usuario.
     * @return true si el correo ya existe, false en caso contrario.
     */
    boolean existsByEmail(String email);

}
