# Flag Navigator

Flag Navigator is an interactive relationship behavior analyzer that helps users reflect on dating, relationship, friendship, and situationship patterns.

Users can either select predefined behaviors or write their own situation. The website then gives a simple category-based analysis such as green flag, yellow flag, red flag, ick, or bare minimum.

This project is built as a fullstack web project with a JavaScript frontend and a Java Spring Boot backend.

## Features

- Select predefined relationship behaviors
- Write a custom situation for analysis
- Categorize behavior as:
  - Green flag
  - Bare minimum
  - Yellow flag
  - Ick
  - Red flag
- Score-based result system
- Context selection, such as dating, casual, situationship, relationship, and friendship
- Spring Boot REST API for backend analysis
- Frontend connected to backend using `fetch`

## Technologies Used

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Java
- Spring Boot
- REST API
- Maven

### Tools

- Git
- GitHub
- VS Code

## Project Structure

```text
flag-navigator/
├── backend/
│   └── src/main/java/com/mannat/flag_navigator_backend/
│       ├── AnalysisController.java
│       ├── AnalysisService.java
│       ├── AnalyzeRequest.java
│       ├── AnalyzeResponse.java
│       └── FlagNavigatorBackendApplication.java
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── data.js
├── index.html
├── README.md
└── .gitignore

## How It Works

The frontend displays predefined behavior cards and a custom text input field.

When the user writes a custom situation and clicks the analyze button, the frontend sends the text, context, and selected person type to the Spring Boot backend.

The backend analyzes the text using rule-based logic and returns a structured result with:

- Category
- Score
- Severity
- Matched themes
- Explanation
- Advice

## API Endpoint

### Analyze custom text

```http
POST /api/analyze
```

Example request:

```json
{
  "text": "Han gir masse oppmerksomhet i starten, men blir kald når jeg setter grenser",
  "context": "situationship",
  "person": "boy"
}
```

Example response:

```json
{
  "category": "red",
  "score": 7,
  "label": "Mulig red flag",
  "severity": "Alvorlig",
  "bareMinimum": false,
  "matchedThemes": ["love bombing", "mixed signals"],
  "explanation": "Teksten inneholder ett eller flere tegn som kan være problematiske, spesielt hvis det skjer ofte.",
  "advice": "Se om dette er et gjentatt mønster, og om personen respekterer grenser og kommuniserer tydelig.",
  "confidence": "medium"
}
```

## How to Run the Project

### 1. Start the backend

Open a terminal in the backend folder:

```bash
cd backend
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

### 2. Start the frontend

Open `index.html` with Live Server in VS Code.

The frontend usually runs on:

```text
http://127.0.0.1:5500/index.html
```

## Disclaimer

This website does not give professional relationship advice or final answers.

It is meant as a reflection tool that helps users notice possible patterns, context, and severity.

## Future Improvements

- Add AI-based analysis through the backend
- Use OpenAI API securely from Spring Boot
- Store analysis history in a database
- Add user accounts
- Improve result explanations
- Add more behavior categories and examples