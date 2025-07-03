package com.cybersecurity.report_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Report {
    private String id;
    private String username;
    private Date date;
    private String type; // "scan", "tech", "ports", etc
    private List<ScanResult> results;
}
