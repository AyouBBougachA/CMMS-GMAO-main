package com.cmms.equipment.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "maintenance_plans")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenancePlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plan_id")
    private Integer planId;

    @Column(name = "equipment_id", nullable = false)
    private Integer equipmentId;

    @Column(nullable = false)
    private String frequency; // e.g., MONTHLY, QUARTERLY, ANNUALLY

    @Column(name = "name")
    private String name;

    @Column(name = "interval_value")
    private Integer intervalValue;

    @Column(name = "interval_unit")
    private String intervalUnit; // e.g., DAY, MONTH, YEAR

    @Column(name = "status")
    private String status; // e.g., ACTIVE, INACTIVE, EXPIRED

    @Column(name = "technician_name")
    private String technicianName;

    @Column(name = "last_performed_at")
    private java.time.LocalDateTime lastPerformedAt;

    @Column(name = "next_due_at")
    private java.time.LocalDateTime nextDueAt;
}
