let conversations =
    JSON.parse(
        localStorage.getItem("flagNavigatorConversations")
    ) || [];

let currentConversationId =
    localStorage.getItem(
        "flagNavigatorCurrentConversationId"
    ) || null;

function tr(key) {
    return typeof window.t === "function"
        ? window.t(key)
        : key;
}

function normalizeConversations() {
    conversations = conversations.map(conversation => ({
        ...conversation,
        title:
            conversation.title ||
            "Ny analyse",
        customTitle:
            conversation.customTitle === true,
        context:
            conversation.context ||
            "dating",
        person:
            conversation.person ||
            "not-relevant",
        messages:
            Array.isArray(conversation.messages)
                ? conversation.messages
                : [],
        analysisHistory:
            Array.isArray(conversation.analysisHistory)
                ? conversation.analysisHistory
                : [],
        overallCategory:
            conversation.overallCategory || null,
        overallTheme:
            conversation.overallTheme || null,
        result:
            conversation.result || null
    }));

    saveConversations();
}

function getCurrentConversation() {
    return conversations.find(
        conversation =>
            String(conversation.id) ===
            String(currentConversationId)
    ) || null;
}

function saveConversations() {
    localStorage.setItem(
        "flagNavigatorConversations",
        JSON.stringify(conversations)
    );

    if (currentConversationId) {
        localStorage.setItem(
            "flagNavigatorCurrentConversationId",
            String(currentConversationId)
        );
    } else {
        localStorage.removeItem(
            "flagNavigatorCurrentConversationId"
        );
    }
}

function startNewConversation() {
    currentConversationId = null;

    saveConversations();
    renderCases();
    renderCurrentConversation();

    if (
        typeof showHomeView === "function"
    ) {
        showHomeView();
    }

    if (
        typeof applyConversationTheme === "function"
    ) {
        applyConversationTheme("default");
    }

    const input =
        document.getElementById(
            "custom-behavior"
        );

    if (input) {
        input.value = "";
        input.focus();
    }

    closeSidebar();
}

function createConversation(
    context,
    person
) {
    const conversation = {
        id: Date.now(),
        title: tr("newAnalysis"),
        customTitle: false,
        createdAt:
            new Date().toISOString(),
        context: context,
        person: person,
        messages: [],
        analysisHistory: [],
        overallCategory: null,
        overallTheme: null,
        result: null
    };

    conversations.unshift(
        conversation
    );

    currentConversationId =
        conversation.id;

    saveConversations();
    renderCases();

    return conversation;
}

function addMessageToCurrentConversation(
    role,
    text
) {
    const conversation =
        getCurrentConversation();

    if (!conversation) {
        return;
    }

    conversation.messages.push({
        id:
            Date.now() +
            conversation.messages.length,
        role: role,
        text: text,
        createdAt:
            new Date().toISOString()
    });

    saveConversations();
    renderCases();
    renderCurrentConversation();
}

function normalizeAnalysisCategory(
    analysis
) {
    const value =
        String(
            analysis?.category || ""
        )
            .trim()
            .toLowerCase();

    if (
        analysis?.bareMinimum === true &&
        value.includes("green")
    ) {
        return "minimum";
    }

    if (value.includes("red")) {
        return "red";
    }

    if (value.includes("yellow")) {
        return "yellow";
    }

    if (value.includes("ick")) {
        return "ick";
    }

    if (value.includes("minimum")) {
        return "minimum";
    }

    if (value.includes("green")) {
        return "green";
    }

    return "yellow";
}

function isPrincessTreatment(
    analysis
) {
    const themes =
        Array.isArray(
            analysis?.matchedThemes
        )
            ? analysis.matchedThemes
            : [];

    const text = [
        ...themes,
        analysis?.label || ""
    ]
        .join(" ")
        .toLowerCase();

    return (
        text.includes(
            "princess treatment"
        ) ||
        text.includes(
            "princess-treatment"
        ) ||
        text.includes("princess")
    );
}

function getDisplayCategory(
    analysis
) {
    if (
        isPrincessTreatment(
            analysis
        )
    ) {
        return "princess";
    }

    return normalizeAnalysisCategory(
        analysis
    );
}

