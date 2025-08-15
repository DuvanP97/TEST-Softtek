package com.ufinet.autos.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.Instant;

@Entity
@Table(
  name = "cars",
  uniqueConstraints = @UniqueConstraint(
    name = "uk_cars_plate_number",
    columnNames = "plate_number"
  )
)
public class Car {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank @Size(max = 80)
  private String brand;

  @NotBlank @Size(max = 120)
  private String model;

  @Min(1900) @Max(2100)
  private int year;

  @NotBlank @Size(max = 40)
  private String color;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_cars_user"))
  @JsonIgnore
  private User owner;

  @Column(name = "plate_number", nullable = false, length = 20)
  @NotBlank
  @Size(max = 20)
  private String plate;

  @Column(nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  @Column(nullable = false)
  private Instant updatedAt = Instant.now();

  @PreUpdate
  public void onUpdate() { this.updatedAt = Instant.now(); }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getBrand() { return brand; }
  public void setBrand(String brand) { this.brand = brand; }

  public String getModel() { return model; }
  public void setModel(String model) { this.model = model; }

  public int getYear() { return year; }
  public void setYear(int year) { this.year = year; }

  public String getPlate() { return plate; }
  public void setPlate(String plate) { this.plate = plate; }

  public String getColor() { return color; }
  public void setColor(String color) { this.color = color; }

  public User getOwner() { return owner; }
  public void setOwner(User owner) { this.owner = owner; }

  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}