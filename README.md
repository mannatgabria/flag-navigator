# Flag Navigator

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

## Backend

- Java 21
- Spring Boot
- REST API
- Maven

## AI

- Ollama
- Llama 3.2

## Tools

- Git
- GitHub
- VS Code

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
```

---

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

```json
{
  "text": "Han gir masse oppmerksomhet i starten, men blir kald når jeg setter grenser",
  "context": "situationship",
  "person": "boy"
}
```

---

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
  "confidence": "medium"
}
```

---

# How to Run the Project

## 1. Clone the repository

```bash
git clone https://github.com/your-username/flag-navigator.git
```

---

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

```bash
cd backend
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

---

## 4. Start the Frontend

Open the project with VS Code and start **Live Server**.

The frontend typically runs on:

```text
http://127.0.0.1:5500
```

---

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

---

# Future Improvements

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
