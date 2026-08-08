package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users",
        uniqueConstraints = @UniqueConstraint(columnNames = {"email"})) // ✅ Database-level unique constraint
@Getter
@Setter
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    // NOTE: this is the user's chosen display name, NOT the Spring Security
    // "username" (login identifier). Kept as its own field — see getUsername()
    // below, which is what Spring Security / JWT actually use to identify the user.
    @Column(name = "username", unique = true, nullable = false)
    @JsonProperty("username")
    private String displayUsername;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Column(name = "verification_code")
    @JsonIgnore
    private String verificationCode;

    @Column(name = "verification_expiration")
    private LocalDateTime verificationCodeExpiresAt;

    @Column(name = "verification_attempts")
    private int verificationAttempts = 0; // ✅ Track failed attempts


    @Column(name = "reset_password_token")
    @JsonIgnore
    private String resetPasswordToken;

    @Column(name = "reset_password_token_expires_at")
    @JsonIgnore
    private LocalDateTime resetPasswordTokenExpiresAt;

    private boolean enabled;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String department;

    private String academicYear;

    // ✅ Constructors
    public User(String username, String email, String password) {
        this.displayUsername = username;
        this.email = email;
        this.password = password;
        this.verificationAttempts = 0;
    }

    public User() {}

    // Spring Security's UserDetails contract: this is the login identifier,
    // which for this app is the email — NOT the display username above.
    // Must be defined explicitly since Lombok no longer auto-generates a
    // getUsername() (the field it backed was renamed to displayUsername).
    @Override
    @JsonIgnore
    public String getUsername() {
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return List.of(new SimpleGrantedAuthority("ROLE_"+role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

}