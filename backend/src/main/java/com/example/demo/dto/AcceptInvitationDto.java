package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AcceptInvitationDto {
    private String token;
    private String password;
}