function addAnalysisToCurrentConversation(
    analysis
) {
    const conversation =
        getCurrentConversation();

    if (!conversation) {
        return null;
    }

    if (
        !Array.isArray(
            conversation.analysisHistory
        )
    ) {
        conversation.analysisHistory =
            [];
    }

    const category =
        normalizeAnalysisCategory(
            analysis
        );

    const displayCategory =
        getDisplayCategory(
            analysis
        );

    const storedAnalysis = {
        id: Date.now(),
        category: category,
        displayCategory:
            displayCategory,
        theme: displayCategory,
        label:
            analysis.label || "",
        severity:
            analysis.severity || "",
        bareMinimum:
            analysis.bareMinimum === true,
        matchedThemes:
            Array.isArray(
                analysis.matchedThemes
            )
                ? analysis.matchedThemes
                : [],
        explanation:
            analysis.explanation || "",
        advice:
            analysis.advice || "",
        confidence:
            analysis.confidence || "",
        createdAt:
            new Date().toISOString()
    };

    conversation.analysisHistory.push(
        storedAnalysis
    );

    conversation.result =
        storedAnalysis;

    const overall =
        calculateOverallConversationResult(
            conversation
        );

    conversation.overallCategory =
        overall.category;

    conversation.overallTheme =
        overall.theme;

    saveConversations();
    renderCases();
    renderCurrentConversation();

    return overall;
}

function getConversationCategoryCounts(
    conversation
) {
    const counts = {
        green: 0,
        yellow: 0,
        red: 0,
        ick: 0,
        minimum: 0,
        princess: 0
    };

    if (
        !conversation ||
        !Array.isArray(
            conversation.analysisHistory
        )
    ) {
        return counts;
    }

    conversation.analysisHistory.forEach(
        item => {
            const category =
                item.displayCategory ||
                item.theme ||
                item.category;

            if (
                Object.prototype
                    .hasOwnProperty.call(
                        counts,
                        category
                    )
            ) {
                counts[category]++;
            }
        }
    );

    return counts;
}

function calculateOverallConversationResult(
    conversation =
        getCurrentConversation()
) {
    const counts =
        getConversationCategoryCounts(
            conversation
        );

    if (
        !conversation ||
        !Array.isArray(
            conversation.analysisHistory
        ) ||
        conversation.analysisHistory.length === 0
    ) {
        return {
            category: null,
            theme: "default",
            label: "",
            counts: counts
        };
    }

    let category;
    let theme;

    // Mest alvorlige kategori veier tyngst
    if (counts.red > 0) {
        category = "red";
        theme = "red";
    } else if (counts.yellow > 0) {
        category = "yellow";
        theme = "yellow";
    } else if (counts.ick > 0) {
        category = "ick";
        theme = "ick";
    } else if (
        counts.princess > 0 &&
        counts.princess >= counts.green
    ) {
        category = "green";
        theme = "princess";
    } else if (counts.green > 0) {
        category = "green";
        theme = "green";
    } else {
        category = "minimum";
        theme = "minimum";
    }

    return {
        category: category,
        theme: theme,
        label:
            getOverallLabel(
                category,
                theme
            ),
        counts: counts
    };
}

function getOverallLabel(
    category,
    theme
) {
    if (theme === "princess") {
        return tr(
            "princessTreatment"
        );
    }

    const labels = {
        green:
            tr("greenFlag"),
        yellow:
            tr("yellowFlag"),
        red:
            tr("redFlag"),
        ick:
            "Ick",
        minimum:
            tr("bareMinimum")
    };

    return labels[category] || "";
}

function getScoreLabel(
    category
) {
    const labels = {
        green:
            tr("green"),
        yellow:
            tr("yellow"),
        red:
            tr("red"),
        ick:
            tr("icks"),
        minimum:
            tr("bareMinimum"),
        princess:
            tr("princessTreatment")
    };

    return labels[category] ||
        category;
}

function setConversationTitleFromAnalysis(
    analysis
) {
    const conversation =
        getCurrentConversation();

    if (
        !conversation ||
        conversation.customTitle
    ) {
        return;
    }

    if (
        conversation.analysisHistory.length >
        0
    ) {
        return;
    }

    const themes =
        Array.isArray(
            analysis.matchedThemes
        )
            ? analysis.matchedThemes
            : [];

    let title =
        themes[0] ||
        analysis.label ||
        tr("newAnalysis");

    title =
        String(title).trim();

    if (title.length > 0) {
        title =
            title.charAt(0)
                .toUpperCase() +
            title.slice(1);
    }

    if (title.length > 42) {
        title =
            title.substring(
                0,
                42
            ) + "...";
    }

    conversation.title =
        title;

    saveConversations();
    renderCases();
}

