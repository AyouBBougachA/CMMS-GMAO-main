package com.cmms.equipment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeterLogResponse {
    private Integer logId;
    private Integer meterId;
    private Integer value;
    private LocalDateTime recordedAt;
    private String alert;
}
