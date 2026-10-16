let selectedFlagIds =
    JSON.parse(
        localStorage.getItem(
            "selectedFlagIds"
        )
    ) || [];

let activeFlagCategory = null;
let isAiLoading = false;
let currentAbortController = null;

const conversationMessages =
    document.getElementById(
        "caseEvents"
    );

const scrollToBottomButton =
    document.getElementById(
        "scrollToBottomBtn"
    );

const homeView =
    document.getElementById(
        "homeView"
    );

const conversationView =
    document.getElementById(
        "conversationView"
    );

const customBehaviorInput =
    document.getElementById(
        "custom-behavior"
    );

const customAnalyzeButton =
    document.getElementById(
        "custom-analyze-btn"
    );

const conversationMessageInput =
    document.getElementById(
        "conversation-message-input"
    );

const conversationSendButton =
    document.getElementById(
        "conversation-send-btn"
    );

const backToHomeButton =
    document.getElementById(
        "backToHomeButton"
    );

const contextSelect =
    document.getElementById(
        "context"
    );

const personSelect =
    document.getElementById(
        "person"
    );

const flagList =
    document.getElementById(
        "flag-list"
    );

const searchInput =
    document.getElementById(
        "search"
    );

const categoryFilter =
    document.getElementById(
        "category-filter"
    );

const clearButton =
    document.getElementById(
        "clear-btn"
    );

function tr(key) {
    return typeof window.t ===
        "function"
        ? window.t(key)
        : key;
}

function isConversationNearBottom() {
    const scrollPosition =
        window.scrollY +
        window.innerHeight;

    const pageHeight =
        document.documentElement.scrollHeight;

    return (
        pageHeight -
        scrollPosition <
        100
    );
}

function updateScrollToBottomButton() {
    if (!scrollToBottomButton) {
        return;
    }

    const hasScrollableContent =
        document.documentElement.scrollHeight >
        window.innerHeight + 100;

    const shouldShow =
        hasScrollableContent &&
        !isConversationNearBottom() &&
        !conversationView.classList.contains("hidden");

    scrollToBottomButton.classList.toggle(
        "visible",
        shouldShow
    );
}

function scrollConversationToBottom(
    smooth = true
) {
    window.scrollTo({
        top:
            document.documentElement.scrollHeight,
        behavior:
            smooth
                ? "smooth"
                : "auto"
    });
}

function showHomeView() {
    homeView?.classList.remove(
        "hidden"
    );

    conversationView?.classList.add(
        "hidden"
    );

    document.body.classList.remove(
        "conversation-open"
    );

    window.scrollTo(
        0,
        0
    );
}

function showConversationView() {
    homeView?.classList.add(
        "hidden"
    );

    conversationView?.classList.remove(
        "hidden"
    );

    document.body.classList.add(
        "conversation-open"
    );

    renderCurrentConversation();

    requestAnimationFrame(
        () => {
            conversationMessageInput
                ?.focus();

            autoResizeConversationInput();
            updateSendButtonState();
            updateScrollToBottomButton();
        }
    );
}

function applyConversationTheme(
    theme
) {
    const themeClasses = [
        "theme-red",
        "theme-green",
        "theme-yellow",
        "theme-ick",
        "theme-minimum",
        "theme-princess"
    ];

    document.body.classList.remove(
        ...themeClasses
    );

    if (
        !theme ||
        theme === "default"
    ) {
        return;
    }

    const themeClass =
        `theme-${theme}`;

    if (
        themeClasses.includes(
            themeClass
        )
    ) {
        document.body.classList.add(
            themeClass
        );
    }
}

function getCategoryLabel(
    category
) {
    const labels = {
        green: tr("green"),
        yellow: tr("yellow"),
        red: tr("red"),
        ick: tr("icks"),
        minimum:
            tr("bareMinimum"),
        princess:
            tr("princessTreatment")
    };

    return labels[category] ||
        category;
}

function saveSelectedFlags() {
    localStorage.setItem(
        "selectedFlagIds",
        JSON.stringify(
            selectedFlagIds
        )
    );
}

function toggleFlag(id) {
    if (
        selectedFlagIds.includes(id)
    ) {
        selectedFlagIds =
            selectedFlagIds.filter(
                flagId =>
                    flagId !== id
            );
    } else {
        selectedFlagIds.push(id);
    }

    saveSelectedFlags();
    renderFlags();
}

