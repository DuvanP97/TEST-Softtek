package com.ufinet.autos.api.dto;

public class AuthDtos {
  public static class SignupRequest {
    public String fullName;
    public String email;
    public String password;
  }
  public static class LoginRequest {
    public String email;
    public String password;
  }
  public static class AuthResponse {
    public String token;
    public AuthResponse(String token){ this.token = token; }
  }
}