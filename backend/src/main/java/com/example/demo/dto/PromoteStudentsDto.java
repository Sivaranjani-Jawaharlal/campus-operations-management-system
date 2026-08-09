// backend/src/main/java/com/example/demo/dto/PromoteStudentsDto.java
package com.example.demo.dto;

public class PromoteStudentsDto {
    private String department;
    private String fromYear;
    private String toYear;

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getFromYear() { return fromYear; }
    public void setFromYear(String fromYear) { this.fromYear = fromYear; }
    public String getToYear() { return toYear; }
    public void setToYear(String toYear) { this.toYear = toYear; }
}