function showFlagCategory(
    category
) {
    const content =
        document.getElementById(
            "selectedFlagContent"
        );

    const title =
        document.getElementById(
            "selectedFlagTitle"
        );

    if (
        !content ||
        !title ||
        !categoryFilter
    ) {
        return;
    }

    if (
        activeFlagCategory === category
    ) {
        activeFlagCategory = null;
        content.style.display =
            "none";

        return;
    }

    activeFlagCategory =
        category;

    categoryFilter.value =
        category;

    const titles = {
        green: "Green Flags",
        yellow: "Yellow Flags",
        red: "Red Flags",
        ick: "Icks",
        minimum: "Bare Minimum"
    };

    title.textContent =
        titles[category] ||
        "Flags";

    renderFlags();

    content.style.display =
        "block";

    content.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function renderFlags() {
    if (
        !flagList ||
        !searchInput ||
        !categoryFilter ||
        typeof flagData === "undefined"
    ) {
        return;
    }

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedCategory =
        categoryFilter.value;

    const filteredFlags =
        flagData.filter(flag => {
            const themes =
                Array.isArray(
                    flag.themes
                )
                    ? flag.themes
                        .join(" ")
                    : "";

            const matchesSearch =
                String(
                    flag.title || ""
                )
                    .toLowerCase()
                    .includes(
                        searchText
                    ) ||
                String(
                    flag.description ||
                    ""
                )
                    .toLowerCase()
                    .includes(
                        searchText
                    ) ||
                themes
                    .toLowerCase()
                    .includes(
                        searchText
                    );

            const matchesCategory =
                selectedCategory ===
                "all" ||
                flag.category ===
                selectedCategory;

            return (
                matchesSearch &&
                matchesCategory
            );
        });

    flagList.innerHTML = "";

    if (
        filteredFlags.length === 0
    ) {
        const empty =
            document.createElement(
                "p"
            );

        empty.className =
            "empty-message";

        empty.textContent =
            tr("noBehaviors");

        flagList.appendChild(empty);
        return;
    }

    filteredFlags.forEach(flag => {
        const isSelected =
            selectedFlagIds.includes(
                flag.id
            );

        const card =
            document.createElement(
                "div"
            );

        card.className =
            `flag-card ${flag.category}${isSelected ? " selected" : ""}`;

        const header =
            document.createElement(
                "div"
            );

        header.className =
            "flag-card-header";

        const left =
            document.createElement(
                "div"
            );

        const heading =
            document.createElement(
                "h3"
            );

        heading.textContent =
            flag.title;

        const badge =
            document.createElement(
                "span"
            );

        badge.className =
            `category-badge ${flag.category}`;

        badge.textContent =
            getCategoryLabel(
                flag.category
            );

        left.appendChild(heading);
        left.appendChild(badge);

        const selectButton =
            document.createElement(
                "button"
            );

        selectButton.className =
            `select-btn${isSelected ? " selected-btn" : ""}`;

        selectButton.textContent =
            isSelected
                ? tr("selected")
                : tr("select");

        selectButton.addEventListener(
            "click",
            event => {
                event.stopPropagation();
                toggleFlag(flag.id);
            }
        );

        header.appendChild(left);
        header.appendChild(
            selectButton
        );

        const description =
            document.createElement(
                "p"
            );

        description.textContent =
            flag.description;

        const meta =
            document.createElement(
                "div"
            );

        meta.className =
            "flag-meta";

        const score =
            document.createElement(
                "span"
            );

        score.textContent =
            `Score: ${flag.score}`;

        const severity =
            document.createElement(
                "span"
            );

        severity.textContent =
            flag.severity;

        meta.appendChild(score);
        meta.appendChild(severity);

        card.appendChild(header);
        card.appendChild(
            description
        );
        card.appendChild(meta);

        flagList.appendChild(card);
    });
}

function clearSelections() {
    selectedFlagIds = [];
    saveSelectedFlags();
    renderFlags();
}

function getLanguageInstruction() {
    if (
        typeof window.getCurrentLanguage ===
        "function" &&
        window.getCurrentLanguage() ===
        "en"
    ) {
        return "Respond in English.";
    }

    return "Svar på norsk.";
}

function buildConversationContextForAi(
    conversation,
    newText
) {
    const languageInstruction =
        getLanguageInstruction();

    if (
        !conversation ||
        conversation.messages.length ===
        0
    ) {
        return `${languageInstruction}\n\n${newText}`;
    }

    const history =
        conversation.messages
            .map(message => {
                const role =
                    message.role ===
                        "user"
                        ? "Bruker"
                        : "Tidligere analyse";

                return `${role}: ${message.text}`;
            })
            .join("\n\n");

    return `
${languageInstruction}

Dette er en pågående samtale om samme person og situasjon.

Tidligere samtale:
${history}

Ny melding fra bruker:
${newText}

Analyser den nye meldingen i sammenheng med hele den tidligere samtalen.
    `.trim();
}

function createAiMessage(
    analysis
) {
    const category =
        getDisplayCategory(
            analysis
        );

    let text =
        `${analysis.label || "Analyse"}`;

    text +=
        `\n\n${tr("category")}: ${getCategoryLabel(category)}`;

    if (analysis.severity) {
        text +=
            `\n${tr("severity")}: ${analysis.severity}`;
    }

    if (analysis.explanation) {
        text +=
            `\n\n${analysis.explanation}`;
    }

    if (analysis.advice) {
        text +=
            `\n\n${tr("whatToWatch")}:\n${analysis.advice}`;
    }

    return text.trim();
}

async function requestAiAnalysis(
    text,
    context,
    person,
    signal
) {
    const response =
        await fetch(
            "http://localhost:8080/api/local-ai-analyze",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body:
                    JSON.stringify({
                        text: text,
                        context: context,
                        person: person
                    }),
                signal: signal
            }
        );

    if (!response.ok) {
        throw new Error(
            `HTTP ${response.status}`
        );
    }

    return await response.json();
}

