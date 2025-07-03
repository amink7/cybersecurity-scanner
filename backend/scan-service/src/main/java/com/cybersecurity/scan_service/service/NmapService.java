package com.cybersecurity.scan_service.service;

import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.HashMap;

@Service
public class NmapService {

    // Puertos comunes y timeout rápido
    private static final String DEFAULT_PORTS = "22,80,443,3389,21,25,110,143";
    private static final String DEFAULT_TIMEOUT = "20s"; // Tiempo máximo por host

    public Map<String, Object> scanPorts(String target) {
        Map<String, Object> resp = new HashMap<>();
        if (target == null || target.isBlank()) {
            resp.put("success", false);
            resp.put("error", "Falta el parámetro 'target'");
            return resp;
        }
        try {
            ProcessBuilder pb = new ProcessBuilder(
                    "nmap",
                    "-p", DEFAULT_PORTS,
                    "--host-timeout", DEFAULT_TIMEOUT,
                    "--max-retries", "1",
                    target
            );
            pb.redirectErrorStream(true);
            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;

            // Para devolverlo como antes, si lo quieres (no obligatorio):
            StringBuilder raw = new StringBuilder();

            Map<String, Boolean> ports = new LinkedHashMap<>();
            while ((line = reader.readLine()) != null) {
                raw.append(line).append("\n");
                // Busca líneas del tipo: "22/tcp   open   ssh"
                if (line.matches("\\d+/tcp\\s+(open|closed)\\s+\\S+")) {
                    String[] parts = line.trim().split("\\s+");
                    String portNum = parts[0].split("/")[0];
                    String state = parts[1];
                    ports.put(portNum, "open".equals(state));
                }
            }
            process.waitFor();

            resp.put("success", true);
            resp.put("target", target);
            resp.put("ports", ports);      // <- Esto es lo que necesita el frontend
            resp.put("rawOutput", raw.toString()); // Por si quieres mostrar el texto completo

        } catch (Exception e) {
            resp.put("success", false);
            resp.put("error", e.getMessage());
        }
        return resp;
    }
}
