package com.example.demo.service;

import com.example.demo.dto.LoginUserDto;
import com.example.demo.dto.RegisterUserDto;
import com.example.demo.dto.VerifyUserDto;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthenticationService {
    @Value("${app.frontend-url}")
    private String frontendUrl;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    // Constants
    private static final int VERIFICATION_CODE_EXPIRY_MINUTES = 15;
    private static final int MAX_VERIFICATION_ATTEMPTS = 3;
    // ✅ Rate limiting for verification requests
    private final Map<String, Integer> verificationRequestCount = new ConcurrentHashMap<>();
    private static final int MAX_VERIFICATION_REQUESTS_PER_HOUR = 5;

    public AuthenticationService(UserRepository userRepository,
                                 AuthenticationManager authenticationManager,
                                 PasswordEncoder passwordEncoder,
                                 EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public User signup(RegisterUserDto input) {
        // ✅ 1. Check if email is already registered (verified OR unverified)
        Optional<User> existing = userRepository.findByEmail(input.getEmail());

        if (existing.isPresent()) {
            User existingUser = existing.get();

            // ✅ 2. If account is verified, reject signup
            if (existingUser.isEnabled()) {
                throw new RuntimeException("An account with this email already exists. Please log in.");
            }

            // ✅ 3. If unverified, check if verification code expired
            if (existingUser.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
                // ✅ 4. Code expired - generate new code and resend
                existingUser.setVerificationCode(generateVerificationCode());
                existingUser.setVerificationCodeExpiresAt(
                        LocalDateTime.now().plusMinutes(VERIFICATION_CODE_EXPIRY_MINUTES)
                );
                // ✅ 5. IMPORTANT: DO NOT change password for existing unverified user
                // Keep the original password hash
                sendVerificationEmail(existingUser);
                return userRepository.save(existingUser);
            } else {
                // ✅ 6. Code still valid - just resend the same code
                sendVerificationEmail(existingUser);
                throw new RuntimeException("A verification code was already sent. Please check your email or wait for it to expire.");
            }
        }

        // ✅ 7. Brand new user - create account
        User user = new User();
        user.setDisplayUsername(input.getUsername());
        user.setRole(com.example.demo.model.Role.STUDENT);
        user.setEmail(input.getEmail());
        user.setPassword(passwordEncoder.encode(input.getPassword()));
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(
                LocalDateTime.now().plusMinutes(VERIFICATION_CODE_EXPIRY_MINUTES)
        );
        user.setEnabled(false);
        user.setVerificationAttempts(0); // Track attempts

        sendVerificationEmail(user);
        return userRepository.save(user);
    }

    public User authenticate(LoginUserDto input) {
        User user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Account not verified. Please verify your account.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            input.getEmail(),
                            input.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid email or password");
        }
        return user;
    }

    @Transactional
    public void verifyUser(VerifyUserDto input) {
        Optional<User> optionalUser = userRepository.findByEmail(input.getEmail());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        // ✅ Check if already verified
        if (user.isEnabled()) {
            throw new RuntimeException("Account is already verified");
        }

        // ✅ Check if verification code expired
        if (user.getVerificationCodeExpiresAt() == null || user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification code has expired. Please request a new one.");
        }

        // ✅ Check verification attempts
        if (user.getVerificationAttempts() >= MAX_VERIFICATION_ATTEMPTS) {
            throw new RuntimeException("Too many failed attempts. Please request a new code.");
        }

        // ✅ Verify code
        if (user.getVerificationCode().equals(input.getVerificationCode())) {
            user.setEnabled(true);
            user.setVerificationCode(null);
            user.setVerificationCodeExpiresAt(null);
            user.setVerificationAttempts(0);
            userRepository.save(user);
        } else {
            // ✅ Increment failed attempts
            user.setVerificationAttempts(user.getVerificationAttempts() + 1);
            userRepository.save(user);
            throw new RuntimeException("Invalid verification code");
        }
    }

    @Transactional
    public void resendVerificationCode(String email) {
        int requests = verificationRequestCount.getOrDefault(email, 0);
        if (requests >= MAX_VERIFICATION_REQUESTS_PER_HOUR) {
            throw new RuntimeException("Too many verification requests. Please try again later.");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.isEnabled()) {
            throw new RuntimeException("Account is already verified");
        }
        user.setVerificationAttempts(0);
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(
                LocalDateTime.now().plusMinutes(VERIFICATION_CODE_EXPIRY_MINUTES)
        );
        sendVerificationEmail(user);
        userRepository.save(user);
        verificationRequestCount.put(email, requests + 1);
    }

    // ✅ Reset counts every hour
    @Scheduled(fixedRate = 3600000) // Every hour
    public void resetVerificationCounts() {
        verificationRequestCount.clear();
    }

    private void sendVerificationEmail(User user) {
        String subject = "Account Verification";
        String verificationCode = user.getVerificationCode();
        String htmlMessage = buildVerificationEmailHtml(verificationCode);

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            // ✅ Log error but don't expose to user
            e.printStackTrace();
            throw new RuntimeException("Failed to send verification email. Please try again.");
        }
    }

    private String buildVerificationEmailHtml(String code) {
        return "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 4px;\">"
                + code
                + "</p>"
                + "<p style=\"color: #666; font-size: 12px;\">This code will expire in 15 minutes.</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";
    }

    private final SecureRandom secureRandom = new SecureRandom();

    private String generateVerificationCode() {
        int code = secureRandom.nextInt(900000) + 100000;
        return String.valueOf(code);
    }

    public void forgotPassword(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setResetPasswordToken(token);
            user.setResetPasswordTokenExpiresAt(LocalDateTime.now().plusMinutes(VERIFICATION_CODE_EXPIRY_MINUTES));
            userRepository.save(user);

            String resetLink = frontendUrl + "/reset-password?token=" + token;
            // ...rest unchanged
            String html = "<p>Click the link below to reset your password (valid for 15 minutes):</p>"
                    + "<p><a href=\"" + resetLink + "\">" + resetLink + "</a></p>";

            try {
                emailService.sendVerificationEmail(user.getEmail(), "Password Reset Request", html);
            } catch (MessagingException e) {
                e.printStackTrace();
                throw new RuntimeException("Failed to send reset email. Please try again.");
            }
        });
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        // Check expiry
        if (user.getResetPasswordTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }

        // Update password (encode it using your PasswordEncoder)
        user.setPassword(passwordEncoder.encode(newPassword));

        // Clear the tokens
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiresAt(null);
        userRepository.save(user);
    }
}