package com.cmms.equipment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenancePlanRequest {
    private Integer equipmentId;
    private String name;
    private String frequency;
    private Integer intervalValue;
    private String intervalUnit;
    private String status;
    private String technicianName;
    private java.time.LocalDateTime lastPerformedAt;
    private java.time.LocalDateTime nextDueAt;
}
