# Flag Navigator

<<<<<<< Updated upstream
Flag Navigator is a full-stack web application that helps users reflect on relationship behaviors in dating, friendships, situationships, and relationships.

Users can either select predefined relationship behaviors or describe their own situation. The application then analyzes the behavior and categorizes it as a **Green Flag**, **Bare Minimum**, **Yellow Flag**, **Ick**, or **Red Flag**.

The project combines a JavaScript frontend with a Java Spring Boot backend and supports both traditional rule-based analysis and local AI-powered analysis using **Ollama**.

---

# Features

- Select predefined relationship behaviors
- Write your own relationship situation
- AI-powered text analysis using Ollama
- Rule-based behavior analysis
- Categories:
  - 🟢 Green Flag
  - ⚪ Bare Minimum
  - 🟡 Yellow Flag
  - 🟣 Ick
  - 🔴 Red Flag
- Relationship context selection:
  - Dating
  - Casual
  - Situationship
  - Relationship
  - Friendship
- Person selection
- Score-based evaluation
- REST API built with Spring Boot
- Frontend communicates with the backend using the Fetch API

---

# Technologies Used

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)

=======
Flag Navigator is a fullstack web application that analyzes relationship behaviors and situations using both traditional rule-based logic and Artificial Intelligence (AI).

The project allows users to either choose predefined relationship behaviors or write their own situation. The backend analyzes the text and returns a structured assessment with categories, severity, explanation and advice.

The project was originally built with OpenAI integration, but due to API credit limitations, the application now uses a local AI model through Ollama by default. The OpenAI integration is still included in the project and can easily be enabled by developers who want to use the OpenAI API.

---

# Features

- Analyze custom relationship situations
- Choose predefined relationship behaviors
- Multiple relationship contexts:
  - Dating
  - Casual
  - Situationship
  - Relationship
  - Friendship
- Behavior categories:
  - 🟢 Green Flag
  - 🟡 Yellow Flag
  - ⚪ Bare Minimum
  - 😬 Ick
  - 🔴 Red Flag
- Rule-based analysis
- Local AI analysis using Ollama (Llama 3.2)
- Optional OpenAI integration
- Automatic fallback system
- REST API backend
- Interactive frontend

---

# Technologies Used

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)

>>>>>>> Stashed changes
## Backend

- Java 21
- Spring Boot
- Maven
- REST API

<<<<<<< Updated upstream
## AI

- Ollama
- Llama 3.2

## Tools
=======
## Artificial Intelligence
>>>>>>> Stashed changes

- Ollama
- Llama 3.2
- OpenAI Responses API (optional)

## Development Tools

- VS Code
- Git
- GitHub
- Maven
- Postman / PowerShell (API testing)

---

# Project Structure

```text
flag-navigator/
│
├── backend/
<<<<<<< Updated upstream
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── mannat/
│   │       │           └── flag_navigator_backend/
│   │       │               ├── AnalysisController.java
│   │       │               ├── AnalysisService.java
│   │       │               ├── OllamaAnalysisService.java
│   │       │               ├── AiAnalysisService.java
│   │       │               ├── AnalyzeRequest.java
│   │       │               ├── AnalyzeResponse.java
│   │       │               ├── OpenAiProperties.java
│   │       │               └── FlagNavigatorBackendApplication.java
│   │       │
│   │       └── resources/
│   │           └── application.properties
│   │
│   └── pom.xml
=======
│   ├── src/main/java/com/mannat/flag_navigator_backend/
│   │
│   ├── AnalysisController.java
│   ├── AnalysisService.java
│   ├── AiAnalysisService.java
│   ├── OllamaAnalysisService.java
│   ├── OpenAiProperties.java
│   ├── AnalyzeRequest.java
│   ├── AnalyzeResponse.java
│   └── FlagNavigatorBackendApplication.java
>>>>>>> Stashed changes
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   └── data.js
│
├── index.html
├── README.md
└── .gitignore
<<<<<<< Updated upstream
=======
```

---

# How It Works

## Frontend

The frontend allows the user to:

- select predefined relationship behaviors
- write their own situation
- choose relationship context
- select who is being analyzed

