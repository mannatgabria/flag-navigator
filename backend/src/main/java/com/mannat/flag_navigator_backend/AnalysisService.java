package com.mannat.flag_navigator_backend;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AnalysisService {

    public AnalyzeResponse analyze(AnalyzeRequest request) {
        String text = request.text() == null ? "" : request.text().toLowerCase();
        String context = request.context() == null ? "dating" : request.context();

        int score = 0;
        List<String> themes = new ArrayList<>();

        if (containsAny(text, "love bombing", "masse oppmerksomhet", "veldig intens", "for fort")) {
            score += 5;
            themes.add("love bombing");
        }

        if (containsAny(text, "kontroll", "kontrollerer", "bestemmer hvem", "hvem jeg snakker med")) {
            score += 5;
            themes.add("kontroll");
        }

        if (containsAny(text, "presser", "press", "sagt nei", "vil ikke")) {
            score += 5;
            themes.add("press og grenser");
        }

        if (containsAny(text, "redd", "reaksjonen", "går på eggeskall")) {
            score += 5;
            themes.add("utrygghet");
        }

        if (containsAny(text, "mixed signals", "varm og kald", "kald", "fjern")) {
            score += 2;
            themes.add("mixed signals");
        }

        if (containsAny(text, "svarer sent", "svarer bare", "ikke svarer", "ghoster")) {
            score += 3;
            themes.add("ustabil kommunikasjon");
        }

        if (containsAny(text, "skjuler", "hemmelig", "viser meg ikke")) {
            score += 3;
            themes.add("hemmelighold");
        }

        if (containsAny(text, "princess treatment", "ekstra omtanke", "romantisk innsats")) {
            score -= 2;
            themes.add("princess treatment");
        }

        if (containsAny(text, "respekterer grensene", "lytter når jeg sier nei")) {
            score -= 2;
            themes.add("respekt for grenser");
        }

        if (containsAny(text, "kommuniserer tydelig", "ærlig om intensjoner")) {
            score -= 2;
            themes.add("tydelig kommunikasjon");
        }

        return buildResponse(score, themes, context);
    }

    private AnalyzeResponse buildResponse(int score, List<String> themes, String context) {
        String category;
        String label;
        String severity;
        boolean bareMinimum = false;
        String explanation;
        String advice;
        String confidence;

        if (themes.isEmpty()) {
            return new AnalyzeResponse(
                    "unknown",
                    0,
                    "Ingen tydelig match",
                    "Uklart",
                    false,
                    themes,
                    "Teksten matcher ikke tydelig med reglene i denne versjonen.",
                    "Prøv å skrive litt mer konkret hva personen gjorde, for eksempel om det handler om kontroll, kommunikasjon, grenser eller innsats.",
                    "low"
            );
        }

        if (score >= 8) {
            category = "red";
            label = "Flere alvorlige varselsignaler";
            severity = "Veldig alvorlig";
            explanation = "Teksten inneholder flere tegn som kan handle om kontroll, press, utrygghet eller manglende respekt for grenser.";
            advice = "Dette er ikke en fasit, men mønsteret bør tas på alvor. Hvis du føler deg utrygg, kan det være lurt å snakke med noen du stoler på.";
            confidence = "medium";
        } else if (score >= 4) {
            category = "red";
            label = "Mulig red flag";
            severity = "Alvorlig";
            explanation = "Teksten inneholder ett eller flere tegn som kan være problematiske, spesielt hvis det skjer ofte.";
            advice = "Se om dette er et gjentatt mønster, og om personen respekterer grenser og kommuniserer tydelig.";
            confidence = "medium";
        } else if (score >= 2) {
            category = "yellow";
            label = "Bør følges med på";
            severity = "Moderat";
            explanation = "Dette virker ikke nødvendigvis alvorlig alene, men kan skape usikkerhet hvis det skjer gjentatte ganger.";
            advice = "Legg merke til om handlingen skjer ofte, og om personen klarer å snakke ærlig om det.";
            confidence = "medium";
        } else if (score <= -2) {
            category = "green";
            label = "Mest positive tegn";
            severity = "Positivt";
            explanation = "Teksten peker mest mot omtanke, respekt, tydelig kommunikasjon eller trygghet.";
            advice = "Dette kan være et godt tegn hvis det er stabilt over tid og ikke føles pressende.";
            confidence = "medium";
        } else {
            category = "minimum";
            label = "Mest bare minimum";
            severity = "Lav";
            bareMinimum = true;
            explanation = "Dette virker mest som grunnleggende respekt eller normal oppførsel.";
            advice = "Bare minimum er bra, men det bør ikke forveksles med ekstra innsats.";
            confidence = "medium";
        }

        if ("situationship".equals(context)) {
            advice += " I en situationship kan uklarhet være vanlig, men grenser og trygghet er fortsatt viktig.";
        }

        if ("casual".equals(context)) {
            advice += " I casual dating kan forventninger være ulike, men respekt og tydelighet er fortsatt viktig.";
        }

        if ("relationship".equals(context)) {
            advice += " I et forhold er mønster over tid ekstra viktig.";
        }

        return new AnalyzeResponse(
                category,
                score,
                label,
                severity,
                bareMinimum,
                themes,
                explanation,
                advice,
                confidence
        );
    }

    private boolean containsAny(String text, String... words) {
        for (String word : words) {
            if (text.contains(word)) {
                return true;
            }
        }

        return false;
    }
}