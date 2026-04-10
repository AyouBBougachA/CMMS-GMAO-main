package com.cmms.equipment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentRequest {
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
}
