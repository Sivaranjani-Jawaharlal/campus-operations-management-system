package com.example.demo.service;

import com.example.demo.model.Invitation;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.InvitationRepository;
import com.example.demo.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class InvitationService {

    private static final int INVITATION_EXPIRY_HOURS = 72;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    private final InvitationRepository invitationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public InvitationService(InvitationRepository invitationRepository,
                             UserRepository userRepository,
                             PasswordEncoder passwordEncoder,
                             EmailService emailService) {
        this.invitationRepository = invitationRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public void createInvitation(String email, Role role) {
        if (email == null || email.isBlank() || role == null) {
            throw new RuntimeException("Email and role are required.");
        }
        if (role == Role.STUDENT) {
            throw new RuntimeException("Students sign up directly and cannot be invited.");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("A user with this email already exists.");
        }

        Optional<Invitation> pending = invitationRepository
                .findFirstByInvitedEmailAndUsedFalseOrderByExpiresAtDesc(email);
        if (pending.isPresent() && pending.get().getExpiresAt().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("An active invitation already exists for this email.");
        }

        String token = UUID.randomUUID().toString();
        Invitation invitation = new Invitation(
                email, role, token, LocalDateTime.now().plusHours(INVITATION_EXPIRY_HOURS)
        );
        invitationRepository.save(invitation);

        String link = frontendUrl + "/accept-invite?token=" + token;
        String html = "<p>You've been invited to join as <strong>" + role.name() + "</strong>.</p>"
                + "<p><a href=\"" + link + "\">" + link + "</a></p>"
                + "<p>This link expires in " + INVITATION_EXPIRY_HOURS + " hours.</p>";

        try {
            emailService.sendVerificationEmail(email, "You've been invited", html);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send invitation email. Please try again.");
        }
    }

    @Transactional
    public User acceptInvitation(String token, String password) {
        if (token == null || token.isBlank() || password == null || password.isBlank()) {
            throw new RuntimeException("Token and password are required.");
        }

        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired invitation link."));

        if (invitation.isUsed()) {
            throw new RuntimeException("This invitation has already been used.");
        }
        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("This invitation has expired. Please ask an admin for a new one.");
        }

        String email = invitation.getInvitedEmail();
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("An account with this email already exists.");
        }

        User user = new User();
        user.setEmail(email);
        // No separate display name is collected on this flow — defaults to
        // the email's local part.
        user.setDisplayUsername(email.split("@")[0]);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(invitation.getRole());
        user.setEnabled(true); // the invite itself is the verification step
        user.setVerificationAttempts(0);

        User savedUser = userRepository.save(user);

        invitation.setUsed(true);
        invitationRepository.save(invitation);

        return savedUser;
    }
}