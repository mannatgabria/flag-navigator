# Flag Navigator

Flag Navigator is a full-stack web application for analyzing relationship behaviors and situations.

Users can explore predefined relationship behaviors or describe their own situation in natural language. The application analyzes the situation and classifies the behavior using categories such as:

- 🟢 Green Flag
- 🟡 Yellow Flag
- 🔴 Red Flag
- 😬 Ick
- ⚪ Bare Minimum
- 👑 Princess Treatment

The project combines a responsive JavaScript frontend with a Java Spring Boot backend and local AI analysis using **Ollama with Llama 3.2**.

The application also includes an optional OpenAI integration.

---

# Demo

## Video demonstration

> Demo video will be added here.

<!-- Replace the placeholder below when the video is ready -->

```text
VIDEO LINK:
https://your-video-link-here
```

A future demo video will show:

- starting the backend
- starting Ollama
- opening the frontend
- selecting relationship context and person
- analyzing a custom situation
- continuing an existing conversation
- dynamic flag classification
- conversation history
- changing language
- responsive chat layout
- dynamic page themes

---

# Features

## AI Relationship Analysis

Users can describe a relationship situation using natural language.

Example:

```text
He planned the entire date, brought me flowers, paid for dinner and drove me home.
```

The frontend sends the situation to the Spring Boot backend, where it is analyzed by the configured analysis service.

The result can contain:

- category
- score
- label
- severity
- Bare Minimum status
- matched themes
- explanation
- advice
- confidence

---

## Relationship Categories

Flag Navigator currently supports the following main categories:

### 🟢 Green Flag

Positive behaviors that may indicate healthy communication, care, respect or effort.

### 🟡 Yellow Flag

Behaviors that may not immediately be serious but should be observed if they become repeated patterns.

### 🔴 Red Flag

More serious warning signs involving control, pressure, manipulation, disrespect or unsafe behavior.

### 😬 Ick

Behaviors that may feel unattractive, uncomfortable or socially off-putting without necessarily being dangerous.

### ⚪ Bare Minimum

Basic behavior that should normally be expected in a healthy relationship, such as basic respect and responsibility.

### 👑 Princess Treatment

Extra effort, care or thoughtful behavior that goes beyond basic expectations.

Princess Treatment is represented as a separate visual theme in the frontend.

The current frontend supports the category, but detection still depends on the AI returning a Princess Treatment-related label or matched theme. Improving this detection is part of the planned backend prompt improvements.

---

# Relationship Context

Before starting an analysis, the user can choose the relationship context.

Available contexts include:

- Dating
- Casual
- Situationship
- Talking stage
- Relationship
- Friendship

The user can also specify who they are evaluating:

- Not relevant
- Boy / man
- Girl / woman
- Other

This context is included when the frontend sends the request to the backend.

---

# Conversation System

Flag Navigator has evolved from a single-result analyzer into a conversation-based application.

Each analysis creates a conversation that can later be reopened and continued.

A conversation stores:

- conversation ID
- title
- creation time
- relationship context
- selected person
- user messages
- assistant messages
- previous analyses
- category history
- current overall result
- current visual theme

---

## Conversation History

Previous conversations are stored locally in the browser using:

```text
localStorage
```

The main storage key is:

```text
flagNavigatorConversations
```

The currently selected conversation is stored using:

```text
flagNavigatorCurrentConversationId
```

This means conversations remain available after refreshing or reopening the page in the same browser.

No external database is currently required.

---

## Continue Previous Conversations

Users can open a previous conversation from the history sidebar and continue writing new messages.

When a new message is sent, the application builds a context containing the previous conversation before sending the new request to the AI.

This allows the AI to evaluate new information in relation to what has already happened.

For example:

```text
First message:
The date went really well and he was very respectful.

Later message:
He suddenly removed me from Snapchat without saying anything.
```

The second analysis can be evaluated in the context of the earlier messages instead of being treated as a completely unrelated situation.

---

## Automatic Conversation Titles

After the first AI analysis, Flag Navigator automatically generates a conversation title using the first relevant AI theme or label.

Examples could include:

```text
Respect
Mixed signals
Communication
Positive sign
```

The title is only created automatically for a new conversation.

