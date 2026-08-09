package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnnouncementDto {
    private String title;
    private String content;
    // Leave blank/omit for "visible to everyone" in that dimension.
    private String targetDepartment;
    private String targetAcademicYear;
}