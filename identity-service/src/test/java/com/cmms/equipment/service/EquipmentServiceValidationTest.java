package com.cmms.equipment.service;

import com.cmms.equipment.client.IdentityServiceClient;
import com.cmms.equipment.entity.Equipment;
import com.cmms.equipment.entity.EquipmentHistory;
import com.cmms.equipment.entity.EquipmentStatus;
import com.cmms.equipment.repository.EquipmentHistoryRepository;
import com.cmms.equipment.repository.EquipmentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EquipmentServiceValidationTest {

    @Mock
    private EquipmentRepository equipmentRepository;

    @Mock
    private EquipmentHistoryRepository historyRepository;

    @Mock
    private IdentityServiceClient identityServiceClient;

    @InjectMocks
    private EquipmentService equipmentService;

    @Test
    void createEquipmentRejectsUnknownDepartment() {
        Equipment equipment = Equipment.builder()
                .name("Pump")
                .status(EquipmentStatus.OPERATIONAL)
                .departmentId(99)
                .build();

        when(identityServiceClient.checkDepartmentExists(99)).thenReturn(false);

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> equipmentService.createEquipment(equipment)
        );

        assertEquals("Failed to validate Department ID with Identity Service", ex.getMessage());
        verify(identityServiceClient).checkDepartmentExists(99);
    }

    @Test
    void createEquipmentPersistsWhenDepartmentExists() {
        Equipment equipment = Equipment.builder()
                .name("Pump")
                .status(EquipmentStatus.OPERATIONAL)
                .departmentId(1)
                .build();

        Equipment saved = Equipment.builder()
                .equipmentId(1)
                .name("Pump")
                .status(EquipmentStatus.OPERATIONAL)
                .departmentId(1)
                .build();

        when(identityServiceClient.checkDepartmentExists(1)).thenReturn(true);
        when(equipmentRepository.save(equipment)).thenReturn(saved);
        when(historyRepository.save(any(EquipmentHistory.class)))
                .thenReturn(EquipmentHistory.builder().build());

        Equipment result = equipmentService.createEquipment(equipment);

        assertEquals(1, result.getEquipmentId());
        verify(identityServiceClient).checkDepartmentExists(1);
        verify(historyRepository).save(any(EquipmentHistory.class));
    }
}
