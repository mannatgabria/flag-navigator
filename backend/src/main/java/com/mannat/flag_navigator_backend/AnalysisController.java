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
    private final AiAnalysisService aiAnalysisService;
    private final OllamaAnalysisService ollamaAnalysisService;

    public AnalysisController(
            AnalysisService analysisService,
            AiAnalysisService aiAnalysisService,
            OllamaAnalysisService ollamaAnalysisService
    ) {
        this.analysisService = analysisService;
        this.aiAnalysisService = aiAnalysisService;
        this.ollamaAnalysisService = ollamaAnalysisService;
    }

    @GetMapping("/health")
    public String health() {
        return "Backend works";
    }

    @PostMapping("/analyze")
    public AnalyzeResponse analyze(@RequestBody Map<String, Object> body) {
        AnalyzeRequest request = createAnalyzeRequest(body);

        return analysisService.analyze(request);
    }

    @PostMapping("/ai-analyze")
    public AnalyzeResponse aiAnalyze(@RequestBody Map<String, Object> body) {
        AnalyzeRequest request = createAnalyzeRequest(body);

        return aiAnalysisService.analyze(request);
    }

    @PostMapping("/local-ai-analyze")
    public AnalyzeResponse localAiAnalyze(@RequestBody Map<String, Object> body) {
        AnalyzeRequest request = createAnalyzeRequest(body);

        return ollamaAnalysisService.analyze(request);
    }

    private AnalyzeRequest createAnalyzeRequest(Map<String, Object> body) {
        String text = String.valueOf(body.getOrDefault("text", ""));
        String context = String.valueOf(body.getOrDefault("context", "dating"));
        String person = String.valueOf(body.getOrDefault("person", "not-relevant"));

        return new AnalyzeRequest(text, context, person);
    }
}