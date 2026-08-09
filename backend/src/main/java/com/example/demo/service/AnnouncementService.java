package com.example.demo.service;

import com.example.demo.dto.AnnouncementDto;
import com.example.demo.model.Announcement;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.AnnouncementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    // Empty string in the DTO means "targeted at nothing in particular" --
    // normalize that to null so the repository's IS NULL check treats it as
    // "visible to everyone" rather than an impossible-to-match empty string.
    private String normalize(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }

    public Announcement create(AnnouncementDto dto, User creator) {
        if (dto.getTitle() == null || dto.getTitle().isBlank()
                || dto.getContent() == null || dto.getContent().isBlank()) {
            throw new RuntimeException("Title and content are required.");
        }
        Announcement announcement = new Announcement(
                dto.getTitle().trim(),
                dto.getContent().trim(),
                normalize(dto.getTargetDepartment()),
                normalize(dto.getTargetAcademicYear()),
                creator.getEmail()
        );
        return announcementRepository.save(announcement);
    }

    // Students see only what's targeted at them (or untargeted/"everyone"
    // announcements). Staff/Lab Assistant/Admin see everything -- they need
    // the full picture to do their jobs, not a filtered subset.
    public List<Announcement> getFeedFor(User user) {
        if (user.getRole() == Role.STUDENT) {
            return announcementRepository.findVisibleTo(user.getDepartment(), user.getAcademicYear());
        }
        return announcementRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Announcement update(Long id, AnnouncementDto dto) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found."));

        if (dto.getTitle() != null && !dto.getTitle().isBlank()) {
            announcement.setTitle(dto.getTitle().trim());
        }
        if (dto.getContent() != null && !dto.getContent().isBlank()) {
            announcement.setContent(dto.getContent().trim());
        }
        announcement.setTargetDepartment(normalize(dto.getTargetDepartment()));
        announcement.setTargetAcademicYear(normalize(dto.getTargetAcademicYear()));
        return announcementRepository.save(announcement);
    }

    public void delete(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new RuntimeException("Announcement not found.");
        }
        announcementRepository.deleteById(id);
    }
}