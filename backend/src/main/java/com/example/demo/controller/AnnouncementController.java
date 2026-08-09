package com.example.demo.controller;

import com.example.demo.dto.AnnouncementDto;
import com.example.demo.model.Announcement;
import com.example.demo.model.User;
import com.example.demo.service.AnnouncementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    private User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }

    // Any authenticated user -- server-side filtering happens inside the
    // service based on the caller's own role/department/year, not a query
    // param the client could tamper with.
    @GetMapping
    public ResponseEntity<List<Announcement>> feed() {
        return ResponseEntity.ok(announcementService.getFeedFor(currentUser()));
    }

    // STAFF/ADMIN only -- enforced by SecurityConfiguration, not here.
    @PostMapping
    public ResponseEntity<?> create(@RequestBody AnnouncementDto dto) {
        try {
            return ResponseEntity.ok(announcementService.create(dto, currentUser()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody AnnouncementDto dto) {
        try {
            return ResponseEntity.ok(announcementService.update(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            announcementService.delete(id);
            return ResponseEntity.ok("Deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}