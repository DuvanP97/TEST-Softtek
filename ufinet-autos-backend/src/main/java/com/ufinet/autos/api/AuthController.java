package com.ufinet.autos.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api/auth")
public class AuthController {
  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody Map<String,String> body){
    return ResponseEntity.status(501).body(Map.of("message","Signup not implemented yet"));
  }
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody Map<String,String> body){
    return ResponseEntity.status(501).body(Map.of("message","Login not implemented yet"));
  }
}