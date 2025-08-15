package com.ufinet.autos.repo;

import com.ufinet.autos.domain.Car;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Long> {
  List<Car> findByOwnerId(Long ownerId);
  Optional<Car> findByIdAndOwnerId(Long id, Long ownerId);
  boolean existsByPlateIgnoreCase(String plate);
}