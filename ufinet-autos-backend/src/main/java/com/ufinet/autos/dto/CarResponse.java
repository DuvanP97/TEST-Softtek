package com.ufinet.autos.dto;

import java.time.Instant;

public record CarResponse(
  Long id, String brand, String model, int year, String plate, String color,
  Instant createdAt, Instant updatedAt
) {}