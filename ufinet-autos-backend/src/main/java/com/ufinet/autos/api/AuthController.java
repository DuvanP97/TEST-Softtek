package com.ufinet.autos.api;

import com.ufinet.autos.api.dto.AuthDtos.*;
import com.ufinet.autos.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth")
public class AuthController {
  private final AuthService auth;

  public AuthController(AuthService auth) { this.auth = auth; }

  @PostMapping({"/signup", "/register"})
  public ResponseEntity<?> signup(@RequestBody SignupRequest req){
    auth.signup(req);
    return ResponseEntity.status(201).build();
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest req){
    String token = auth.login(req);
    return ResponseEntity.ok(new AuthResponse(token));
  }
}