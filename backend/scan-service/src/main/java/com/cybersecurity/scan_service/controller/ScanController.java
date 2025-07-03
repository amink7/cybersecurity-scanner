package com.cybersecurity.scan_service.controller;

import com.cybersecurity.scan_service.service.NmapService;
import com.cybersecurity.scan_service.service.ZapScanService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.InetAddress;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/scan")
public class ScanController {

    @GetMapping("/analyze-client")
    public Map<String, Object> analyzeClient(HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        result.put("ip", request.getRemoteAddr());
        result.put("userAgent", request.getHeader("User-Agent"));
        result.put("headers", Collections.list(request.getHeaderNames()).stream()
                .collect(Collectors.toMap(h -> h, request::getHeader)));
        return result;
    }

    @GetMapping("/analyze")
    public Map<String, Object> analyzeTarget(@RequestParam String target) {
        Map<String, Object> result = new HashMap<>();
        try {
            InetAddress inetAddress = InetAddress.getByName(target);
            result.put("hostAddress", inetAddress.getHostAddress());
            result.put("hostName", inetAddress.getHostName());
            result.put("reachable", inetAddress.isReachable(2000));
        } catch (Exception e) {
            result.put("error", e.getMessage());
        }
        return result;
    }

    @GetMapping("/scan-ports")
    public Map<String, Object> scanPorts(@RequestParam String target) {
        int[] ports = {22, 80, 443, 3306, 8080, 5432};
        Map<String, Boolean> portResults = new HashMap<>();
        for (int port : ports) {
            try (java.net.Socket socket = new java.net.Socket()) {
                socket.connect(new java.net.InetSocketAddress(target, port), 500);
                portResults.put(String.valueOf(port), true);
            } catch (Exception e) {
                portResults.put(String.valueOf(port), false);
            }
        }
        Map<String, Object> result = new HashMap<>();
        result.put("target", target);
        result.put("ports", portResults);
        return result;
    }

    @GetMapping("/check-headers")
    public Map<String, Object> checkHeaders(@RequestParam String url) {
        Map<String, Object> result = new HashMap<>();
        try {
            java.net.URL targetUrl = new java.net.URL(url);
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) targetUrl.openConnection();
            conn.setConnectTimeout(2000);
            conn.setReadTimeout(2000);
            conn.setRequestMethod("GET");
            conn.connect();

            String[] headers = {
                    "Content-Security-Policy", "Strict-Transport-Security",
                    "X-Frame-Options", "X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy"
            };

            Map<String, String> headerResults = new HashMap<>();
            for (String header : headers) {
                String value = conn.getHeaderField(header);
                headerResults.put(header, value != null ? value : "Not set");
            }
            result.put("url", url);
            result.put("securityHeaders", headerResults);
        } catch (Exception e) {
            result.put("error", e.getMessage());
        }
        return result;
    }

    @GetMapping("/analyze-user-agent")
    public Map<String, String> analyzeUserAgent(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        Map<String, String> result = new HashMap<>();
        result.put("userAgent", userAgent);

        // Detección básica del SO y navegador (muy simple)
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

    @GetMapping("/detect-tech")
    public Map<String, Object> detectTechnology(@RequestParam String url) {
        Map<String, Object> result = new HashMap<>();
        List<String> technologies = new ArrayList<>();
        try {
            java.net.URL targetUrl = new java.net.URL(url);
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) targetUrl.openConnection();
            conn.setConnectTimeout(2000);
            conn.setReadTimeout(2000);
            conn.setRequestMethod("GET");
            conn.connect();

            // Cabeceras conocidas
            String server = conn.getHeaderField("Server");
            String poweredBy = conn.getHeaderField("X-Powered-By");
            if (server != null) technologies.add("Server: " + server);
            if (poweredBy != null) technologies.add("X-Powered-By: " + poweredBy);

            // Analiza HTML en busca de patrones sencillos
            StringBuilder html = new StringBuilder();
            try (java.io.BufferedReader in = new java.io.BufferedReader(
                    new java.io.InputStreamReader(conn.getInputStream()))) {
                String line;
                while ((line = in.readLine()) != null) {
                    html.append(line);
                }
            }

            String htmlContent = html.toString().toLowerCase();
            if (htmlContent.contains("/wp-content/") || htmlContent.contains("wp-includes")) {
                technologies.add("WordPress");
            }
            if (htmlContent.contains("drupal")) {
                technologies.add("Drupal");
            }
            if (htmlContent.contains("joomla")) {
                technologies.add("Joomla");
            }
            if (htmlContent.contains("shopify")) {
                technologies.add("Shopify");
            }
            if (htmlContent.contains("magento")) {
                technologies.add("Magento");
            }
            // Puedes añadir más patrones si quieres

            result.put("url", url);
            result.put("technologies", technologies.isEmpty() ? "No detectado" : technologies);

        } catch (Exception e) {
            result.put("error", e.getMessage());
        }
        return result;
    }

    @Autowired
    private NmapService nmapService;

    @PostMapping("/ports")
    public Map<String, Object> scanPorts(@RequestBody Map<String, String> body) {
        String target = body.get("target");
        return nmapService.scanPorts(target);
    }

    @Autowired
    private ZapScanService zapScanService;

    @PostMapping("/zap")
    public ResponseEntity<?> zapScan(@RequestBody Map<String, String> body) {
        String targetUrl = body.get("targetUrl");
        if (targetUrl == null || targetUrl.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "targetUrl vacío"));
        }
        try {
            List<Map<String, Object>> results = zapScanService.scanWithZap(targetUrl);
            return ResponseEntity.ok(Map.of("success", true, "results", results));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "error", e.getMessage()));
        }
    }








}