function updateSendButtonState() {
    if (
        !conversationSendButton ||
        !conversationMessageInput
    ) {
        return;
    }

    conversationSendButton
        .classList
        .remove(
            "is-idle",
            "is-ready",
            "is-loading"
        );

    if (isAiLoading) {
        conversationSendButton
            .classList
            .add("is-loading");

        conversationSendButton
            .setAttribute(
                "aria-label",
                "Stop"
            );

        return;
    }

    const hasText =
        conversationMessageInput
            .value
            .trim()
            .length > 0;

    conversationSendButton
        .classList
        .add(
            hasText
                ? "is-ready"
                : "is-idle"
        );

    conversationSendButton
        .setAttribute(
            "aria-label",
            hasText
                ? "Send"
                : "Empty"
        );
}

function setAiLoading(
    loading
) {
    isAiLoading = loading;
    updateSendButtonState();
}

function addThinkingHeart() {
    const container =
        document.getElementById(
            "caseEvents"
        );

    if (!container) {
        return;
    }

    removeThinkingHeart();

    const thinking =
        document.createElement(
            "div"
        );

    thinking.id =
        "thinkingMessage";

    thinking.className =
        "thinking-message";

    thinking.innerHTML = `
        <svg class="thinking-heart" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21C10.8 19.9 4 15.7 4 9.6C4 6.7 5.8 4.8 8.4 4.8C10 4.8 11.3 5.7 12 6.9C12.7 5.7 14 4.8 15.6 4.8C18.2 4.8 20 6.7 20 9.6C20 15.7 13.2 19.9 12 21Z"></path>
        </svg>
    `;

    container.appendChild(
        thinking
    );

    scrollConversationToBottom(
        true
    );
}

function removeThinkingHeart() {
    document
        .getElementById(
            "thinkingMessage"
        )
        ?.remove();
}

function stopCurrentRequest() {
    if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
    }

    removeThinkingHeart();
    setAiLoading(false);
}

