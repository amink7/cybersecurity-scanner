package com.cybersecurity.scan_service.controller;

import com.cybersecurity.scan_service.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ScanControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    private String token;

    @BeforeEach
    void setUp() {
        // Usa cualquier usuario, solo debe ser consistente con el validador JWT
        token = jwtUtil.generateToken("testuser");
    }

    @Test
    void detectTech_retornaResultadoConJWT() throws Exception {
        mockMvc.perform(get("/scan/detect-tech")
                        .param("url", "https://wordpress.com")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("technologies")));
    }

    @Test
    void detectTech_retorna401SinJWT() throws Exception {
        mockMvc.perform(get("/scan/detect-tech")
                        .param("url", "https://wordpress.com")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void detectTech_retornaErrorSiURLinvalida() throws Exception {
        mockMvc.perform(get("/scan/detect-tech")
                        .param("url", "not_a_real_url")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("error")));
    }

    @Test
    void scanPorts_retornaResultadoConJWT() throws Exception {
        mockMvc.perform(get("/scan/scan-ports")
                        .param("target", "google.com")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("ports")));
    }

    @Test
    void scanPorts_retorna401SinJWT() throws Exception {
        mockMvc.perform(get("/scan/scan-ports")
                        .param("target", "google.com")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

}
