package com.cmms.equipment.repository;

import com.cmms.equipment.entity.MaintenancePlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenancePlanRepository extends JpaRepository<MaintenancePlan, Integer> {
    List<MaintenancePlan> findByEquipmentId(Integer equipmentId);
}
