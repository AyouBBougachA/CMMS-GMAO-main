package com.cmms.equipment.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "meter_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class MeterLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Integer logId;

    @Column(name = "meter_id", nullable = false)
    private Integer meterId;

    @Column(nullable = false)
    private Integer value;

    @CreatedDate
    @Column(name = "recorded_at", updatable = false)
    private LocalDateTime recordedAt;
}
