package com.cmms.equipment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentResponse {
    private Integer equipmentId;
    private String name;
    private String serialNumber;
    private String status;
    private String location;
    private Integer departmentId;
    private String manufacturer;
    private String modelReference;
    private String classification;
    private String criticality;
    private LocalDate purchaseDate;
    private LocalDate commissioningDate;
    private String supplierName;
    private String contractNumber;
    private LocalDate warrantyEndDate;
    private LocalDateTime createdAt;
}
