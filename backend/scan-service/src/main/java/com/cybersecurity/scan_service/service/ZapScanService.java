package com.cybersecurity.scan_service.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class ZapScanService {


    private final String zapApi = System.getenv().getOrDefault("ZAP_API_URL", "http://zap:8090");

    @PostConstruct
    public void printZapApiUrl() {
        System.out.println("⚡️ ZAP API URL utilizada: " + this.zapApi);
    }

    public List<Map<String, Object>> scanWithZap(String targetUrl) throws Exception {
        RestTemplate rest = new RestTemplate();
        ObjectMapper mapper = new ObjectMapper();

        // 1. Lanzar el Spider
        String spiderUrl = zapApi + "/JSON/spider/action/scan/?url=" + targetUrl + "&maxChildren=5";
        Map<String, Object> spiderResp = rest.getForObject(spiderUrl, Map.class);
        String scanId = spiderResp.get("scan").toString();

        // 2. Esperar a que el Spider termine
        boolean spiderDone = false;
        while (!spiderDone) {
            Thread.sleep(2000);
            String statusUrl = zapApi + "/JSON/spider/view/status/?scanId=" + scanId;
            Map<String, Object> statusResp = rest.getForObject(statusUrl, Map.class);
            String status = statusResp.get("status").toString();
            if ("100".equals(status)) {
                spiderDone = true;
            }
        }

        // 3. Lanzar el Active Scan
        String ascanUrl = zapApi + "/JSON/ascan/action/scan/?url=" + targetUrl + "&recurse=true";
        Map<String, Object> ascanResp = rest.getForObject(ascanUrl, Map.class);
        String ascanId = ascanResp.get("scan").toString();

        // 4. Esperar a que el Active Scan termine
        boolean ascanDone = false;
        while (!ascanDone) {
            Thread.sleep(2000);
            String statusUrl = zapApi + "/JSON/ascan/view/status/?scanId=" + ascanId;
            Map<String, Object> statusResp = rest.getForObject(statusUrl, Map.class);
            String status = statusResp.get("status").toString();
            if ("100".equals(status)) {
                ascanDone = true;
            }
        }

        // 5. Obtener resultados en formato JSON y parsear
        String alertsUrl = zapApi + "/JSON/alert/view/alerts/?baseurl=" + targetUrl;
        String alertsRaw = rest.getForObject(alertsUrl, String.class);

        JsonNode root = mapper.readTree(alertsRaw);
        JsonNode alerts = root.path("alerts");
        List<Map<String, Object>> alertsList = mapper.convertValue(
                alerts, new TypeReference<List<Map<String, Object>>>(){});

        // Agrupa para eliminar repetidos (por alerta + risk)
        Map<String, Map<String, Object>> grouped = new LinkedHashMap<>();

        for (Map<String, Object> alert : alertsList) {
            String name = (String) alert.get("alert");
            String risk = (String) alert.get("risk");
            String key = name + "|" + risk;

            // Añade la URL a una lista de URLs por alerta
            String url = (String) alert.get("url");
            if (!grouped.containsKey(key)) {
                List<String> urls = new ArrayList<>();
                urls.add(url);
                alert.put("urls", urls);
                grouped.put(key, new HashMap<>(alert));
            } else {
                // Si ya existe, añade la url si no está
                Map<String, Object> existing = grouped.get(key);
                List<String> urls = (List<String>) existing.get("urls");
                if (!urls.contains(url)) {
                    urls.add(url);
                }
            }
        }

        // Convierte el map agrupado a lista
        List<Map<String, Object>> result = new ArrayList<>(grouped.values());

        return result;
    }
}
