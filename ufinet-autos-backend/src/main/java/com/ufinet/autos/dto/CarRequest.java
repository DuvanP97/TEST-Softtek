package com.ufinet.autos.dto;

import jakarta.validation.constraints.*;

public record CarRequest(
  @NotBlank @Size(max = 80) String brand,
  @NotBlank @Size(max = 120) String model,
  @Min(1900) @Max(2100) int year,
  @NotBlank @Size(max = 20) String plate,
  @NotBlank @Size(max = 40) String color
) {}