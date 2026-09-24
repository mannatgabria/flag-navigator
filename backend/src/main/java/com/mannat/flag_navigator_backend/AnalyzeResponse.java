package com.mannat.flag_navigator_backend;

import java.util.List;

public record AnalyzeResponse(
        String category,
        int score,
        String label,
        String severity,
        boolean bareMinimum,
        List<String> matchedThemes,
        String explanation,
        String advice,
        String confidence
) {
}
