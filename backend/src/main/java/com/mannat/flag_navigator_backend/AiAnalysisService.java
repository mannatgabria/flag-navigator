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
public class AiAnalysisService {

    private final OpenAiProperties openAiProperties;
    private final AnalysisService fallbackAnalysisService;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public AiAnalysisService(
            OpenAiProperties openAiProperties,
            AnalysisService fallbackAnalysisService,
            ObjectMapper objectMapper
    ) {
        this.openAiProperties = openAiProperties;
        this.fallbackAnalysisService = fallbackAnalysisService;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newHttpClient();
    }

    public AnalyzeResponse analyze(AnalyzeRequest request) {
        if (openAiProperties.getApiKey() == null || openAiProperties.getApiKey().isBlank()) {
            return fallbackResponse(request, "AI er ikke aktivert fordi OPENAI_API_KEY mangler.");
        }

        try {
            String requestJson = objectMapper.writeValueAsString(createOpenAiRequest(request));

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/responses"))
                    .header("Authorization", "Bearer " + openAiProperties.getApiKey())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    httpRequest,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return fallbackResponse(request, "AI-kallet feilet. Bruker vanlig regelbasert analyse som fallback.");
            }

            JsonNode responseJson = objectMapper.readTree(response.body());
            String outputText = extractOutputText(responseJson);

            return objectMapper.readValue(outputText, AnalyzeResponse.class);

        } catch (Exception error) {
            return fallbackResponse(request, "AI-kallet feilet. Bruker vanlig regelbasert analyse som fallback.");
        }
    }

    private Map<String, Object> createOpenAiRequest(AnalyzeRequest request) {
        String systemPrompt = """
                You are Flag Navigator, a cautious relationship behavior analyzer.

                Analyze the user's situation in Norwegian.
                Do not give final relationship decisions.
                Do not tell the user to break up, stay, forgive, or choose.
                Focus on patterns, context, severity, boundaries, communication, and safety.

                Classify the situation as one of:
                green, minimum, yellow, ick, red, unknown.

                Return only valid JSON matching the schema.
                """;

        String userPrompt = """
                Text: %s
                Context: %s
                Person being evaluated: %s
                """.formatted(
                request.text(),
                request.context(),
                request.person()
        );

        Map<String, Object> schema = Map.of(
                "type", "object",
                "additionalProperties", false,
                "properties", Map.of(
                        "category", Map.of(
                                "type", "string",
                                "enum", List.of("green", "minimum", "yellow", "ick", "red", "unknown")
                        ),
                        "score", Map.of("type", "integer"),
                        "label", Map.of("type", "string"),
                        "severity", Map.of("type", "string"),
                        "bareMinimum", Map.of("type", "boolean"),
                        "matchedThemes", Map.of(
                                "type", "array",
                                "items", Map.of("type", "string")
                        ),
                        "explanation", Map.of("type", "string"),
                        "advice", Map.of("type", "string"),
                        "confidence", Map.of(
                                "type", "string",
                                "enum", List.of("low", "medium", "high")
                        )
                ),
                "required", List.of(
                        "category",
                        "score",
                        "label",
                        "severity",
                        "bareMinimum",
                        "matchedThemes",
                        "explanation",
                        "advice",
                        "confidence"
                )
        );

        return Map.of(
                "model", openAiProperties.getModel(),
                "input", List.of(
                        Map.of(
                                "role", "system",
                                "content", systemPrompt
                        ),
                        Map.of(
                                "role", "user",
                                "content", userPrompt
                        )
                ),
                "text", Map.of(
                        "format", Map.of(
                                "type", "json_schema",
                                "name", "relationship_analysis",
                                "strict", true,
                                "schema", schema
                        )
                ),
                "store", false
        );
    }

    private String extractOutputText(JsonNode responseJson) {
        JsonNode output = responseJson.get("output");

        if (output != null && output.isArray()) {
            for (JsonNode item : output) {
                JsonNode content = item.get("content");

                if (content != null && content.isArray()) {
                    for (JsonNode contentItem : content) {
                        if ("output_text".equals(contentItem.path("type").asText())) {
                            return contentItem.path("text").asText();
                        }
                    }
                }
            }
        }

        throw new IllegalStateException("Fant ikke output_text i OpenAI-responsen.");
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
                "low"
        );
    }
}