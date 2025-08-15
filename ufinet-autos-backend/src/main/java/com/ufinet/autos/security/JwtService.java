package com.ufinet.autos.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {
  private final Key key;
  private final long expirationMs;

  public JwtService(
      @Value("${app.jwt.secret}") String secret,
      @Value("${app.jwt.expiration-ms}") long expirationMs) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes());
    this.expirationMs = expirationMs;
  }

  public String generateToken(String subject, Map<String, Object> claims) {
    long now = System.currentTimeMillis();
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(subject)  
        .setIssuedAt(new Date(now))
        .setExpiration(new Date(now + expirationMs))
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  public Jws<Claims> parse(String token) {
    return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
  }

  public String getSubject(String token) {
    return parse(token).getBody().getSubject();
  }
}