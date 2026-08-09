package com.example.demo.repository;

import com.example.demo.model.Announcement;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AnnouncementRepository extends CrudRepository<Announcement, Long> {

    List<Announcement> findAllByOrderByCreatedAtDesc();

    // NULL on either target column means "everyone" for that dimension --
    // this single query handles department-only targeting, year-only
    // targeting, both, or neither (fully public), all at once.
    @Query("SELECT a FROM Announcement a WHERE " +
            "(a.targetDepartment IS NULL OR a.targetDepartment = :department) AND " +
            "(a.targetAcademicYear IS NULL OR a.targetAcademicYear = :academicYear) " +
            "ORDER BY a.createdAt DESC")
    List<Announcement> findVisibleTo(@Param("department") String department,
                                     @Param("academicYear") String academicYear);
}