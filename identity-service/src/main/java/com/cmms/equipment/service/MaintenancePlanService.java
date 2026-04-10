package com.cmms.equipment.service;

import com.cmms.equipment.entity.MaintenancePlan;
import com.cmms.equipment.exception.ResourceNotFoundException;
import com.cmms.equipment.repository.MaintenancePlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenancePlanService {

    private final MaintenancePlanRepository planRepository;

    @Transactional(readOnly = true)
    public List<MaintenancePlan> getAllPlans() {
        return planRepository.findAll();
    }

    @Transactional(readOnly = true)
    public MaintenancePlan getPlanById(Integer id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance Plan not found with ID: " + id));
    }

    @Transactional
    public MaintenancePlan createPlan(MaintenancePlan plan) {
        return planRepository.save(plan);
    }

    @Transactional
    public MaintenancePlan updatePlan(Integer id, MaintenancePlan update) {
        MaintenancePlan existing = getPlanById(id);
        if (update.getEquipmentId() != null) {
            existing.setEquipmentId(update.getEquipmentId());
        }
        if (update.getName() != null) {
            existing.setName(update.getName());
        }
        if (update.getFrequency() != null) {
            existing.setFrequency(update.getFrequency());
        }
        if (update.getIntervalValue() != null) {
            existing.setIntervalValue(update.getIntervalValue());
        }
        if (update.getIntervalUnit() != null) {
            existing.setIntervalUnit(update.getIntervalUnit());
        }
        if (update.getStatus() != null) {
            existing.setStatus(update.getStatus());
        }
        if (update.getTechnicianName() != null) {
            existing.setTechnicianName(update.getTechnicianName());
        }
        if (update.getLastPerformedAt() != null) {
            existing.setLastPerformedAt(update.getLastPerformedAt());
        }
        if (update.getNextDueAt() != null) {
            existing.setNextDueAt(update.getNextDueAt());
        }
        return planRepository.save(existing);
    }

    @Transactional
    public void deletePlan(Integer id) {
        planRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<MaintenancePlan> getPlansByEquipment(Integer equipmentId) {
        return planRepository.findByEquipmentId(equipmentId);
    }
}