function selectConversation(id) {
    currentConversationId = id;

    saveConversations();

    const conversation =
        getCurrentConversation();

    if (!conversation) {
        return;
    }

    const contextSelect =
        document.getElementById(
            "context"
        );

    const personSelect =
        document.getElementById(
            "person"
        );

    if (contextSelect) {
        contextSelect.value =
            conversation.context;
    }

    if (personSelect) {
        personSelect.value =
            conversation.person;
    }

    const overall =
        calculateOverallConversationResult(
            conversation
        );

    conversation.overallCategory =
        overall.category;

    conversation.overallTheme =
        overall.theme;

    saveConversations();

    renderCases();
    renderCurrentConversation();

    if (
        typeof applyConversationTheme ===
        "function"
    ) {
        applyConversationTheme(
            overall.theme
        );
    }

    if (
        typeof showConversationView ===
        "function"
    ) {
        showConversationView();
    }

    closeSidebar();
}

function renameConversation(id) {
    const conversation =
        conversations.find(
            conversation =>
                String(
                    conversation.id
                ) === String(id)
        );

    if (!conversation) {
        return;
    }

    const newTitle =
        prompt(
            tr("rename"),
            conversation.title
        );

    if (
        !newTitle ||
        !newTitle.trim()
    ) {
        return;
    }

    conversation.title =
        newTitle.trim();

    conversation.customTitle =
        true;

    saveConversations();
    renderCases();
    renderCurrentConversation();
}

function deleteConversation(id) {
    const confirmed =
        confirm(
            tr("deleteConfirm")
        );

    if (!confirmed) {
        return;
    }

    conversations =
        conversations.filter(
            conversation =>
                String(
                    conversation.id
                ) !== String(id)
        );

    if (
        String(
            currentConversationId
        ) === String(id)
    ) {
        currentConversationId =
            null;

        if (
            typeof applyConversationTheme ===
            "function"
        ) {
            applyConversationTheme(
                "default"
            );
        }

        if (
            typeof showHomeView ===
            "function"
        ) {
            showHomeView();
        }
    }

    saveConversations();
    renderCases();
    renderCurrentConversation();
}

function renderCases() {
    const list =
        document.getElementById(
            "casesList"
        );

    if (!list) {
        return;
    }

    list.innerHTML = "";

    if (
        conversations.length === 0
    ) {
        const empty =
            document.createElement("p");

        empty.className =
            "empty-message";

        empty.textContent =
            tr("noConversationsYet");

        list.appendChild(empty);
        return;
    }

    conversations.forEach(
        conversation => {
            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "case-card";

            if (
                String(
                    currentConversationId
                ) ===
                String(
                    conversation.id
                )
            ) {
                card.classList.add(
                    "active"
                );
            }

            const title =
                document.createElement(
                    "h3"
                );

            title.textContent =
                conversation.title;

            const info =
                document.createElement(
                    "p"
                );

            const overall =
                calculateOverallConversationResult(
                    conversation
                );

            info.textContent =
                overall.label
                    ? `${conversation.messages.length} ${tr("messages")} • ${overall.label}`
                    : `${conversation.messages.length} ${tr("messages")}`;

            const actions =
                document.createElement(
                    "div"
                );

            actions.className =
                "case-actions";

            const renameButton =
                document.createElement(
                    "button"
                );

            renameButton.className =
                "rename-case";

            renameButton.textContent =
                tr("rename");

            renameButton.onclick =
                event => {
                    event.stopPropagation();

                    renameConversation(
                        conversation.id
                    );
                };

            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.className =
                "delete-case";

            deleteButton.textContent =
                tr("delete");

            deleteButton.onclick =
                event => {
                    event.stopPropagation();

                    deleteConversation(
                        conversation.id
                    );
                };

            card.onclick =
                () => {
                    selectConversation(
                        conversation.id
                    );
                };

            actions.appendChild(
                renameButton
            );

            actions.appendChild(
                deleteButton
            );

            card.appendChild(title);
            card.appendChild(info);
            card.appendChild(actions);
            list.appendChild(card);
        }
    );
}

function cleanStoredAssistantText(
    text
) {
    if (!text) {
        return "";
    }

    return String(text)
        .replace(
            /\n{1,2}Samlet resultat(?: for samtalen)?:\s*\n?[^\n]*/gi,
            ""
        )
        .replace(
            /\n{1,2}Overall result(?: for the conversation)?:\s*\n?[^\n]*/gi,
            ""
        )
        .trim();
}

