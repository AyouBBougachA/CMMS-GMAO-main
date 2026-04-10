package com.cmms.equipment.service;

import com.cmms.equipment.entity.Meter;
import com.cmms.equipment.entity.MeterLog;
import com.cmms.equipment.entity.MeterThreshold;
import com.cmms.equipment.exception.ResourceNotFoundException;
import com.cmms.equipment.repository.MeterLogRepository;
import com.cmms.equipment.repository.MeterRepository;
import com.cmms.equipment.repository.MeterThresholdRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MeterService {

    private final MeterRepository meterRepository;
    private final MeterLogRepository logRepository;
    private final MeterThresholdRepository thresholdRepository;

    @Transactional(readOnly = true)
    public List<Meter> getAllMeters() {
        return meterRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Meter getMeterById(Integer id) {
        return meterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meter not found with ID: " + id));
    }

    @Transactional
    public Meter createMeter(Meter meter) {
        return meterRepository.save(meter);
    }

    @Transactional
    public MeterLog recordLog(Integer meterId, Integer value) {
        Meter meter = getMeterById(meterId);
        
        // 1. Create Log
        MeterLog log = MeterLog.builder()
                .meterId(meterId)
                .value(value)
                .build();
        
        // 2. Update Meter Current Value
        meter.setValue(value);
        meterRepository.save(meter);
        
        return logRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<MeterLog> getLogs(Integer meterId) {
        return logRepository.findByMeterIdOrderByRecordedAtDesc(meterId);
    }

    @Transactional
    public MeterThreshold createThreshold(Integer meterId, Integer thresholdValue) {
         MeterThreshold threshold = MeterThreshold.builder()
                .meterId(meterId)
                .thresholdValue(thresholdValue)
                .build();
        return thresholdRepository.save(threshold);
    }

    @Transactional(readOnly = true)
    public List<MeterThreshold> getThresholds(Integer meterId) {
        return thresholdRepository.findByMeterId(meterId);
    }

    @Transactional(readOnly = true)
    public Optional<String> checkThreshold(Integer meterId, Integer value) {
        List<MeterThreshold> thresholds = thresholdRepository.findByMeterId(meterId);
        for (MeterThreshold threshold : thresholds) {
            if (value >= threshold.getThresholdValue()) {
                return Optional.of("Threshold Exceeded: Current " + value + " >= Threshold " + threshold.getThresholdValue());
            }
        }
        return Optional.empty();
    }
    @Transactional
    public Meter updateMeter(Integer id, Meter meterDetails) {
        Meter meter = getMeterById(id);
        if (meterDetails.getName() != null) meter.setName(meterDetails.getName());
        if (meterDetails.getUnit() != null) meter.setUnit(meterDetails.getUnit());
        if (meterDetails.getMeterType() != null) meter.setMeterType(meterDetails.getMeterType());
        if (meterDetails.getEquipmentId() != null) meter.setEquipmentId(meterDetails.getEquipmentId());
        return meterRepository.save(meter);
    }
}
