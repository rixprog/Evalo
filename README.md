![github-submission-banner](https://github.com/user-attachments/assets/a1493b84-e4e2-456e-a791-ce35ee2bcf2f)

# 🚀 Evalo: AI-Based Exam Paper Evaluator

> Correct answer sheets with ease using AI. Smart feedback. Fast grading.

---

## 📌 Problem Statement

**Problem Statement 12 – Revolutionizing Educational Assessment**

---

## 🎯 Objective

Evalo solves the tedious and time-consuming process of evaluating student exam papers, particularly those with handwritten mathematical expressions, complex diagrams, and challenging handwriting styles. It serves educators at all levels who need to grade papers efficiently while providing meaningful feedback to students.

Our platform automates the evaluation process, allowing teachers to focus on teaching rather than grading while ensuring consistent assessment quality.

---

## 🧠 Team & Approach

### Team Name:  
`EvaloBrains`

### Team Members:  
- Riswan Muhammed M S ([GitHub](https://github.com/rixprog) / Full Stack Developer)
- Surya Narayanana K V ([GitHub](https://github.com/suryanarayanankv) / AI Integration Specialist)

### Your Approach:  
- We chose this problem because grading papers is one of the most time-consuming tasks for educators, leaving less time for actual teaching and curriculum development
- Key challenges we addressed include:
  - Accurately interpreting diverse handwriting styles
  - Evaluating complex mathematical expressions without errors
  - Understanding and assessing student-drawn diagrams and illustrations
  - Creating meaningful, contextual feedback based on student answers
- Our breakthrough moment came when we successfully integrated Groq's API to dramatically speed up the evaluation process while maintaining high accuracy

---

## 🛠️ Tech Stack

### Core Technologies Used:
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: FastAPI (Python)
- Database: Firebase
- APIs: Groq API 
- Hosting: Netlify (Frontend), Render (Backend)

### Sponsor Technologies Used (if any):
- ✅ **Groq:** _Groq's lightning-fast API forms the backbone of our evaluation engine, delivering results in seconds rather than minutes. Its superior natural language understanding enabled us to accurately interpret complex mathematical expressions and technical content in handwritten form. Without Groq's exceptional speed and precision, Evalo's core functionality would be significantly compromised—the API's performance was truly transformative for our project's success._

---

## ✨ Key Features

Highlight the most important features of your project:

- ✅ **Handwriting Recognition:** Accurately processes even difficult handwriting styles
- ✅ **Mathematical Expression Analysis:** Evaluates complex formulas, equations, and calculations  
- ✅ **Diagram Interpretation:** Understands and assesses student-drawn diagrams and illustrations  
- ✅ **Detailed Feedback:** Identifies mistakes and offers suggestions for improvement
- ✅ **Downloadable Reports:** Export evaluations as structured PDFs

<p align="center">
  <img src="https://raw.githubusercontent.com/rixprog/evalo/main/public/evalo-logo.png" alt="Evalo Logo" width="300" />
</p>

---

## 📽️ Demo & Deliverables

- **Demo Video Link:** [Evalo Demo](https://www.loom.com/share/evalodemovideo)  
- **Live Demo:** [https://evaloai.netlify.app/](https://evaloai.netlify.app/)
- **Pitch Deck Link:** [Evalo Pitch Deck](https://docs.google.com/presentation/d/evalo)  

---

## ✅ Tasks & Bonus Checklist

- [✅] **All members of the team completed the mandatory task - Followed at least 2 of our social channels and filled the form**
- [✅] **All members of the team completed Bonus Task 1 - Sharing of Badges and filled the form (2 points)**
- [✅] **All members of the team completed Bonus Task 2 - Signing up for Sprint.dev and filled the form (3 points)**

---

## 🧪 How to Run the Project

### Requirements:
- Node.js (v16+)
- Python (v3.8+)
- npm or yarn
- Git
- Groq API Key
- Firebase account

### Local Setup:
```bash
# Clone the repo
git clone https://github.com/rixprog/evalo.git
cd evalo

# Install frontend dependencies
npm install

# Install backend dependencies
pip install -r requirements.txt

# Set up environment variables (.env file)
# See Configuration section below

# Start the backend
uvicorn server:app --reload

# Start the frontend (in another terminal)
npm run dev
```

### Configuration:
Create a `.env` file in the project root with the following:

```
# Backend
GROQ_API_KEY=your_groq_api_key
PORT=8000

# Frontend
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

---

## 🧬 Future Scope

- 📈 **Expanded Subject Support:** Add specialized modules for chemistry, physics, and other technical subjects 
- 🛡️ **Institution Integration:** Direct integration with learning management systems (LMS)
- 🌐 **Multi-language Support:** Evaluate papers in languages beyond English
- 🧠 **Advanced Analytics:** Provide insights into common student misconceptions and learning gaps
- 📱 **Mobile App:** Develop a companion mobile application for on-the-go grading

---

## 📎 Resources / Credits

- [Groq API](https://console.groq.com/) for AI-powered text processing
- [Firebase](https://firebase.google.com/) for authentication services
- [FastAPI](https://fastapi.tiangolo.com/) for the efficient backend framework
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

## 🏁 Final Words

Our hackathon journey with Evalo has been incredibly rewarding. The challenge of accurately interpreting handwritten content, particularly complex mathematical expressions, pushed our technical skills to new heights. We're proud to have created a solution that genuinely addresses a pain point for educators worldwide.

Special thanks to the hackathon organizers and Groq for providing the powerful API that made our vision possible. We look forward to continuing development on Evalo beyond this hackathon!

---

