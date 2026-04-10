package com.cmms.equipment.controller;

import com.cmms.equipment.dto.EquipmentRequest;
import com.cmms.equipment.dto.EquipmentResponse;
import com.cmms.equipment.entity.Equipment;
import com.cmms.equipment.entity.EquipmentHistory;
import com.cmms.equipment.entity.EquipmentStatus;
import com.cmms.equipment.service.EquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping
    public List<EquipmentResponse> getAll() {
        return equipmentService.getAllEquipment().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/search")
    public List<EquipmentResponse> search(
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String q) {
        return equipmentService.searchEquipment(departmentId, status, q).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public EquipmentResponse create(@RequestBody EquipmentRequest request) {
        Equipment equipment = Equipment.builder()
                .name(request.getName())
                .serialNumber(request.getSerialNumber())
                .status(EquipmentStatus.valueOf(request.getStatus()))
                .location(request.getLocation())
                .departmentId(request.getDepartmentId())
                .manufacturer(request.getManufacturer())
                .modelReference(request.getModelReference())
                .classification(request.getClassification())
                .criticality(request.getCriticality())
                .purchaseDate(request.getPurchaseDate())
                .commissioningDate(request.getCommissioningDate())
                .supplierName(request.getSupplierName())
                .contractNumber(request.getContractNumber())
                .warrantyEndDate(request.getWarrantyEndDate())
                .build();
        return mapToResponse(equipmentService.createEquipment(equipment));
    }

    @GetMapping("/{id}")
    public EquipmentResponse getById(@PathVariable Integer id) {
        return mapToResponse(equipmentService.getEquipmentById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public EquipmentResponse update(@PathVariable Integer id, @RequestBody EquipmentRequest request) {
        Equipment update = Equipment.builder()
                .name(request.getName())
                .serialNumber(request.getSerialNumber())
                .status(EquipmentStatus.valueOf(request.getStatus()))
                .location(request.getLocation())
                .departmentId(request.getDepartmentId())
                .manufacturer(request.getManufacturer())
                .modelReference(request.getModelReference())
                .classification(request.getClassification())
                .criticality(request.getCriticality())
                .purchaseDate(request.getPurchaseDate())
                .commissioningDate(request.getCommissioningDate())
                .supplierName(request.getSupplierName())
                .contractNumber(request.getContractNumber())
                .warrantyEndDate(request.getWarrantyEndDate())
                .build();
        return mapToResponse(equipmentService.updateEquipment(id, update));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public EquipmentResponse updateStatus(@PathVariable Integer id, @RequestParam String status) {
        return mapToResponse(equipmentService.updateStatus(id, status));
    }

    @PatchMapping("/{id}/archive")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public EquipmentResponse archive(@PathVariable Integer id) {
        return mapToResponse(equipmentService.archiveEquipment(id));
    }

    @GetMapping("/{id}/history")
    public List<EquipmentHistory> getHistory(@PathVariable Integer id) {
        return equipmentService.getHistory(id);
    }

    private EquipmentResponse mapToResponse(Equipment equipment) {
        return EquipmentResponse.builder()
                .equipmentId(equipment.getEquipmentId())
                .name(equipment.getName())
                .serialNumber(equipment.getSerialNumber())
                .status(equipment.getStatus().name())
                .location(equipment.getLocation())
                .departmentId(equipment.getDepartmentId())
            .manufacturer(equipment.getManufacturer())
            .modelReference(equipment.getModelReference())
            .classification(equipment.getClassification())
            .criticality(equipment.getCriticality())
            .purchaseDate(equipment.getPurchaseDate())
            .commissioningDate(equipment.getCommissioningDate())
            .supplierName(equipment.getSupplierName())
            .contractNumber(equipment.getContractNumber())
            .warrantyEndDate(equipment.getWarrantyEndDate())
                .createdAt(equipment.getCreatedAt())
                .build();
    }
}
