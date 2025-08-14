package com.ufinet.autos.domain;

import jakarta.persistence.*;
import java.util.*;

@Entity @Table(name="users")
public class User {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;

  @Column(nullable=false, unique=true)
  private String email;

  @Column(nullable=false, name="password_hash")
  private String passwordHash;

  @Column(nullable=false, name="full_name")
  private String fullName;

  @OneToMany(mappedBy="owner", cascade=CascadeType.ALL, orphanRemoval=true)
  private List<Car> cars = new ArrayList<>();

  // getters/setters
  public Long getId(){return id;} public void setId(Long id){this.id=id;}
  public String getEmail(){return email;} public void setEmail(String e){this.email=e;}
  public String getPasswordHash(){return passwordHash;} public void setPasswordHash(String p){this.passwordHash=p;}
  public String getFullName(){return fullName;} public void setFullName(String n){this.fullName=n;}
  public List<Car> getCars(){return cars;} public void setCars(List<Car> c){this.cars=c;}
}