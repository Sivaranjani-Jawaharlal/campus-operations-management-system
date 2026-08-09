package com.example.demo.service;

import com.example.demo.dto.BatchUpdateResult;
import com.example.demo.dto.GraduateStudentsDto;
import com.example.demo.dto.PromoteStudentsDto;
import com.example.demo.model.AccountStatus;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Admin-only account lifecycle actions: moving a batch of students to the
// next academic year, graduating a batch (read-only from then on), and
// flipping a single account (typically staff/lab assistant) to INACTIVE
// when they leave, or back to ACTIVE if that was a mistake / they return.
@Service
public class UserManagementService {

    private final UserRepository userRepository;

    public UserManagementService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public BatchUpdateResult promoteStudents(PromoteStudentsDto request) {
        if (request.getDepartment() == null || request.getDepartment().isBlank()
                || request.getFromYear() == null || request.getFromYear().isBlank()
                || request.getToYear() == null || request.getToYear().isBlank()) {
            throw new RuntimeException("department, fromYear, and toYear are all required.");
        }

        List<User> students = userRepository.findByRoleAndDepartmentAndAcademicYear(
                Role.STUDENT, request.getDepartment(), request.getFromYear());

        for (User student : students) {
            student.setAcademicYear(request.getToYear());
        }
        userRepository.saveAll(students);

        return new BatchUpdateResult(students.size(),
                "Promoted " + students.size() + " student(s) in " + request.getDepartment()
                        + " from " + request.getFromYear() + " to " + request.getToYear() + ".");
    }

    @Transactional
    public BatchUpdateResult graduateStudents(GraduateStudentsDto request) {
        if (request.getDepartment() == null || request.getDepartment().isBlank()
                || request.getAcademicYear() == null || request.getAcademicYear().isBlank()) {
            throw new RuntimeException("department and academicYear are both required.");
        }

        List<User> students = userRepository.findByRoleAndDepartmentAndAcademicYear(
                Role.STUDENT, request.getDepartment(), request.getAcademicYear());

        for (User student : students) {
            student.setAccountStatus(AccountStatus.INACTIVE);
        }
        userRepository.saveAll(students);

        return new BatchUpdateResult(students.size(),
                "Graduated " + students.size() + " student(s) in " + request.getDepartment()
                        + " (" + request.getAcademicYear() + "). Their accounts are now read-only.");
    }

    @Transactional
    public User setAccountStatus(Long userId, AccountStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));
        user.setAccountStatus(status);
        return userRepository.save(user);
    }
}