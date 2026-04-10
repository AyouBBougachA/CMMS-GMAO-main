package com.cmms.equipment.controller;

import com.cmms.equipment.dto.MeterLogRequest;
import com.cmms.equipment.dto.MeterLogResponse;
import com.cmms.equipment.entity.Meter;
import com.cmms.equipment.entity.MeterLog;
import com.cmms.equipment.entity.MeterThreshold;
import com.cmms.equipment.service.MeterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/meters")
@RequiredArgsConstructor
public class MeterController {

    private final MeterService meterService;

    @GetMapping
    public List<Meter> getAll() {
        return meterService.getAllMeters();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Meter create(@RequestBody Meter request) {
        return meterService.createMeter(request);
    }

    @GetMapping("/{id}")
    public Meter getById(@PathVariable Integer id) {
        return meterService.getMeterById(id);
    }

    @PostMapping("/{id}/logs")
    @ResponseStatus(HttpStatus.CREATED)
    public MeterLogResponse recordLog(@PathVariable Integer id, @RequestBody MeterLogRequest request) {
        MeterLog log = meterService.recordLog(id, request.getValue());
        
        // Threshold Check
        Optional<String> alert = meterService.checkThreshold(id, request.getValue());
        
        return MeterLogResponse.builder()
                .logId(log.getLogId())
                .meterId(log.getMeterId())
                .value(log.getValue())
                .recordedAt(log.getRecordedAt())
                .alert(alert.orElse(null))
                .build();
    }

    @GetMapping("/{id}/logs")
    public List<MeterLog> getLogs(@PathVariable Integer id) {
        return meterService.getLogs(id);
    }

    @PostMapping("/{id}/thresholds")
    @ResponseStatus(HttpStatus.CREATED)
    public MeterThreshold createThreshold(@PathVariable Integer id, @RequestBody Integer thresholdValue) {
        return meterService.createThreshold(id, thresholdValue);
    }

    @GetMapping("/{id}/thresholds")
    public List<MeterThreshold> getThresholds(@PathVariable Integer id) {
        return meterService.getThresholds(id);
    }

    @PutMapping("/{id}")
    public Meter update(@PathVariable Integer id, @RequestBody Meter meter) {
        return meterService.updateMeter(id, meter);
    }
}