async function analyzeHomeText() {
    if (
        !customBehaviorInput ||
        !contextSelect ||
        !personSelect
    ) {
        return;
    }

    const text =
        customBehaviorInput.value
            .trim();

    if (!text) {
        return;
    }

    const context =
        contextSelect.value;

    const person =
        personSelect.value;

    createConversation(
        context,
        person
    );

    addMessageToCurrentConversation(
        "user",
        text
    );

    customBehaviorInput.value = "";

    showConversationView();

    customAnalyzeButton.disabled =
        true;

    setAiLoading(true);
    addThinkingHeart();

    currentAbortController =
        new AbortController();

    try {
        const requestText =
            `${getLanguageInstruction()}\n\n${text}`;

        const analysis =
            await requestAiAnalysis(
                requestText,
                context,
                person,
                currentAbortController
                    .signal
            );

        analysis.matchedThemes =
            Array.isArray(
                analysis.matchedThemes
            )
                ? analysis.matchedThemes
                : [];

        removeThinkingHeart();

        setConversationTitleFromAnalysis(
            analysis
        );

        const overall =
            addAnalysisToCurrentConversation(
                analysis
            );

        const aiMessage =
            createAiMessage(
                analysis
            );

        addMessageToCurrentConversation(
            "assistant",
            aiMessage
        );

        applyConversationTheme(
            overall.theme
        );

        renderCurrentConversation();
    } catch (error) {
        removeThinkingHeart();

        if (
            error.name !==
            "AbortError"
        ) {
            addMessageToCurrentConversation(
                "assistant",
                tr("connectionError")
            );
        }
    } finally {
        currentAbortController =
            null;

        customAnalyzeButton.disabled =
            false;

        setAiLoading(false);
    }
}

async function sendConversationMessage() {
    const conversation =
        getCurrentConversation();

    if (!conversation) {
        showHomeView();
        return;
    }

    if (isAiLoading) {
        stopCurrentRequest();
        return;
    }

    const text =
        conversationMessageInput
            ?.value
            .trim();

    if (!text) {
        return;
    }

    const context =
        conversation.context;

    const person =
        conversation.person;

    const aiText =
        buildConversationContextForAi(
            conversation,
            text
        );

    addMessageToCurrentConversation(
        "user",
        text
    );

    conversationMessageInput.value =
        "";

    autoResizeConversationInput();
    updateSendButtonState();

    setAiLoading(true);
    addThinkingHeart();

    currentAbortController =
        new AbortController();

    try {
        const analysis =
            await requestAiAnalysis(
                aiText,
                context,
                person,
                currentAbortController
                    .signal
            );

        analysis.matchedThemes =
            Array.isArray(
                analysis.matchedThemes
            )
                ? analysis.matchedThemes
                : [];

        removeThinkingHeart();

        const overall =
            addAnalysisToCurrentConversation(
                analysis
            );

        const aiMessage =
            createAiMessage(
                analysis
            );

        addMessageToCurrentConversation(
            "assistant",
            aiMessage
        );

        applyConversationTheme(
            overall.theme
        );

        renderCurrentConversation();
    } catch (error) {
        removeThinkingHeart();

        if (
            error.name !==
            "AbortError"
        ) {
            addMessageToCurrentConversation(
                "assistant",
                tr("connectionError")
            );
        }
    } finally {
        currentAbortController =
            null;

        setAiLoading(false);

        conversationMessageInput
            ?.focus();
    }
}

function autoResizeConversationInput() {
    if (!conversationMessageInput) {
        return;
    }

    conversationMessageInput
        .style.height = "auto";

    const height =
        Math.min(
            conversationMessageInput
                .scrollHeight,
            150
        );

    conversationMessageInput
        .style.height =
        `${height}px`;
}

customAnalyzeButton
    ?.addEventListener(
        "click",
        analyzeHomeText
    );

conversationSendButton
    ?.addEventListener(
        "click",
        sendConversationMessage
    );

backToHomeButton
    ?.addEventListener(
        "click",
        showHomeView
    );

conversationMessageInput
    ?.addEventListener(
        "input",
        () => {
            autoResizeConversationInput();
            updateSendButtonState();
        }
    );

conversationMessageInput
    ?.addEventListener(
        "keydown",
        event => {
            if (
                event.key ===
                "Enter" &&
                !event.shiftKey
            ) {
                event.preventDefault();
                sendConversationMessage();
            }
        }
    );

searchInput
    ?.addEventListener(
        "input",
        renderFlags
    );

categoryFilter
    ?.addEventListener(
        "change",
        renderFlags
    );

clearButton
    ?.addEventListener(
        "click",
        clearSelections
    );

scrollToBottomButton
    ?.addEventListener(
        "click",
        () => {
            scrollConversationToBottom(
                true
            );
        }
    );

window.addEventListener(
    "resize",
    () => {
        updateScrollToBottomButton();
        autoResizeConversationInput();
    }
);

window.addEventListener(
    "scroll",
    updateScrollToBottomButton
);

renderFlags();
updateSendButtonState();