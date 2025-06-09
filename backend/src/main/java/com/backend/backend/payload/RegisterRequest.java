package com.backend.backend.payload;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String nombres;
    private String apellidos;
    private String email;
    private String password;
}