The frontend sends a JSON request to the Spring Boot backend.

---

## Backend

The backend supports three different analysis modes.

### 1. Rule-Based Analysis

Uses manually implemented rules and keywords to classify the situation.

Endpoint:

```
POST /api/analyze
>>>>>>> Stashed changes
```

---

<<<<<<< Updated upstream
# How It Works

## 1. User Interaction

The user has two ways to use the application:

- Select one or more predefined relationship behaviors.
- Write a custom relationship situation.

The user also chooses:

- Relationship context
- Person being evaluated

---

## 2. Frontend

The JavaScript frontend collects the user input and sends it to the Spring Boot backend using the Fetch API.

Example request:
=======
### 2. Local AI Analysis (Current Default)

Uses Ollama running locally together with the Llama 3.2 language model.

Endpoint:

```
POST /api/local-ai-analyze
```

Advantages:

- completely free
- no API costs
- works offline
- no external requests

---

### 3. OpenAI Analysis (Optional)

The project also contains a complete OpenAI implementation.

Endpoint:

```
POST /api/ai-analyze
```

If a valid OpenAI API key is configured and the account has available credits, the backend will analyze the request using OpenAI.

If the API fails, no key is configured, or credits are unavailable, the backend automatically falls back to the rule-based analyzer.

Because OpenAI requires paid API credits, the project currently uses Ollama as the primary AI solution.

---

# API Example

## Request
>>>>>>> Stashed changes

```json
{
  "text": "He gives me lots of attention at first, but becomes cold whenever I set boundaries.",
  "context": "situationship",
  "person": "boy"
}
```

---

<<<<<<< Updated upstream
## 3. Backend

The Spring Boot backend exposes REST endpoints that receive the request.

Depending on which endpoint is used, the backend can:

- Perform rule-based analysis
- Analyze the situation with a local AI model
- Return a structured JSON response

---

## 4. AI Analysis

The project currently uses **Ollama** with **Llama 3.2** to perform local AI analysis.

Advantages:

- Runs completely locally
- No internet connection required after installing the model
- No API costs
- User data stays on the local machine

The project architecture also supports using the **OpenAI API** instead of Ollama. The OpenAI implementation is already included in the backend and can easily be enabled by configuring an API key.

---

## 5. Response

The backend returns a structured response containing:

- Category
- Score
- Label
- Severity
- Confidence
- Matched themes
- Explanation
- Advice

The frontend displays the analysis in a user-friendly format.

---

# API Endpoints

## Rule-Based Analysis

```http
POST /api/analyze
```

## Local AI Analysis (Ollama)

```http
POST /api/local-ai-analyze
```

## OpenAI Analysis (Optional)

```http
POST /api/ai-analyze
```

---

# Example Request

```json
{
  "text": "Han gir masse oppmerksomhet i starten, men blir kald når jeg setter grenser",
  "context": "situationship",
  "person": "boy"
}
```

---

# Example Response

```json
{
  "category": "red",
  "score": 7,
  "label": "Possible Red Flag",
  "severity": "High",
  "bareMinimum": false,
  "matchedThemes": [
    "love bombing",
    "mixed signals"
  ],
  "explanation": "The behavior contains several warning signs that may become problematic if repeated over time.",
  "advice": "Pay attention to whether this becomes a repeated pattern and whether your boundaries are respected.",
=======
## Example Response

```json
{
  "category": "yellow",
  "score": 4,
  "label": "Mixed Signals",
  "severity": "Medium",
  "bareMinimum": true,
  "matchedThemes": [
    "mixed signals",
    "boundaries"
  ],
  "explanation": "...",
  "advice": "...",
>>>>>>> Stashed changes
  "confidence": "medium"
}
```

---

<<<<<<< Updated upstream
# How to Run the Project

## 1. Clone the repository

```bash
git clone https://github.com/your-username/flag-navigator.git
=======
# Running the Project

## 1. Clone repository

```bash
git clone https://github.com/USERNAME/flag-navigator.git
>>>>>>> Stashed changes
```

---

<<<<<<< Updated upstream
## 2. Start Ollama

Install Ollama:

https://ollama.com

