let selectedFlagIds = JSON.parse(localStorage.getItem("selectedFlagIds")) || [];

const flagList = document.getElementById("flag-list");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const scoreElement = document.getElementById("score");
const resultCard = document.getElementById("result-card");

const greenCount = document.getElementById("green-count");
const yellowCount = document.getElementById("yellow-count");
const redCount = document.getElementById("red-count");
const ickCount = document.getElementById("ick-count");
const minimumCount = document.getElementById("minimum-count");

const clearButton = document.getElementById("clear-btn");
const customBehaviorInput = document.getElementById("custom-behavior");
const customAnalyzeButton = document.getElementById("custom-analyze-btn");

const contextSelect = document.getElementById("context");
const personSelect = document.getElementById("person");

function getCategoryLabel(category) {
    if (category === "green") return "Green flag";
    if (category === "yellow") return "Yellow flag";
    if (category === "red") return "Red flag";
    if (category === "ick") return "Ick";
    if (category === "minimum") return "Bare minimum";
    return category;
}

function getSelectedFlags() {
    return flagData.filter((flag) => selectedFlagIds.includes(flag.id));
}

function saveSelectedFlags() {
    localStorage.setItem("selectedFlagIds", JSON.stringify(selectedFlagIds));
}

function toggleFlag(id) {
    if (selectedFlagIds.includes(id)) {
        selectedFlagIds = selectedFlagIds.filter((flagId) => flagId !== id);
    } else {
        selectedFlagIds.push(id);
    }

    saveSelectedFlags();
    renderFlags();
    updateResult();
}

