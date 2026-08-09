package com.example.demo.repository;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationCode(String verificationCode);

    Optional<User> findByResetPasswordToken(String resetPasswordToken);

    // Used for batch year-promotion and batch graduation: finds every
    // student in one department + academic year at once.
    List<User> findByRoleAndDepartmentAndAcademicYear(Role role, String department, String academicYear);

    Optional<Object> findByDisplayUsername(String displayUsername);
}