If the user manually renames the conversation, the custom title is preserved.

---

## Rename and Delete Conversations

The history sidebar allows users to:

- open a previous conversation
- rename a conversation
- delete a conversation
- start a completely new conversation

Deleting a conversation removes it from browser storage.

---

# Overall Conversation Result

Each individual AI response receives a category.

The application also calculates an overall result for the full conversation.

The current priority system gives more serious warning signs greater importance.

For example, if a conversation contains both:

```text
1 Green Flag
1 Red Flag
```

the overall conversation result becomes:

```text
Red Flag
```

instead of averaging the two into an unrelated category.

The current priority order is approximately:

```text
Red
↓
Yellow
↓
Ick
↓
Princess Treatment / Green
↓
Bare Minimum
```

This prevents serious behaviors from being hidden by earlier positive interactions.

---

# Dynamic Category Counters

At the top of an active conversation, Flag Navigator displays counters for categories that have actually appeared in the conversation.

Example:

```text
1 Green
2 Yellow
1 Red
```

Categories with a count of zero are hidden.

Possible counters include:

- Green
- Yellow
- Red
- Ick
- Bare Minimum
- Princess Treatment

---

# Dynamic Conversation Themes

The page background changes based on the overall conversation result.

### Green Flag

Uses a soft green visual theme.

### Yellow Flag

Uses a warm yellow/gold theme.

### Red Flag

Uses a red/burgundy warning theme.

### Ick

Uses a muted yellow-green theme.

### Bare Minimum

Uses a light purple theme.

### Princess Treatment

Uses a soft pink theme.

The theme is changed dynamically using CSS classes such as:

```text
theme-green
theme-yellow
theme-red
theme-ick
theme-minimum
theme-princess
```

---

# Chat Interface

The active conversation uses a dedicated chat interface.

The design includes:

- user messages aligned to the right
- AI responses aligned to the left
- no large card around AI messages
- compact message bubbles
- fixed message composer at the bottom of the screen
- page-level scrolling
- fading background behind the composer
- responsive layout
- subtle browser scrollbar
- scroll-to-bottom button when the user scrolls upward

The conversation header scrolls naturally out of view when the user reads further down the conversation.

This keeps more space available for the actual conversation.

---

## Message Composer

The message composer changes depending on its state.

### Empty input

The send button displays five small vertical voice-style lines.

### Text entered

The button displays an upward arrow.

### AI request in progress

The button displays a small white stop square.

The composer stays fixed at the bottom of the viewport while the conversation itself scrolls behind it.

---

# AI Loading Animation

While the AI is processing a message, Flag Navigator displays a small animated red heart.

The heart softly grows and shrinks to show that the AI is working.

No loading text such as:

```text
Thinking...
```

is displayed.

This keeps the interface cleaner.

---

# Scroll-to-Bottom Button

When the conversation becomes long and the user scrolls upward, a circular downward arrow appears above the message composer.

Pressing the button scrolls the page back to the newest messages.

The button disappears automatically when the user is already near the bottom.

---

# Disclaimer

The conversation composer displays:

```text
Flag Navigator kan gjøre feil.
```

English:

```text
Flag Navigator can make mistakes.
```

Flag Navigator should be treated as a reflection and educational tool rather than professional relationship advice.

---

# Language Support

Flag Navigator currently supports:

- Norwegian
- English

The selected language is saved using:

```text
flagNavigatorLanguage
```

The language system translates both static and dynamically rendered interface elements.

This includes:

- navigation
- analysis settings
- buttons
- placeholders
- conversation labels
- category labels
- history
- conversation metadata
- overall result labels
- composer disclaimer

The language selector is available on both the homepage and the conversation page.

---

# Predefined Relationship Behaviors

In addition to AI text analysis, the project contains a predefined relationship behavior dataset.

Users can browse categories such as:

- Green Flags
- Yellow Flags
- Red Flags
- Icks
- Bare Minimum

Each predefined behavior can contain information such as:

- title
- category
- score
- severity
- severity level
- Bare Minimum status
- themes
- description
- advice

Example:

