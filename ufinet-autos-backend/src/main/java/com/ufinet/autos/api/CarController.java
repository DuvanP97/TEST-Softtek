// src/main/java/com/ufinet/autos/api/CarController.java
package com.ufinet.autos.api;

import com.ufinet.autos.dto.CarRequest;
import com.ufinet.autos.dto.CarResponse;
import com.ufinet.autos.service.CarService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarController {

  private final CarService service;

  public CarController(CarService service) { this.service = service; }

  @PostMapping
  public ResponseEntity<CarResponse> create(@Valid @RequestBody CarRequest req) {
    CarResponse created = service.create(req);
    return ResponseEntity.created(URI.create("/api/cars/" + created.id())).body(created);
  }

  @GetMapping
  public List<CarResponse> listMine() {
    return service.listMine();
  }

  @GetMapping("/{id}")
  public CarResponse getOne(@PathVariable Long id) {
    return service.getMine(id);
  }

  @PutMapping("/{id}")
  public CarResponse update(@PathVariable Long id, @Valid @RequestBody CarRequest req) {
    return service.update(id, req);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}