function renderCurrentConversation() {
    const conversation =
        getCurrentConversation();

    const titleElement =
        document.getElementById(
            "activeCaseName"
        );

    const settingsElement =
        document.getElementById(
            "conversationSettings"
        );

    const overallElement =
        document.getElementById(
            "conversationOverall"
        );

    const scoresElement =
        document.getElementById(
            "conversationScores"
        );

    const messagesElement =
        document.getElementById(
            "caseEvents"
        );

    if (
        !titleElement ||
        !settingsElement ||
        !overallElement ||
        !scoresElement ||
        !messagesElement
    ) {
        return;
    }

    settingsElement.innerHTML = "";
    overallElement.innerHTML = "";
    scoresElement.innerHTML = "";
    messagesElement.innerHTML = "";

    if (!conversation) {
        titleElement.textContent =
            tr("newAnalysis");

        messagesElement.innerHTML =
            `<p class="empty-message">${tr("noConversationSelected")}</p>`;

        return;
    }

    titleElement.textContent =
        conversation.title;

    const contextSpan =
        document.createElement("span");

    contextSpan.textContent =
        `${tr("situationLabel")}: ${getContextName(conversation.context)}`;

    const personSpan =
        document.createElement("span");

    personSpan.textContent =
        `${tr("personLabel")}: ${getPersonName(conversation.person)}`;

    settingsElement.appendChild(
        contextSpan
    );

    settingsElement.appendChild(
        personSpan
    );

    const overall =
        calculateOverallConversationResult(
            conversation
        );

    if (overall.label) {
        const badge =
            document.createElement(
                "div"
            );

        badge.className =
            `overall-badge ${overall.theme}`;

        badge.textContent =
            `${tr("overallResult")}: ${overall.label}`;

        overallElement.appendChild(
            badge
        );
    }

    const order = [
        "green",
        "yellow",
        "red",
        "ick",
        "minimum",
        "princess"
    ];

    order.forEach(category => {
        const amount =
            overall.counts[
                category
            ];

        if (amount <= 0) {
            return;
        }

        const card =
            document.createElement(
                "div"
            );

        card.className =
            `conversation-score-card ${category}`;

        const number =
            document.createElement(
                "strong"
            );

        number.textContent =
            String(amount);

        const label =
            document.createElement(
                "span"
            );

        label.textContent =
            getScoreLabel(
                category
            );

        card.appendChild(number);
        card.appendChild(label);

        scoresElement.appendChild(
            card
        );
    });

    if (
        conversation.messages.length === 0
    ) {
        messagesElement.innerHTML =
            `<p class="empty-message">${tr("noMessagesYet")}</p>`;

        return;
    }

    conversation.messages.forEach(
        message => {
            const messageElement =
                document.createElement(
                    "div"
                );

            messageElement.className =
                `chat-message ${message.role}`;

            const role =
                document.createElement(
                    "strong"
                );

            role.textContent =
                message.role === "user"
                    ? tr("user")
                    : tr("assistant");

            const text =
                document.createElement(
                    "p"
                );

            text.textContent =
                message.role ===
                    "assistant"
                    ? cleanStoredAssistantText(
                        message.text
                    )
                    : message.text;

            messageElement.appendChild(
                role
            );

            messageElement.appendChild(
                text
            );

            messagesElement.appendChild(
                messageElement
            );
        }
    );

    requestAnimationFrame(() => {
        messagesElement.scrollTop =
            messagesElement.scrollHeight;

        if (
            typeof updateScrollToBottomButton ===
            "function"
        ) {
            updateScrollToBottomButton();
        }
    });
}

function getContextName(
    context
) {
    const names = {
        dating:
            tr("dating"),
        casual:
            tr("casual"),
        situationship:
            tr("situationship"),
        talking:
            tr("talking"),
        relationship:
            tr("relationship"),
        friendship:
            tr("friendship")
    };

    return names[context] ||
        context ||
        "";
}

function getPersonName(
    person
) {
    const names = {
        "not-relevant":
            tr("notRelevant"),
        boy:
            tr("man"),
        girl:
            tr("woman"),
        other:
            tr("other")
    };

    return names[person] ||
        person ||
        "";
}

function openSidebar() {
    document
        .getElementById(
            "historySidebar"
        )
        ?.classList.add("open");

    document
        .getElementById(
            "sidebarOverlay"
        )
        ?.classList.add("visible");
}

function closeSidebar() {
    document
        .getElementById(
            "historySidebar"
        )
        ?.classList.remove("open");

    document
        .getElementById(
            "sidebarOverlay"
        )
        ?.classList.remove(
            "visible"
        );
}

function toggleSidebar() {
    const sidebar =
        document.getElementById(
            "historySidebar"
        );

    if (!sidebar) {
        return;
    }

    if (
        sidebar.classList.contains(
            "open"
        )
    ) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function refreshStoredOverallResults() {
    conversations.forEach(
        conversation => {
            const overall =
                calculateOverallConversationResult(
                    conversation
                );

            conversation.overallCategory =
                overall.category;

            conversation.overallTheme =
                overall.theme;
        }
    );

    saveConversations();
}

normalizeConversations();
refreshStoredOverallResults();

window.addEventListener(
    "DOMContentLoaded",
    () => {
        renderCases();
        renderCurrentConversation();
    }
);