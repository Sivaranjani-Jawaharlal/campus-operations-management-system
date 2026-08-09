package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.model.User;
import com.example.demo.service.UserManagementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Admin-only account lifecycle management. Enforced by SecurityConfiguration
// (/admin/** requires ROLE_ADMIN) -- don't rely on this controller alone.
@RequestMapping("/admin/users")
@RestController
public class AdminUserController {

    private final UserManagementService userManagementService;

    public AdminUserController(UserManagementService userManagementService) {
        this.userManagementService = userManagementService;
    }

    // Moves every student in a department + year to the next year.
    // Doesn't touch account status -- purely a data update.
    @PostMapping("/promote")
    public ResponseEntity<?> promoteStudents(@RequestBody PromoteStudentsDto request) {
        try {
            return ResponseEntity.ok(userManagementService.promoteStudents(request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Marks every student in a department + year INACTIVE (graduated).
    // They keep read access; can no longer register for events, etc.
    @PostMapping("/graduate")
    public ResponseEntity<?> graduateStudents(@RequestBody GraduateStudentsDto request) {
        try {
            return ResponseEntity.ok(userManagementService.graduateStudents(request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Individual on/off switch -- typically for a staff member or lab
    // assistant leaving (or, rarely, correcting a mistaken graduation).
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody UpdateAccountStatusDto request) {
        try {
            if (request.getStatus() == null) {
                return ResponseEntity.badRequest().body("status is required (ACTIVE or INACTIVE).");
            }
            User updated = userManagementService.setAccountStatus(id, request.getStatus());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}