function renderFlags() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredFlags = flagData.filter((flag) => {
        const matchesSearch =
            flag.title.toLowerCase().includes(searchText) ||
            flag.description.toLowerCase().includes(searchText) ||
            flag.themes.join(" ").toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" || flag.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    flagList.innerHTML = "";

    if (filteredFlags.length === 0) {
        flagList.innerHTML = '<p class="empty-message">Ingen handlinger funnet.</p>';
        return;
    }

    filteredFlags.forEach((flag) => {
        const isSelected = selectedFlagIds.includes(flag.id);

        const card = document.createElement("div");
        card.className = `flag-card ${flag.category} ${isSelected ? "selected" : ""}`;

        card.innerHTML = `
      <div class="flag-card-header">
        <div>
          <h3>${flag.title}</h3>
          <span class="category-badge ${flag.category}">
            ${getCategoryLabel(flag.category)}
          </span>
        </div>

        <button class="select-btn ${isSelected ? "selected-btn" : ""}">
          ${isSelected ? "Valgt" : "Velg"}
        </button>
      </div>

      <p>${flag.description}</p>

      <div class="flag-meta">
        <span>Score: ${flag.score}</span>
        <span>${flag.severity}</span>
      </div>
    `;

        card.querySelector(".select-btn").addEventListener("click", () => {
            toggleFlag(flag.id);
        });

        flagList.appendChild(card);
    });
}

function countCategories(flags) {
    return {
        green: flags.filter((flag) => flag.category === "green").length,
        yellow: flags.filter((flag) => flag.category === "yellow").length,
        red: flags.filter((flag) => flag.category === "red").length,
        ick: flags.filter((flag) => flag.category === "ick").length,
        minimum: flags.filter((flag) => flag.category === "minimum").length
    };
}

function getContextText() {
    const context = contextSelect.value;

    if (context === "casual") {
        return "I casual dating kan forventninger være ulike, men respekt, tydelige grenser og trygghet er fortsatt viktig.";
    }

    if (context === "situationship") {
        return "I en situationship kan uklarhet være vanlig, men gjentatte mixed signals eller press kan likevel være verdt å følge med på.";
    }

    if (context === "relationship") {
        return "I et forhold blir mønster over tid ekstra viktig, spesielt rundt kommunikasjon, respekt og grenser.";
    }

    if (context === "talking") {
        return "I talking stage kan mye fortsatt være uklart, men handlinger som kontroll, press eller utrygghet bør tas seriøst.";
    }

    if (context === "friendship") {
        return "I vennskap handler dette også om respekt, trygghet, grenser og gjensidig innsats.";
    }

    return "I dating er det lurt å se på både enkeltstående handlinger og mønster over tid.";
}

function analyzeFlags(flags) {
    const totalScore = flags.reduce((sum, flag) => sum + flag.score, 0);
    const counts = countCategories(flags);
    const hasSeriousRedFlag = flags.some(
        (flag) => flag.category === "red" && flag.severityLevel >= 5
    );

    let title = "";
    let explanation = "";
    let advice = "";

    if (flags.length === 0) {
        return {
            totalScore: 0,
            counts,
            title: "Ingen handlinger valgt",
            explanation: "Velg noen handlinger eller skriv inn en egen situasjon for å få en vurdering.",
            advice: ""
        };
    }

    if (hasSeriousRedFlag || totalScore >= 8) {
        title = "Flere alvorlige varselsignaler";
        explanation =
            "Valgene dine inneholder ett eller flere tegn som handler om kontroll, press, frykt eller manglende respekt for grenser.";
        advice =
            "Dette er ikke en fasit, men det kan være lurt å ta mønsteret på alvor og snakke med noen du stoler på hvis du føler deg utrygg.";
    } else if (totalScore >= 4) {
        title = "Bør følges med på";
        explanation =
            "Resultatet tyder på flere yellow/red signals. Det trenger ikke bety at alt er galt, men mønsteret kan skape usikkerhet.";
        advice =
            "Se om dette skjer ofte, og om personen klarer å kommunisere tydelig og respektere grenser.";
    } else if (totalScore >= 1) {
        title = "Litt usikkert";
        explanation =
            "Valgene dine virker ikke nødvendigvis veldig alvorlige alene, men noen av dem kan bli problematiske hvis de skjer ofte.";
        advice =
            "Legg merke til om det er enkeltstående handlinger eller et gjentatt mønster.";
    } else if (counts.minimum > 0 && counts.green === 0 && counts.yellow === 0 && counts.red === 0 && counts.ick === 0) {
        title = "Dette er mest bare minimum";
        explanation =
            "Handlingene du har valgt er positive, men de handler mest om grunnleggende respekt og normal oppførsel.";
        advice =
            "Bare minimum er bra, men det bør ikke forveksles med ekstra innsats eller sterke green flags.";
    } else if (totalScore <= -2 && counts.red === 0 && counts.yellow === 0) {
        title = "Mest positive tegn";
        explanation =
            "Valgene dine peker mest mot trygghet, omtanke, respekt eller tydelig kommunikasjon.";
        advice =
            "Dette kan være gode tegn, spesielt hvis handlingene er stabile over tid og ikke føles pressende.";
    } else {
        title = "Blandet vurdering";
        explanation =
            "Resultatet er blandet. Noen tegn kan være positive, mens andre bør vurderes ut fra kontekst og mønster.";
        advice =
            "Se på helheten, ikke bare én handling alene.";
    }

    return {
        totalScore,
        counts,
        title,
        explanation,
        advice
    };
}

function updateResult() {
    const selectedFlags = getSelectedFlags();
    const analysis = analyzeFlags(selectedFlags);

    scoreElement.textContent = analysis.totalScore;

    greenCount.textContent = analysis.counts.green;
    yellowCount.textContent = analysis.counts.yellow;
    redCount.textContent = analysis.counts.red;
    ickCount.textContent = analysis.counts.ick;
    minimumCount.textContent = analysis.counts.minimum;

    resultCard.innerHTML = `
    <h3>${analysis.title}</h3>
    <p>${analysis.explanation}</p>
    ${analysis.advice ? `<p><strong>Hva du kan følge med på:</strong> ${analysis.advice}</p>` : ""}
    ${selectedFlags.length > 0 ? `<p class="context-note">${getContextText()}</p>` : ""}
  `;
}

function analyzeCustomText() {
    const text = customBehaviorInput.value.trim().toLowerCase();

    if (!text) {
        resultCard.innerHTML = `
      <h3>Skriv inn en situasjon først</h3>
      <p>Du må skrive noe i tekstfeltet før nettsiden kan gjøre en enkel vurdering.</p>
    `;
        return;
    }

    const matchedFlags = [];

    function addMatch(id) {
        const flag = flagData.find((item) => item.id === id);

        if (flag && !matchedFlags.some((item) => item.id === id)) {
            matchedFlags.push(flag);
        }
    }

    if (text.includes("love bombing") || text.includes("veldig intens") || text.includes("masse oppmerksomhet") || text.includes("for fort")) {
        addMatch(2);
    }

    if (text.includes("kontroll") || text.includes("kontrollerer") || text.includes("bestemmer hvem") || text.includes("hvem jeg snakker med")) {
        addMatch(17);
    }

    if (text.includes("presser") || text.includes("press") || text.includes("vil ikke") || text.includes("sagt nei")) {
        addMatch(18);
    }

    if (text.includes("redd") || text.includes("reaksjonen") || text.includes("går på eggeskall")) {
        addMatch(20);
    }

    if (text.includes("mixed signals") || text.includes("varm og kald") || text.includes("kald") || text.includes("fjern")) {
        addMatch(10);
    }

    if (text.includes("svarer sent") || text.includes("svarer bare") || text.includes("ikke svarer") || text.includes("ghoster")) {
        addMatch(21);
    }

    if (text.includes("skjuler") || text.includes("hemmelig") || text.includes("viser meg ikke")) {
        addMatch(14);
    }

    if (text.includes("respekterer grensene") || text.includes("lytter når jeg sier nei")) {
        addMatch(3);
    }

    if (text.includes("kommuniserer tydelig") || text.includes("ærlig om intensjoner")) {
        addMatch(4);
    }

    if (text.includes("princess treatment") || text.includes("ekstra omtanke") || text.includes("romantisk innsats")) {
        addMatch(1);
    }

    if (matchedFlags.length === 0) {
        resultCard.innerHTML = `
      <h3>Ingen tydelig match funnet</h3>
      <p>
        Teksten din matcher ikke tydelig med reglene i denne første versjonen.
        Senere kan denne delen kobles til AI for å forstå fritekst bedre.
      </p>
      <p class="context-note">${getContextText()}</p>
    `;

        scoreElement.textContent = 0;
        greenCount.textContent = 0;
        yellowCount.textContent = 0;
        redCount.textContent = 0;
        ickCount.textContent = 0;
        minimumCount.textContent = 0;
        return;
    }

    const analysis = analyzeFlags(matchedFlags);

    scoreElement.textContent = analysis.totalScore;
    greenCount.textContent = analysis.counts.green;
    yellowCount.textContent = analysis.counts.yellow;
    redCount.textContent = analysis.counts.red;
    ickCount.textContent = analysis.counts.ick;
    minimumCount.textContent = analysis.counts.minimum;

    resultCard.innerHTML = `
    <h3>Foreløpig tekstanalyse: ${analysis.title}</h3>
    <p>${analysis.explanation}</p>
    <p><strong>Matchet med:</strong> ${matchedFlags.map((flag) => flag.title).join(", ")}</p>
    <p><strong>Hva du kan følge med på:</strong> ${analysis.advice}</p>
    <p class="context-note">${getContextText()}</p>
    <p class="ai-note">Dette er en enkel regelbasert analyse. Senere kan vi koble denne delen til AI.</p>
  `;
}

function clearSelections() {
    selectedFlagIds = [];
    customBehaviorInput.value = "";
    saveSelectedFlags();
    renderFlags();
    updateResult();
}

searchInput.addEventListener("input", renderFlags);
categoryFilter.addEventListener("change", renderFlags);
clearButton.addEventListener("click", clearSelections);
customAnalyzeButton.addEventListener("click", analyzeCustomText);
contextSelect.addEventListener("change", updateResult);
personSelect.addEventListener("change", updateResult);

renderFlags();
updateResult();