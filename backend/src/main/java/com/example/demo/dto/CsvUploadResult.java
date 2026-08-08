package com.example.demo.dto;

import java.util.List;

public class CsvUploadResult {
    private int created;
    private int skippedDuplicates;
    private List<String> rowErrors;

    public CsvUploadResult(int created, int skippedDuplicates, List<String> rowErrors) {
        this.created = created;
        this.skippedDuplicates = skippedDuplicates;
        this.rowErrors = rowErrors;
    }

    public int getCreated() { return created; }
    public int getSkippedDuplicates() { return skippedDuplicates; }
    public List<String> getRowErrors() { return rowErrors; }
}