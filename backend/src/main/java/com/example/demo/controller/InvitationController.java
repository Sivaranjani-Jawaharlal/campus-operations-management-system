package com.example.demo.controller;

import com.example.demo.dto.AcceptInvitationDto;
import com.example.demo.dto.CreateInvitationDto;
import com.example.demo.model.User;
import com.example.demo.service.InvitationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class InvitationController {

    private final InvitationService invitationService;

    public InvitationController(InvitationService invitationService) {
        this.invitationService = invitationService;
    }

    // Admin-only — enforced by SecurityConfiguration's /admin/** rule.
    @PostMapping("/admin/invitations")
    public ResponseEntity<?> createInvitation(@RequestBody CreateInvitationDto dto) {
        try {
            invitationService.createInvitation(dto.getEmail(), dto.getRole());
            return ResponseEntity.ok("Invitation sent.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Public — enforced by SecurityConfiguration's /invitations/accept permitAll rule.
    @PostMapping("/invitations/accept")
    public ResponseEntity<?> acceptInvitation(@RequestBody AcceptInvitationDto dto) {
        try {
            User user = invitationService.acceptInvitation(dto.getToken(), dto.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}