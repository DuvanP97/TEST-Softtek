package com.ufinet.autos.security;

import com.ufinet.autos.domain.User;
import com.ufinet.autos.repo.UserRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends GenericFilter {
  private final JwtService jwtService;
  private final UserRepository userRepo;

  public JwtAuthFilter(JwtService jwtService, UserRepository userRepo) {
    this.jwtService = jwtService;
    this.userRepo = userRepo;
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {

    HttpServletRequest req = (HttpServletRequest) request;
    String header = req.getHeader("Authorization");
    if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
      String token = header.substring(7);
      try {
        String email = jwtService.getSubject(token);
        User user = userRepo.findByEmail(email).orElse(null);
        if (user != null) {
          var auth = new UsernamePasswordAuthenticationToken(
              email, null, List.of() 
          );
          SecurityContextHolder.getContext().setAuthentication(auth);
        }
      } catch (Exception ignored) {}
    }
    chain.doFilter(request, response);
  }
}