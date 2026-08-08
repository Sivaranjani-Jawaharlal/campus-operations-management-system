package com.example.demo.repository;

import com.example.demo.model.EligibleStudent;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

public interface EligibleStudentRepository extends CrudRepository<EligibleStudent, Long> {
    Optional<EligibleStudent> findByRollNumber(String rollNumber);
    boolean existsByRollNumber(String rollNumber);
}