Download the model:

```bash
ollama pull llama3.2
```

Start the Ollama server:

```bash
ollama run llama3.2
```

---

## 3. Start the Backend

Open a terminal inside the backend folder.
=======
## 2. Start Backend
>>>>>>> Stashed changes

```bash
cd backend

mvn spring-boot:run
```

Backend:

```
http://localhost:8080
```

---

<<<<<<< Updated upstream
## 4. Start the Frontend

Open the project with VS Code and start **Live Server**.

The frontend typically runs on:

```text
http://127.0.0.1:5500
=======
## 3. Install Ollama

Download:

https://ollama.com/download

---

## 4. Download AI Model

```bash
ollama pull llama3.2
>>>>>>> Stashed changes
```

---

<<<<<<< Updated upstream
# OpenAI Support

The project includes an OpenAI service implementation in addition to Ollama.

To use OpenAI instead of Ollama:

1. Create an OpenAI API key.
2. Configure the API key as an environment variable.
3. Send requests to:

```http
POST /api/ai-analyze
```

Ollama is used by default because it runs locally and does not require API credits.

---

# Disclaimer

Flag Navigator is intended as a reflection tool.

It does **not** provide professional psychological, legal, or relationship advice and should not be used to make important personal decisions.
=======
## 5. Start Ollama

```bash
ollama run llama3.2
```

---

## 6. Start Frontend

Open

```
index.html
```

using Live Server.

Usually:

```
http://127.0.0.1:5500
```

---

# OpenAI Configuration (Optional)

Developers who prefer using OpenAI instead of Ollama can enable the existing implementation.

Set an environment variable:

```
OPENAI_API_KEY=your_api_key
```

and call

```
POST /api/ai-analyze
```

instead of

```
POST /api/local-ai-analyze
```

A paid OpenAI account with available API credits is required.

---

# Known Issues

Current limitations include:

- Small local models (Llama 3.2) may occasionally produce inconsistent classifications.
- Ollama responses can vary between runs.
- Character encoding in PowerShell may display Norwegian letters incorrectly (æ, ø, å), although the web application renders them correctly.
- OpenAI API requires paid credits.
- The project currently does not store previous analyses.
- AI responses are not deterministic and may differ slightly for identical input.

---

# Problems Encountered During Development

Several technical challenges were encountered while building this project.

## OpenAI API Credits

The initial implementation used OpenAI's Responses API.

Although the integration was completed successfully, API requests eventually failed with:

```
429
credit_balance_exhausted
```

Because the OpenAI API requires paid credits, the project was migrated to Ollama while preserving the OpenAI implementation.

---

## JSON Parsing

AI responses needed to be converted into Java objects.

This required:

- ObjectMapper
- JsonNode
- structured JSON responses

---

## Dependency Injection

Several Spring Boot dependency injection issues had to be resolved while integrating AI services.

---

## Local AI

The backend was redesigned to communicate directly with a locally running Ollama instance instead of cloud-based AI.

---

## REST API Design

The backend now supports multiple endpoints while sharing common request and response objects.
>>>>>>> Stashed changes

---

# Future Improvements

<<<<<<< Updated upstream
- Support additional AI providers (OpenAI, Gemini, Claude)
- Improve AI prompts and response consistency
- Store analysis history in a database
- User authentication and profiles
- Favorites and saved analyses
- Improved mobile responsiveness
- Better UI/UX
- Dark mode
- More predefined relationship behaviors
- Multi-language support
- Deploy the application online
=======
- User accounts
- Authentication
- Database support
- Analysis history
- Better AI prompt engineering
- Multi-language support
- Mobile responsive redesign
- Fine-tuned custom relationship model
- Better visualization of confidence and severity
- Docker support
- Deployment to cloud

---

# Disclaimer

Flag Navigator is intended as a reflection and educational tool.

It does **not** provide professional psychological, legal, medical or relationship advice.

Users should always use their own judgement when interpreting AI-generated analyses.

---

# Author

Developed by **Mannat Gabria**

Bachelor's student in Computer Engineering

Western Norway University of Applied Sciences (HVL)
>>>>>>> Stashed changes
