package com.ufinet.autos.service;

import com.ufinet.autos.api.dto.AuthDtos.*;
import com.ufinet.autos.domain.User;
import com.ufinet.autos.repo.UserRepository;
import com.ufinet.autos.security.JwtService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class AuthService {
  private final UserRepository userRepo;
  private final BCryptPasswordEncoder encoder;
  private final JwtService jwt;

  public AuthService(UserRepository userRepo, BCryptPasswordEncoder encoder, JwtService jwt) {
    this.userRepo = userRepo;
    this.encoder = encoder;
    this.jwt = jwt;
  }

  public void signup(SignupRequest req) {
    if (userRepo.existsByEmail(req.email)) {
      throw new IllegalArgumentException("Email already in use");
    }
    User u = new User();
    u.setEmail(req.email);
    u.setFullName(req.fullName);
    u.setPasswordHash(encoder.encode(req.password));
    userRepo.save(u);
  }

  public String login(LoginRequest req) {
    User u = userRepo.findByEmail(req.email).orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
    if (!encoder.matches(req.password, u.getPasswordHash())) {
      throw new IllegalArgumentException("Invalid credentials");
    }
    return jwt.generateToken(u.getEmail(), Map.of("userId", u.getId(), "fullName", u.getFullName()));
  }
}