package com.cybersecurity.report_service.service;

import com.cybersecurity.report_service.model.Report;
import com.cybersecurity.report_service.model.ScanResult;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;

import java.io.StringWriter;
import java.util.*;

@Service
public class ReportGeneratorService {

    public String generateCSVReport(Report report) {
        try {
            StringWriter writer = new StringWriter();
            // Cabecera para los resultados de ScanResult
            CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT
                    .withHeader("ID", "Usuario", "Fecha", "Tipo", "Target", "OpenPorts", "Tech"));

            // Por cada resultado, imprime una fila completa
            for (ScanResult result : report.getResults()) {
                csvPrinter.printRecord(
                        report.getId(),
                        report.getUsername(),
                        report.getDate(),
                        report.getType(),
                        result.getTarget(),
                        result.getOpenPorts(),
                        result.getTech()
                );
            }
            csvPrinter.flush();
            return writer.toString();
        } catch (Exception e) {
            return "ERROR: " + e.getMessage();
        }
    }

    public String generateJSONReport(Report report) {
        StringBuilder sb = new StringBuilder();
        sb.append("{\n");
        sb.append("  \"id\": \"").append(report.getId()).append("\",\n");
        sb.append("  \"username\": \"").append(report.getUsername()).append("\",\n");
        sb.append("  \"date\": \"").append(report.getDate()).append("\",\n");
        sb.append("  \"type\": \"").append(report.getType()).append("\",\n");
        sb.append("  \"results\": ").append(report.getResults().toString()).append("\n");
        sb.append("}");
        return sb.toString();
    }
}
