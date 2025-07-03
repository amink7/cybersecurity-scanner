package com.cybersecurity.report_service.controller;

import com.cybersecurity.report_service.model.Report;
import com.cybersecurity.report_service.service.ReportGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/report")
public class ReportController {

    @Autowired
    private ReportGeneratorService reportGeneratorService;

    private final Map<String, Report> reportsStore = new ConcurrentHashMap<>();
    @PostMapping("/generate")
    public Map<String, String> generateReport(@RequestBody Report report,
                                              @RequestParam(defaultValue = "json") String format,
                                              @RequestHeader("Authorization") String authHeader) {
        String content;
        if ("csv".equalsIgnoreCase(format)) {
            content = reportGeneratorService.generateCSVReport(report);
        } else {
            content = reportGeneratorService.generateJSONReport(report);
        }
        reportsStore.put(report.getId(), report);
        Map<String, String> resp = new HashMap<>();
        resp.put("report", content);
        return resp;
    }

    @GetMapping("/list")
    public List<Report> listReports(@RequestHeader("Authorization") String authHeader) {
        return new ArrayList<>(reportsStore.values());
    }

    @GetMapping("/download")
    public String downloadReport(@RequestParam String id,
                                 @RequestParam(defaultValue = "json") String format,
                                 @RequestHeader("Authorization") String authHeader) {
        Report report = reportsStore.get(id);
        if (report == null) return "No existe ese informe";
        if ("csv".equalsIgnoreCase(format)) {
            return reportGeneratorService.generateCSVReport(report);
        } else {
            return reportGeneratorService.generateJSONReport(report);
        }
    }
}
