let currentLanguage =
    localStorage.getItem("flagNavigatorLanguage") || "no";

const translations = {
    no: {
        relationshipAnalyzer: "Relationship behavior analyzer",
        headerDescription: "Velg handlinger eller skriv inn en egen situasjon, og få en enkel vurdering av om mønsteret virker som green flag, yellow flag, red flag, ick eller bare minimum.",
        history: "Historikk",
        newChat: "+ Ny samtale",
        currentConversation: "Aktiv samtale",
        back: "← Tilbake",
        analysisSettings: "Analyseinnstillinger",
        beforeAnalysis: "Før du analyserer",
        situation: "Situasjon",
        person: "Personen du vurderer",
        writeSituation: "Skriv egen situasjon",
        situationDescription: "Beskriv kort hva som har skjedd. Når du trykker Analyser tekst, opprettes en ny samtale.",
        situationPlaceholder: "For eksempel: Han svarer veldig mye noen dager, men blir plutselig kald og forsvinner...",
        analyzeText: "Analyser tekst",
        explore: "Utforsk",
        mainFlagsDescription: "Velg en kategori for å se handlingene som hører til.",
        greenDescription: "Positive og trygge tegn.",
        yellowDescription: "Tegn det kan være verdt å følge med på.",
        redDescription: "Mer alvorlige varselsignaler.",
        ickDescription: "Ting som kan føles avtennende.",
        minimumDescription: "Grunnleggende respekt og normal innsats.",
        searchPlaceholder: "Søk etter handling...",
        allCategories: "Alle kategorier",
        clear: "Nullstill valg",
        dating: "Dating",
        casual: "Casual",
        situationship: "Situationship",
        talking: "Talking stage",
        relationship: "Forhold",
        friendship: "Vennskap",
        notRelevant: "Ikke relevant",
        man: "Gutt / mann",
        woman: "Jente / kvinne",
        other: "Annet",
        noConversationsYet: "Ingen samtaler enda.",
        noConversationSelected: "Ingen samtale valgt.",
        noMessagesYet: "Ingen meldinger enda.",
        newAnalysis: "Ny analyse",
        rename: "Endre navn",
        delete: "Slett",
        deleteConfirm: "Vil du slette denne samtalen?",
        messages: "meldinger",
        situationLabel: "Situasjon",
        personLabel: "Person",
        overallResult: "Samlet resultat",
        user: "Du",
        assistant: "Flag Navigator",
        category: "Kategori",
        severity: "Alvorlighet",
        whatToWatch: "Hva du kan følge med på",
        green: "Green",
        yellow: "Yellow",
        red: "Red",
        icks: "Ick",
        bareMinimum: "Bare Minimum",
        princessTreatment: "Princess Treatment",
        greenFlag: "Green Flag",
        yellowFlag: "Yellow Flag",
        redFlag: "Red Flag",
        sendPlaceholder: "Skriv en melding...",
        composerDisclaimer: "Flag Navigator kan gjøre feil.",
        connectionError: "Kunne ikke analysere meldingen. Prøv igjen.",
        select: "Velg",
        selected: "Valgt",
        noBehaviors: "Ingen handlinger funnet."
    },
    en: {
        relationshipAnalyzer: "Relationship behavior analyzer",
        headerDescription: "Select behaviors or describe your own situation to get an assessment of whether the pattern appears to be a green flag, yellow flag, red flag, ick, or simply the bare minimum.",
        history: "History",
        newChat: "+ New conversation",
        currentConversation: "Current conversation",
        back: "← Back",
        analysisSettings: "Analysis settings",
        beforeAnalysis: "Before you analyze",
        situation: "Situation",
        person: "Person you are evaluating",
        writeSituation: "Describe your situation",
        situationDescription: "Briefly describe what happened. When you press Analyze text, a new conversation is created.",
        situationPlaceholder: "For example: He replies a lot some days, but suddenly becomes cold and disappears...",
        analyzeText: "Analyze text",
        explore: "Explore",
        mainFlagsDescription: "Choose a category to see the behaviors that belong to it.",
        greenDescription: "Positive and safe signs.",
        yellowDescription: "Signs that may be worth paying attention to.",
        redDescription: "More serious warning signs.",
        ickDescription: "Things that may feel unattractive or off-putting.",
        minimumDescription: "Basic respect and normal effort.",
        searchPlaceholder: "Search for a behavior...",
        allCategories: "All categories",
        clear: "Clear selections",
        dating: "Dating",
        casual: "Casual",
        situationship: "Situationship",
        talking: "Talking stage",
        relationship: "Relationship",
        friendship: "Friendship",
        notRelevant: "Not relevant",
        man: "Boy / man",
        woman: "Girl / woman",
        other: "Other",
        noConversationsYet: "No conversations yet.",
        noConversationSelected: "No conversation selected.",
        noMessagesYet: "No messages yet.",
        newAnalysis: "New analysis",
        rename: "Rename",
        delete: "Delete",
        deleteConfirm: "Do you want to delete this conversation?",
        messages: "messages",
        situationLabel: "Situation",
        personLabel: "Person",
        overallResult: "Overall result",
        user: "You",
        assistant: "Flag Navigator",
        category: "Category",
        severity: "Severity",
        whatToWatch: "What to watch for",
        green: "Green",
        yellow: "Yellow",
        red: "Red",
        icks: "Ick",
        bareMinimum: "Bare Minimum",
        princessTreatment: "Princess Treatment",
        greenFlag: "Green Flag",
        yellowFlag: "Yellow Flag",
        redFlag: "Red Flag",
        sendPlaceholder: "Write a message...",
        composerDisclaimer: "Flag Navigator can make mistakes.",
        connectionError: "Could not analyze the message. Please try again.",
        select: "Select",
        selected: "Selected",
        noBehaviors: "No behaviors found."
    }
};

function t(key) {
    return translations[currentLanguage]?.[key] || key;
}

function applyTranslations() {
    document.documentElement.lang = currentLanguage;

    document.querySelectorAll("[data-i18n]").forEach(element => {
        element.textContent = t(element.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
        element.placeholder = t(element.dataset.i18nPlaceholder);
    });

    document.querySelectorAll("[data-language-toggle]").forEach(button => {
        button.textContent =
            currentLanguage === "no"
                ? "English"
                : "Norsk";
    });

    if (typeof renderCases === "function") {
        renderCases();
    }

    if (typeof renderCurrentConversation === "function") {
        renderCurrentConversation();
    }

    if (typeof renderFlags === "function") {
        renderFlags();
    }

    if (typeof updateSendButtonState === "function") {
        updateSendButtonState();
    }
}

function toggleLanguage() {
    currentLanguage =
        currentLanguage === "no"
            ? "en"
            : "no";

    localStorage.setItem(
        "flagNavigatorLanguage",
        currentLanguage
    );

    applyTranslations();
}

window.t = t;
window.toggleLanguage = toggleLanguage;
window.getCurrentLanguage = () => currentLanguage;

document.addEventListener(
    "DOMContentLoaded",
    applyTranslations
);