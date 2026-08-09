package com.example.demo.repository;

import com.example.demo.model.Invitation;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

public interface InvitationRepository extends CrudRepository<Invitation, Long> {
    Optional<Invitation> findByToken(String token);
    Optional<Invitation> findFirstByInvitedEmailAndUsedFalseOrderByExpiresAtDesc(String invitedEmail);
}