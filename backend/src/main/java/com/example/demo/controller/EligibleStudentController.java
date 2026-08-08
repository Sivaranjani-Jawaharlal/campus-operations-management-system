package com.example.demo.controller;

import com.example.demo.dto.CsvUploadResult;
import com.example.demo.service.EligibleStudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

// Everything under /admin/** requires ROLE_ADMIN — enforced in
// SecurityConfiguration, not here.
@RequestMapping("/admin/eligible-students")
@RestController
public class EligibleStudentController {

    private final EligibleStudentService eligibleStudentService;

    public EligibleStudentController(EligibleStudentService eligibleStudentService) {
        this.eligibleStudentService = eligibleStudentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadCsv(@RequestParam("file") MultipartFile file) {
        try {
            CsvUploadResult result = eligibleStudentService.bulkUpload(file);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}