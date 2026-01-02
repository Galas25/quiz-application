# Quiz Application (Vite + React)

A web-based **Quiz Application** built using **React** and **Vite**.  
This system supports **students and instructors**, includes quiz timing, result display, and basic access protection.

## Technologies Used

- **React** – UI and components
- **Vite** – Fast development and build tool
- **JavaScript (ES6+)**
- **HTML & CSS**
- **JSON** – Quiz questions storage

## Features

### Student Features
- Take quizzes with a timer
- Answer multiple-choice questions
- Auto-submit when time is up
- View quiz results
- Violation detection popup

### Instructor Features
- Instructor dashboard
- Manage quiz content (JSON-based)
- View student-related data (basic)

### System Features
- Login system
- Protected routes
- Quiz context for state management
- Timer per quiz
- Result page after submission

## Project Structure

```
quiz-application/
├── public/
│   └── questions/
│       ├── astronomy.json
│       ├── earth-science.json
│       └── honors-earth-science.json
│
├── src/
│   ├── components/
│   │   ├── Question.jsx
│   │   ├── Quiz.jsx
│   │   ├── Result.jsx
│   │   ├── Timer.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ViolationPopup.jsx
│   │
│   ├── context/
│   │   └── QuizContext.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── QuizPage.jsx
│   │   ├── ResultPage.jsx
│   │   ├── InstructorDashboard.jsx
│   │   ├── StudentDashboard.jsx
│   │   └── StorageDebug.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── App.css
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Installation & Setup

### Clone the repository
```bash
git clone https://github.com/Galas25/quiz-application.git
```

### Go to the project folder
```bash
cd quiz-application
```

### Install dependencies
```bash
npm install
```

### Run the development server
```bash
npm run dev
```

### Open in browser
```
http://localhost:5173/
```

## Available Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build

## Quiz Data

Quiz questions are stored in:
```
public/questions/
```

Each quiz is written in **JSON format**, making it easy to edit or add new quizzes.

## Purpose of the Project

This project was created for:
- Learning **React fundamentals**
- Using **Vite workflow**
- Understanding **state management with Context**
- Building a simple **quiz system**



## License

This project is open-source and free to use.