```javascript
{
    id: 17,
    title: "Kontrollerer hvem du snakker med",
    category: "red",
    score: 5,
    severity: "Veldig alvorlig",
    severityLevel: 5,
    isBareMinimum: false,
    themes: [
        "kontroll",
        "sjalusi",
        "grenser"
    ]
}
```

---

# Interactive Flag Explorer

The homepage contains cards for the main flag categories.

Selecting a category displays the behaviors belonging to that category.

Selecting the same category again hides the list.

Users can also:

- search for behaviors
- filter by category
- select individual behaviors
- clear selections

Selected predefined behaviors are stored locally in the browser.

---

# Technologies Used

## Frontend

- HTML5
- CSS3
- JavaScript ES6
- Fetch API
- localStorage

## Backend

- Java 21
- Spring Boot
- Maven
- REST API
- Jackson ObjectMapper
- JsonNode

## Artificial Intelligence

- Ollama
- Llama 3.2
- OpenAI API integration (optional)

## Development Tools

- Visual Studio Code
- Git
- GitHub
- PowerShell
- Maven
- Live Server
- Ollama CLI

---

# Project Structure

```text
flag-navigator/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── mannat/
│   │       │           └── flag_navigator_backend/
│   │       │               ├── AnalysisController.java
│   │       │               ├── AnalysisService.java
│   │       │               ├── AiAnalysisService.java
│   │       │               ├── OllamaAnalysisService.java
│   │       │               ├── AnalyzeRequest.java
│   │       │               ├── AnalyzeResponse.java
│   │       │               ├── OpenAiProperties.java
│   │       │               └── FlagNavigatorBackendApplication.java
│   │       │
│   │       └── resources/
│   │           └── application.properties
│   │
│   └── pom.xml
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── cases.js
│   ├── data.js
│   └── language.js
│
├── index.html
├── README.md
└── .gitignore
```

---

# Application Architecture

The application currently consists of three main layers:

```text
Frontend
   ↓
Spring Boot REST API
   ↓
Analysis service
   ↓
Ollama / Rule-based logic / Optional OpenAI
```

The frontend is responsible for:

- user interaction
- conversation history
- visual presentation
- language switching
- category counters
- conversation state
- local browser storage

The backend is responsible for:

- receiving analysis requests
- validating request data
- communicating with AI services
- parsing AI responses
- returning structured analysis data

---

# How AI Analysis Works

## 1. User Input

The user writes a situation such as:

```text
He gives me a lot of attention for a few days and then suddenly becomes cold and disappears.
```

The user also selects:

```text
context: situationship
person: boy
```

---

## 2. Frontend Request

The frontend sends a JSON request to the Spring Boot backend.

Example:

```json
{
  "text": "He gives me a lot of attention for a few days and then suddenly becomes cold and disappears.",
  "context": "situationship",
  "person": "boy"
}
```

---

## 3. Spring Boot Backend

The request is received through a REST controller.

Depending on the endpoint being used, the application can perform:

- rule-based analysis
- local Ollama analysis
- OpenAI analysis

---

## 4. Local AI Analysis

The main AI endpoint currently used by the frontend is:

```http
POST /api/local-ai-analyze
```

The backend communicates with a local Ollama server running:

```text
Llama 3.2
```

The model evaluates the situation and returns structured information.

---

## 5. JSON Parsing

AI responses need to be converted into Java objects.

The backend uses Jackson components such as:

```text
ObjectMapper
JsonNode
```

to parse the AI-generated JSON and create an `AnalyzeResponse`.

---

## 6. Backend Response

A typical response can contain:

```json
{
  "category": "yellow",
  "score": 4,
  "label": "Mixed signals",
  "severity": "Medium",
  "bareMinimum": false,
  "matchedThemes": [
    "mixed signals",
    "communication"
  ],
  "explanation": "The behavior is inconsistent and may create uncertainty if it becomes a repeated pattern.",
  "advice": "Pay attention to whether the communication becomes more stable over time.",
  "confidence": "medium"
}
```

---

## 7. Frontend Rendering

The frontend uses the response to:

- display the AI explanation
- show category information
- update the category counters
- save the analysis
- update the conversation result
- change the page theme
- preserve the conversation in history

---

# API Endpoints

## Rule-Based Analysis

```http
POST /api/analyze
```

Uses manually defined rules and behavior logic.

---

