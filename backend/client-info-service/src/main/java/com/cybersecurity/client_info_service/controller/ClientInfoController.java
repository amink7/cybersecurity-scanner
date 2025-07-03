package com.cybersecurity.client_info_service.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/client-info")
public class ClientInfoController {

    // 1. Información completa de headers y datos de conexión
    @GetMapping("/details")
    public Map<String, Object> getClientDetails(HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        result.put("ip", request.getRemoteAddr());
        result.put("userAgent", request.getHeader("User-Agent"));
        result.put("headers", Collections.list(request.getHeaderNames()).stream()
                .collect(Collectors.toMap(h -> h, request::getHeader)));
        return result;
    }

    // 2. Fingerprint básico del cliente (hash de headers + IP)
    @GetMapping("/fingerprint")
    public Map<String, Object> getFingerprint(HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        String accept = request.getHeader("Accept");
        String acceptLang = request.getHeader("Accept-Language");
        String fingerprintRaw = ip + "|" + userAgent + "|" + accept + "|" + acceptLang;
        String fingerprint = Integer.toHexString(fingerprintRaw.hashCode());
        Map<String, Object> result = new HashMap<>();
        result.put("fingerprint", fingerprint);
        result.put("ip", ip);
        return result;
    }

    // 3. Análisis de User-Agent (SO y navegador)
    @GetMapping("/analyze-user-agent")
    public Map<String, String> analyzeUserAgent(@RequestHeader(value = "User-Agent", required = false) String userAgent) {
        Map<String, String> result = new HashMap<>();
        result.put("userAgent", userAgent != null ? userAgent : "Unknown");
        if (userAgent != null) {
            if (userAgent.contains("Windows")) result.put("os", "Windows");
            else if (userAgent.contains("Mac")) result.put("os", "Mac OS");
            else if (userAgent.contains("Linux")) result.put("os", "Linux");
            else result.put("os", "Unknown");

            if (userAgent.contains("Chrome")) result.put("browser", "Chrome");
            else if (userAgent.contains("Firefox")) result.put("browser", "Firefox");
            else if (userAgent.contains("Safari") && !userAgent.contains("Chrome")) result.put("browser", "Safari");
            else if (userAgent.contains("Edge")) result.put("browser", "Edge");
            else result.put("browser", "Unknown");
        } else {
            result.put("os", "Unknown");
            result.put("browser", "Unknown");
        }
        return result;
    }

    @GetMapping("/client-info/geoip")
    public ResponseEntity<?> geoIp(HttpServletRequest request) {
        try {
            String ip = request.getHeader("X-Forwarded-For");
            if (ip == null || ip.isEmpty()) {
                ip = request.getRemoteAddr();
            }
            // Si la IP es 127.0.0.1, intenta obtener tu IP pública
            if (ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1")) {
                RestTemplate restTemplate = new RestTemplate();
                Map<String, String> ipMap = restTemplate.getForObject("https://api.ipify.org?format=json", Map.class);
                ip = ipMap.get("ip");
            }
            // GeoIP externo
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://ip-api.com/json/" + ip;
            Map<String, Object> geoIp = restTemplate.getForObject(url, Map.class);
            return ResponseEntity.ok(geoIp);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }


}
