package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class RegisterUserDto {
    private String email;
    private String password;
    private String username;

    // Verified against the admin-uploaded EligibleStudent list — NOT
    // trusted on their own. department/academicYear/role are never taken
    // from client input; they're copied from the matched record.
    private String rollNumber;
    private LocalDate dateOfBirth;
}