## Local AI Analysis

```http
POST /api/local-ai-analyze
```

Uses Ollama with Llama 3.2.

This is currently the main endpoint used by the frontend.

---

## OpenAI Analysis

```http
POST /api/ai-analyze
```

Uses the optional OpenAI integration.

A valid OpenAI API key and available API credits are required.

---

# Example API Request

```json
{
  "text": "Han gir masse oppmerksomhet i starten, men blir kald når jeg setter grenser.",
  "context": "situationship",
  "person": "boy"
}
```

---

# Example API Response

```json
{
  "category": "red",
  "score": 7,
  "label": "Possible Red Flag",
  "severity": "High",
  "bareMinimum": false,
  "matchedThemes": [
    "boundaries",
    "mixed signals"
  ],
  "explanation": "The situation contains warning signs that may become problematic if the pattern continues.",
  "advice": "Pay attention to whether your boundaries continue to be respected.",
  "confidence": "high"
}
```

---

# Running the Project

## 1. Clone the Repository

```bash
git clone https://github.com/mannatgabria/flag-navigator.git
```

Move into the project:

```bash
cd flag-navigator
```

---

## 2. Install Ollama

Download Ollama from:

```text
https://ollama.com
```

---

## 3. Download Llama 3.2

Run:

```bash
ollama pull llama3.2
```

---

## 4. Start Ollama

Run:

```bash
ollama run llama3.2
```

Ollama must be available locally before using the AI analysis endpoint.

---

## 5. Start the Spring Boot Backend

Open a new terminal:

```bash
cd backend
```

Run:

```bash
mvn spring-boot:run
```

The backend normally runs at:

```text
http://localhost:8080
```

---

## 6. Start the Frontend

Open the project in Visual Studio Code.

Start:

```text
Live Server
```

The frontend will normally open at an address such as:

```text
http://127.0.0.1:5500
```

---

# OpenAI Support

The project originally used the OpenAI API as the primary AI implementation.

The OpenAI implementation is still included in the backend.

Developers can configure:

```text
OPENAI_API_KEY
```

and use:

```http
POST /api/ai-analyze
```

instead of:

```http
POST /api/local-ai-analyze
```

A valid API key and available OpenAI API credits are required.

Ollama is currently used as the default solution because it can run locally without API usage costs.

---

# Problems and Challenges Encountered

Several technical challenges were encountered while developing Flag Navigator.

These problems resulted in major changes to both the architecture and the user interface.

---

## OpenAI API Credit Limitation

The original AI implementation used the OpenAI Responses API.

The integration worked, but later requests failed with an error similar to:

```text
429
credit_balance_exhausted
```

Because the API requires available paid credits, the project could not rely on OpenAI for local development.

### Solution

The application was migrated to:

```text
Ollama + Llama 3.2
```

while keeping the OpenAI implementation available as an optional alternative.

This allowed AI development to continue without API costs.

---

## Migrating from Cloud AI to Local AI

The backend originally expected responses from an external AI provider.

Switching to Ollama required changes to:

- HTTP communication
- request structure
- endpoint handling
- response parsing
- AI prompt design
- error handling

### Solution

A separate:

```text
OllamaAnalysisService
```

was introduced.

The frontend now communicates with:

```http
POST /api/local-ai-analyze
```

for normal AI analysis.

---

## AI JSON Parsing

Language models do not always produce perfectly structured responses.

The backend needed to convert AI output into predictable Java objects.

### Solution

The application uses:

```text
ObjectMapper
JsonNode
```

to parse structured JSON and map the result to:

```text
AnalyzeResponse
```

The AI prompt also requests structured output.

---

## Spring Dependency Injection

While adding multiple analysis services, Spring dependency injection needed to be configured correctly.

The project contains several backend services with different responsibilities.

### Solution

The backend was reorganized into separate classes for:

- rule-based analysis
- Ollama analysis
- OpenAI analysis
- request and response models
- controller logic
- configuration

This made the backend easier to maintain.

---

## OpenAI Fallback Logic

OpenAI requests can fail because of:

- missing API key
- invalid API configuration
- insufficient credits
- external API errors

### Solution

The backend architecture keeps the traditional analyzer available so AI providers are not the only possible analysis method.

