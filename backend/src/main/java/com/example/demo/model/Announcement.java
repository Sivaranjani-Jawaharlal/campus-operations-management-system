package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // Null = visible to every department. Non-null = visible only to
    // students in that exact department. Same idea for targetAcademicYear.
    // This is what makes targeting work without a separate join table.
    @Column(name = "target_department")
    private String targetDepartment;

    @Column(name = "target_academic_year")
    private String targetAcademicYear;

    @Column(name = "created_by_email", nullable = false)
    private String createdByEmail;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public Announcement() {}

    public Announcement(String title, String content, String targetDepartment,
                        String targetAcademicYear, String createdByEmail) {
        this.title = title;
        this.content = content;
        this.targetDepartment = targetDepartment;
        this.targetAcademicYear = targetAcademicYear;
        this.createdByEmail = createdByEmail;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getTargetDepartment() { return targetDepartment; }
    public void setTargetDepartment(String targetDepartment) { this.targetDepartment = targetDepartment; }
    public String getTargetAcademicYear() { return targetAcademicYear; }
    public void setTargetAcademicYear(String targetAcademicYear) { this.targetAcademicYear = targetAcademicYear; }
    public String getCreatedByEmail() { return createdByEmail; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}