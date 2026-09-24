package com.mannat.flag_navigator_backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class AnalysisController {

    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @GetMapping("/health")
    public String health() {
        return "Backend works";
    }

    @PostMapping("/analyze")
    public AnalyzeResponse analyze(@RequestBody Map<String, Object> body) {
        String text = String.valueOf(body.getOrDefault("text", ""));
        String context = String.valueOf(body.getOrDefault("context", "dating"));
        String person = String.valueOf(body.getOrDefault("person", "not-relevant"));

        AnalyzeRequest request = new AnalyzeRequest(text, context, person);

        return analysisService.analyze(request);
    }
}