---

## Character Encoding in PowerShell

During API testing, some Norwegian characters appeared incorrectly in PowerShell.

For example:

```text
å
ø
æ
```

could be displayed using corrupted terminal characters.

### Important

This was primarily a terminal display problem.

The frontend browser interface rendered the Norwegian text correctly.

---

## Conversation History

The first versions of Flag Navigator only displayed a single analysis result.

There was no real conversation history.

### Solution

A complete conversation system was added using browser `localStorage`.

The system now supports:

- multiple conversations
- persistent history
- reopening conversations
- continuing previous conversations
- automatic titles
- manual rename
- delete
- conversation-level analysis history

---

## History Temporarily Appearing Empty

During development, the history sidebar suddenly appeared empty even though the saved conversations still existed in `localStorage`.

The actual data had not been deleted.

### Cause

A JavaScript syntax error in:

```text
language.js
```

prevented the file from loading.

The error was caused by a missing comma between translation properties:

```javascript
composerDisclaimer: "Flag Navigator kan gjøre feil."
connectionError: "Kunne ikke analysere meldingen."
```

Because `language.js` failed to execute, the global translation function:

```javascript
t()
```

was never created.

`cases.js` depended on `t()`, which caused the conversation rendering process to crash.

### Solution

The syntax was corrected:

```javascript
composerDisclaimer: "Flag Navigator kan gjøre feil.",
connectionError: "Kunne ikke analysere meldingen."
```

The existing conversation history immediately became available again.

This showed the importance of distinguishing between:

```text
data loss
```

and:

```text
rendering failure
```

when debugging browser storage.

---

## Conversation Result Logic

An earlier conversation scoring system used numerical averages.

For example:

```text
Green = -2
Red = +4
```

One Green and one Red produced:

```text
(+4 - 2) / 2 = 1
```

which could incorrectly classify the full conversation as:

```text
Ick
```

This result did not represent the seriousness of the Red Flag.

### Solution

The overall result system was changed to use category priority.

Serious categories now have greater influence.

A Red Flag is therefore not cancelled out by an earlier Green Flag.

---

## Repeated Overall Result

Earlier versions could display the overall conversation result both:

- at the top of the page
- inside the AI message

This created unnecessary repetition.

### Solution

The AI message now focuses on the individual analysis.

The overall result is displayed separately at the top of the conversation.

A cleanup function also removes older stored overall-result text when displaying previous messages.

---

## Responsive Chat Layout

Creating the chat interface required several layout iterations.

Earlier versions caused:

- very small conversation area
- large header consuming most of the screen
- nested scrolling
- internal scrollbars
- large empty areas
- composer positioning problems
- horizontal scrolling
- fade effects not covering the full width

### Solution

The final layout uses normal page scrolling.

The conversation header scrolls away naturally while:

```text
conversation-bottom
```

remains fixed at the bottom of the viewport.

Additional bottom spacing prevents messages from being hidden behind the composer.

The design works on both:

- full-screen desktop
- narrower windows
- mobile-sized layouts

---

## Horizontal Scrollbar

A full-width fade effect originally used:

```css
width: 100vw;
```

This created an unwanted horizontal scrollbar because viewport width can include the browser scrollbar width.

### Solution

The fade was redesigned using:

```css
left: 0;
right: 0;
```

instead of forcing `100vw`.

Horizontal overflow is also prevented at page level.

---

## Scrollbar Appearance

The browser's default scrollbar visually stood out from the soft application design.

### Solution

Custom scrollbar styling was added to create a thinner and more transparent scrollbar that blends into the page.

---

## Scroll-to-Bottom Behavior

The original chat layout used scrolling inside the messages container.

After changing to full-page scrolling, the old scroll detection no longer matched the new layout.

### Solution

The scroll-to-bottom system was updated to use:

```javascript
window.scrollY
window.innerHeight
document.documentElement.scrollHeight
```

The arrow now appears only when:

- the page is scrollable
- the conversation view is active
- the user is not already near the bottom

---

## Dynamic Send Button

The message button needed several visual states without changing the overall layout.

### Solution

Three states were implemented:

```text
is-idle
is-ready
is-loading
```

These control whether the button displays:

- voice-style bars
- upward arrow
- stop square

