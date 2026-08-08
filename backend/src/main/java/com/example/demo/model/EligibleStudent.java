package com.example.demo.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "eligible_students")
public class EligibleStudent {

    @Id
    @GeneratedValue(strategy =GenerationType.AUTO)
    private Long id;

    @Column(name="roll_number", unique = true, nullable = false)
    private String rollNumber;

    @Column(nullable = false)
    private String name;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private String department;

    @Column(name = "academic_year", nullable = false)
    private String academicYear;

    @Column(name="used_for_signup", nullable = false)
    private  boolean usedForSignup=false;

    protected EligibleStudent(){

    }

    public EligibleStudent(String rollNumber, String name, LocalDate dateOfBirth, String department, String academicYear) {
        this.rollNumber = rollNumber;
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.department = department;
        this.academicYear = academicYear;
    }

    public Long getId() { return id; }
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public boolean isUsedForSignup() { return usedForSignup; }
    public void setUsedForSignup(boolean usedForSignup) { this.usedForSignup = usedForSignup; }


}
