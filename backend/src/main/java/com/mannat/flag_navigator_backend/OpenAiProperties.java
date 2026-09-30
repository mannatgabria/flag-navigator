package com.mannat.flag_navigator_backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class OpenAiProperties {

    @Value("${openai.api.key:}")
    private String apiKey;

    @Value("${openai.model:gpt-5-mini}")
    private String model;

    public String getApiKey() {
        return apiKey;
    }

    public String getModel() {
        return model;
    }
}