---

## AI Loading Indicator

A text-based loading message felt visually heavy.

### Solution

A small animated heart was created using SVG and CSS animation.

This keeps the loading state visible without adding unnecessary text to the conversation.

---

## Language System

Language support became more complicated after introducing dynamic conversation content.

Static HTML translations alone were not sufficient because much of the conversation interface is created through JavaScript.

### Solution

A central:

```text
language.js
```

file now contains translation strings and exposes:

```javascript
t()
toggleLanguage()
getCurrentLanguage()
```

Dynamic rendering functions use the same translation system.

---

## Princess Treatment Detection

The frontend currently supports Princess Treatment as:

- a separate category counter
- a pink visual theme
- a conversation theme
- a display label

However, the AI does not yet consistently return:

```text
princess treatment
```

inside `matchedThemes` or the response label.

This means very positive high-effort behavior may currently be returned as a normal Green Flag.

### Planned Solution

Improve the Ollama system prompt so the model explicitly distinguishes between:

```text
basic positive behavior
```

and:

```text
Princess Treatment
```

Examples to include in future prompt engineering:

- thoughtful date planning
- flowers
- meaningful gifts
- remembering preferences
- going significantly out of the way to help
- extra care and attention
- making the person feel especially valued

---

# Current Limitations

The current version has several known limitations.

- Conversation history is stored only in browser `localStorage`.
- Clearing browser storage will remove saved conversations.
- There are currently no user accounts.
- There is no PostgreSQL/database persistence yet.
- Ollama must be running locally for local AI analysis.
- Small local language models may sometimes classify situations inconsistently.
- AI results are not deterministic.
- Princess Treatment detection still needs improved prompt engineering.
- The AI should not be treated as a professional relationship expert.
- OpenAI support requires API credits.
- The application has not yet been deployed as a complete hosted production system.

---

# Privacy

When using the local Ollama endpoint, the AI model runs on the user's own machine.

This has several advantages:

- no OpenAI API request is required
- no AI API usage cost
- analysis can run locally
- relationship text does not need to be sent to an external AI provider

Browser conversation history is also currently stored locally using `localStorage`.

---

# Future Improvements

Planned improvements include:

- improve Princess Treatment detection
- improve Ollama prompt engineering
- improve category consistency
- PostgreSQL database integration
- persistent server-side conversation storage
- user authentication
- user profiles
- cloud deployment
- backend/frontend production configuration
- Docker support
- improved error handling
- additional relationship categories
- more predefined behaviors
- improved AI confidence handling
- better long-conversation context management
- automatic conversation summarization
- database-backed history
- optional account synchronization
- dark mode
- accessibility improvements
- additional languages
- improved mobile interface
- automated backend tests
- frontend tests
- CI/CD workflow
- production security configuration
- optional additional AI providers such as Gemini or Claude

---

# Git and Version Control

The project is maintained using Git and GitHub.

Typical workflow:

```bash
git status
git add .
git commit -m "Describe the changes"
git push origin main
```

The repository is available at:

```text
https://github.com/mannatgabria/flag-navigator
```

---

# Development Status

Flag Navigator is currently an active development project.

Completed major functionality includes:

- responsive frontend
- Spring Boot backend
- REST API
- rule-based analysis
- local Ollama AI
- optional OpenAI implementation
- structured AI responses
- predefined behavior dataset
- relationship context settings
- persistent browser conversation history
- continued conversations
- automatic conversation titles
- rename and delete functionality
- dynamic conversation result
- dynamic category counters
- dynamic themes
- Norwegian and English UI
- fixed chat composer
- AI loading animation
- scroll-to-bottom navigation
- responsive conversation design

The main next development areas are:

```text
AI classification improvements
Princess Treatment detection
database persistence
deployment
```

---

# Disclaimer

Flag Navigator is intended as a reflection and educational tool.

It does **not** provide professional:

- psychological advice
- medical advice
- legal advice
- relationship counselling

AI-generated results can be incomplete, inconsistent or incorrect.

Users should always use their own judgment when interpreting the analysis.

---

# Author

Developed by **Mannat Gabria**

Bachelor's student in Computer Engineering  
Western Norway University of Applied Sciences (HVL)