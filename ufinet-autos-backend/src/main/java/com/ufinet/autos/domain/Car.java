package com.ufinet.autos.domain;

import jakarta.persistence.*;

@Entity @Table(name="cars")
public class Car {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;

  @Column(nullable=false) private String brand;
  @Column(nullable=false) private String model;
  @Column(nullable=false) private Integer year;
  @Column(nullable=false, name="plate_number", unique=true) private String plateNumber;
  @Column(nullable=false) private String color;

  @ManyToOne(fetch=FetchType.LAZY)
  @JoinColumn(name="user_id", nullable=false)
  private User owner;

  // getters/setters
  public Long getId(){return id;} public void setId(Long id){this.id=id;}
  public String getBrand(){return brand;} public void setBrand(String b){this.brand=b;}
  public String getModel(){return model;} public void setModel(String m){this.model=m;}
  public Integer getYear(){return year;} public void setYear(Integer y){this.year=y;}
  public String getPlateNumber(){return plateNumber;} public void setPlateNumber(String p){this.plateNumber=p;}
  public String getColor(){return color;} public void setColor(String c){this.color=c;}
  public User getOwner(){return owner;} public void setOwner(User o){this.owner=o;}
}