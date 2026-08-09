package com.example.demo.dto;

public class BatchUpdateResult {
    private int affected;
    private String message;

    public BatchUpdateResult(int affected, String message) {
        this.affected = affected;
        this.message = message;
    }

    public int getAffected() { return affected; }
    public String getMessage() { return message; }
}