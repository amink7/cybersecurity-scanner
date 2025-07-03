package com.cybersecurity.report_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScanResult {
    private String target;
    private String openPorts; // Ejemplo: "22,80"
    private String tech;      // Ejemplo: "Apache, PHP"
    // Añade más campos si lo necesitas
}
