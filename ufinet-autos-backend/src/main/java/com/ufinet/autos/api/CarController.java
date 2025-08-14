package com.ufinet.autos.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController @RequestMapping("/api/cars")
public class CarController {
  @GetMapping public ResponseEntity<?> list(){ return ResponseEntity.ok(List.of()); }
  @PostMapping public ResponseEntity<?> create(@RequestBody Map<String,Object> body){
    return ResponseEntity.status(501).body(Map.of("message","Create car not implemented yet"));
  }
  @PutMapping("/{id}") public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String,Object> body){
    return ResponseEntity.status(501).body(Map.of("message","Update car not implemented yet"));
  }
  @DeleteMapping("/{id}") public ResponseEntity<?> delete(@PathVariable Long id){
    return ResponseEntity.status(501).body(Map.of("message","Delete car not implemented yet"));
  }
}