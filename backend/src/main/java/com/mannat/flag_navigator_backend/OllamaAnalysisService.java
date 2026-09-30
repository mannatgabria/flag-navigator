package com.mannat.flag_navigator_backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
public class OllamaAnalysisService {

    private final AnalysisService fallbackAnalysisService;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public OllamaAnalysisService(AnalysisService fallbackAnalysisService) {
        this.fallbackAnalysisService = fallbackAnalysisService;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newHttpClient();
    }

    public AnalyzeResponse analyze(AnalyzeRequest request) {
        try {
            String requestJson = objectMapper.writeValueAsString(createOllamaRequest(request));

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:11434/api/generate"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    httpRequest,
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return fallbackResponse(request, "Lokal AI feilet. Bruker regelbasert analyse som fallback.");
            }

            JsonNode responseJson = objectMapper.readTree(response.body());
            String outputText = responseJson.path("response").asText();

            return objectMapper.readValue(outputText, AnalyzeResponse.class);

        } catch (Exception error) {
            return fallbackResponse(request, "Lokal AI feilet. Bruker regelbasert analyse som fallback.");
        }
    }

    private Map<String, Object> createOllamaRequest(AnalyzeRequest request) {
        String prompt = """
                Du er Flag Navigator, en forsiktig analysemodell for dating- og relasjonssituasjoner.

                Analyser teksten på norsk.
                Ikke si at brukeren må slå opp, bli, tilgi eller velge.
                Fokuser på mønster, grenser, kommunikasjon, trygghet og alvorlighetsgrad.

                Kategorier:
                - green: positivt tegn
                - minimum: vanlig respekt / bare minimum
                - yellow: usikkert eller blandet signal
                - ick: klein eller avtennende oppførsel, men ikke nødvendigvis farlig
                - red: kontrollerende, pressende, skremmende eller tydelig problematisk
                - unknown: for lite informasjon

                Tekst: %s
                Kontekst: %s
                Personen som vurderes: %s

                Returner bare gyldig JSON.
                """.formatted(
                request.text(),
                request.context(),
                request.person());

        Map<String, Object> schema = Map.of(
                "type", "object",
                "additionalProperties", false,
                "properties", Map.of(
                        "category", Map.of(
                                "type", "string",
                                "enum", List.of("green", "minimum", "yellow", "ick", "red", "unknown")),
                        "score", Map.of("type", "integer"),
                        "label", Map.of("type", "string"),
                        "severity", Map.of("type", "string"),
                        "bareMinimum", Map.of("type", "boolean"),
                        "matchedThemes", Map.of(
                                "type", "array",
                                "items", Map.of("type", "string")),
                        "explanation", Map.of("type", "string"),
                        "advice", Map.of("type", "string"),
                        "confidence", Map.of(
                                "type", "string",
                                "enum", List.of("low", "medium", "high"))),
                "required", List.of(
                        "category",
                        "score",
                        "label",
                        "severity",
                        "bareMinimum",
                        "matchedThemes",
                        "explanation",
                        "advice",
                        "confidence"));

        return Map.of(
                "model", "llama3.2",
                "prompt", prompt,
                "stream", false,
                "format", schema,
                "options", Map.of(
                        "temperature", 0.2));
    }

    private AnalyzeResponse fallbackResponse(AnalyzeRequest request, String fallbackReason) {
        AnalyzeResponse fallback = fallbackAnalysisService.analyze(request);

        return new AnalyzeResponse(
                fallback.category(),
                fallback.score(),
                fallback.label(),
                fallback.severity(),
                fallback.bareMinimum(),
                fallback.matchedThemes(),
                fallback.explanation(),
                fallback.advice() + " " + fallbackReason,
                "low");
    }
}