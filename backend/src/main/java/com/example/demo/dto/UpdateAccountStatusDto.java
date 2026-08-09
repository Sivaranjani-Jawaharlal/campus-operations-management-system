package com.example.demo.dto;

import com.example.demo.model.AccountStatus;

public class UpdateAccountStatusDto {
    private AccountStatus status;

    public AccountStatus getStatus() { return status; }
    public void setStatus(AccountStatus status) { this.status = status; }
}