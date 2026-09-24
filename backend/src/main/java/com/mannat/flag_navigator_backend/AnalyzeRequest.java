package com.mannat.flag_navigator_backend;

public record AnalyzeRequest(
    String text,
    String context,
    String person
) {
}
