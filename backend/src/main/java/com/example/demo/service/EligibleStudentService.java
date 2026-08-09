package com.example.demo.service;

import com.example.demo.dto.CsvUploadResult;
import com.example.demo.model.EligibleStudent;
import com.example.demo.repository.EligibleStudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class EligibleStudentService {

    // Expected header (order matters, case-insensitive):
    // rollNumber,name,email,dateOfBirth,department,academicYear
    // dateOfBirth must be ISO format: yyyy-MM-dd
    private static final int EXPECTED_COLUMNS = 6;
    private final EligibleStudentRepository eligibleStudentRepository;

    public EligibleStudentService(EligibleStudentRepository eligibleStudentRepository) {
        this.eligibleStudentRepository = eligibleStudentRepository;
    }

    public CsvUploadResult bulkUpload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Upload a non-empty CSV file.");
        }

        int created = 0;
        int skippedDuplicates = 0;
        List<String> rowErrors = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String headerLine = reader.readLine();
            if (headerLine == null) {
                throw new RuntimeException("CSV file is empty.");
            }

            String line;
            int rowNumber = 1;
            while ((line = reader.readLine()) != null) {
                rowNumber++;
                if (line.isBlank()) continue;

                String[] cols = line.split(",", -1);
                if (cols.length < EXPECTED_COLUMNS) {
                    rowErrors.add("Row " + rowNumber + ": expected " + EXPECTED_COLUMNS
                            + " columns, got " + cols.length);
                    continue;
                }

                String rollNumber = cols[0].trim();
                String name = cols[1].trim();
                String email = cols[2].trim();
                String dobRaw = cols[3].trim();
                String department = cols[4].trim();
                String academicYear = cols[5].trim();

                if (rollNumber.isEmpty() || name.isEmpty() || email.isEmpty() || dobRaw.isEmpty()
                        || department.isEmpty() || academicYear.isEmpty()) {
                    rowErrors.add("Row " + rowNumber + ": all columns are required.");
                    continue;
                }
                if (!email.contains("@")) {
                    rowErrors.add("Row " + rowNumber + ": '" + email + "' doesn't look like a valid email.");
                    continue;
                }

                LocalDate dateOfBirth;
                try {
                    dateOfBirth = LocalDate.parse(dobRaw);
                } catch (DateTimeParseException e) {
                    rowErrors.add("Row " + rowNumber + ": invalid dateOfBirth '" + dobRaw + "', expected yyyy-MM-dd.");
                    continue;
                }

                if (eligibleStudentRepository.existsByRollNumber(rollNumber)) {
                    skippedDuplicates++;
                    continue;
                }

                eligibleStudentRepository.save(
                        new EligibleStudent(rollNumber, name, dateOfBirth, email, department, academicYear)
                );
                created++;
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to read CSV file: " + e.getMessage());
        }

        return new CsvUploadResult(created, skippedDuplicates, rowErrors);
    }
}