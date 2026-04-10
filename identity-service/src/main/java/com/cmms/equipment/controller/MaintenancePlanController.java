package com.cmms.equipment.controller;

import com.cmms.equipment.dto.MaintenancePlanRequest;
import com.cmms.equipment.entity.MaintenancePlan;
import com.cmms.equipment.service.MaintenancePlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-plans")
@RequiredArgsConstructor
public class MaintenancePlanController {

    private final MaintenancePlanService maintenancePlanService;

    @GetMapping
    public List<MaintenancePlan> getAll() {
        return maintenancePlanService.getAllPlans();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MaintenancePlan create(@RequestBody MaintenancePlanRequest request) {
        MaintenancePlan plan = MaintenancePlan.builder()
                .equipmentId(request.getEquipmentId())
                .frequency(request.getFrequency())
                .name(request.getName())
                .intervalValue(request.getIntervalValue())
                .intervalUnit(request.getIntervalUnit())
                .status(request.getStatus())
                .technicianName(request.getTechnicianName())
                .lastPerformedAt(request.getLastPerformedAt())
                .nextDueAt(request.getNextDueAt())
                .build();
        return maintenancePlanService.createPlan(plan);
    }

    @GetMapping("/{id}")
    public MaintenancePlan getById(@PathVariable Integer id) {
        return maintenancePlanService.getPlanById(id);
    }

    @PutMapping("/{id}")
    public MaintenancePlan update(@PathVariable Integer id, @RequestBody MaintenancePlanRequest request) {
        MaintenancePlan update = MaintenancePlan.builder()
                .equipmentId(request.getEquipmentId())
                .frequency(request.getFrequency())
                .name(request.getName())
                .intervalValue(request.getIntervalValue())
                .intervalUnit(request.getIntervalUnit())
                .status(request.getStatus())
                .technicianName(request.getTechnicianName())
                .lastPerformedAt(request.getLastPerformedAt())
                .nextDueAt(request.getNextDueAt())
                .build();
        return maintenancePlanService.updatePlan(id, update);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        maintenancePlanService.deletePlan(id);
    }
}
