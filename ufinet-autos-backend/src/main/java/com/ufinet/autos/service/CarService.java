package com.ufinet.autos.service;

import com.ufinet.autos.domain.Car;
import com.ufinet.autos.domain.User;
import com.ufinet.autos.dto.CarRequest;
import com.ufinet.autos.dto.CarResponse;
import com.ufinet.autos.repo.CarRepository;
import com.ufinet.autos.repo.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CarService {
  private final CarRepository carRepo;
  private final UserRepository userRepo;

  public CarService(CarRepository carRepo, UserRepository userRepo) {
    this.carRepo = carRepo;
    this.userRepo = userRepo;
  }

  public CarResponse create(CarRequest req) {
    if (carRepo.existsByPlateIgnoreCase(req.plate())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "La placa ya existe");
    }
    User owner = currentUser();
    Car c = new Car();
    c.setBrand(req.brand());
    c.setModel(req.model());
    c.setYear(req.year());
    c.setPlate(req.plate());
    c.setColor(req.color());
    c.setOwner(owner);
    carRepo.save(c);
    return map(c);
  }

  public List<CarResponse> listMine() {
    return carRepo.findByOwnerId(currentUser().getId())
                  .stream().map(this::map).toList();
  }

  public CarResponse getMine(Long id) {
    Car c = carRepo.findByIdAndOwnerId(id, currentUser().getId())
                   .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return map(c);
  }

  public CarResponse update(Long id, CarRequest req) {
    User owner = currentUser();
    Car c = carRepo.findByIdAndOwnerId(id, owner.getId())
                   .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    if (!c.getPlate().equalsIgnoreCase(req.plate())
        && carRepo.existsByPlateIgnoreCase(req.plate())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "La placa ya existe");
    }
    c.setBrand(req.brand());
    c.setModel(req.model());
    c.setYear(req.year());
    c.setPlate(req.plate());
    c.setColor(req.color());
    carRepo.save(c);
    return map(c);
  }

  public void delete(Long id) {
    Car c = carRepo.findByIdAndOwnerId(id, currentUser().getId())
                   .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    carRepo.delete(c);
  }

  private User currentUser() {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepo.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
  }

  private CarResponse map(Car c) {
    return new CarResponse(
      c.getId(), c.getBrand(), c.getModel(), c.getYear(), c.getPlate(), c.getColor(),
      c.getCreatedAt(), c.getUpdatedAt()
    );
  }
}