<p align="center">
  <img src="https://raw.githubusercontent.com/rixprog/evalo/main/public/evalo-logo.png" alt="Evalo Logo" width="300" />
</p>

<h1 align="center">Evalo</h1>
<p align="center"><strong>AI-Based Exam Paper Evaluator</strong></p>

<p align="center">
  <a href="https://evaloai.netlify.app/">Live Demo</a> •
  <a href="#-about">About</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-developers">Developers</a>
</p>

<p align="center">
  <strong>🚀 Correct answer sheets with ease using AI. Smart feedback. Fast grading.</strong>
</p>

<p align="center">
  <em>Specialized in analyzing handwritten mathematical expressions, complex diagrams, and even the most challenging handwriting styles!</em>
</p>

---

## 📚 About

Evalo is a modern exam paper correction platform that automates the tedious task of evaluating student answer sheets. Simply upload the student's answer sheet PDF and the teacher's answer key — Evalo will instantly process the documents, evaluate each answer using advanced AI, and deliver precise scores with detailed feedback.

The platform excels at processing handwritten content, including sophisticated mathematical expressions, technical diagrams, and various handwriting styles. Whether students write neatly or have challenging penmanship, Evalo's advanced AI can accurately interpret and evaluate their work.

## ✨ Features

- 📄 **PDF Upload:** Upload student answer sheets and teacher answer keys in PDF format
- ✏️ **Handwriting Recognition:** Accurately processes even difficult handwriting styles
- 🧮 **Mathematical Expression Analysis:** Evaluates complex formulas, equations, and calculations
- 📊 **Diagram Interpretation:** Understands and assesses student-drawn diagrams and illustrations
- ⚡ **Groq API Integration:** Fast and intelligent text processing for accurate evaluations
- 🧠 **AI-Powered Analysis:** Evaluates each answer, checks correctness, and provides comprehensive review
- 💬 **Detailed Feedback:** Identifies mistakes and offers suggestions for improvement
- 🔐 **Secure Authentication:** Google and Email sign-in via Firebase
- 📊 **Downloadable Reports:** Export evaluations as structured PDFs

## 🔧 Tech Stack

| Component | Technologies |
|-----------|-------------|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS |
| **Backend** | FastAPI (Python) |
| **AI Integration** | Groq API |
| **Authentication** | Firebase (Google & Email) |
| **PDF Processing** | Custom extraction pipeline |

## 📁 Project Structure

```
evalo/
├── src/                 # React frontend (Vite + Tailwind)
├── server.py            # FastAPI backend (Python)
├── requirements.txt     # Python backend dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- npm or yarn
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/rixprog/evalo.git
cd evalo
```

2. **Install Frontend Dependencies**

```bash
# In the project root
npm install
```

3. **Install Backend Dependencies**

```bash
# In the project root
pip install -r requirements.txt
```

### Configuration

1. **Create a `.env` file in the project root**

```
# Backend
GROQ_API_KEY=your_groq_api_key
PORT=8000

# Frontend
# Note: Change the fetch links in components with your localhost API endpoints
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

2. **Firebase Setup**
   - Create a project on [Firebase Console](https://console.firebase.google.com/)
   - Enable Google and Email Authentication
   - Add your web app to the Firebase project
   - Copy the config values to your `.env` file

3. **Groq API Setup**
   - Sign up for [Groq](https://console.groq.com/)
   - Generate an API key
   - Add the API key to your `.env` file

### Running Locally

1. **Start the Backend**

```bash
# In the project root
uvicorn server:app --reload
```

2. **Start the Frontend**

```bash
# In another terminal, in the project root
npm run dev
```

3. **Access the Application**

Open your browser and navigate to:
```
http://localhost:5173/
```

## 🌐 Deployment

### Frontend Deployment (Netlify)

1. Connect your GitHub repository to Netlify
2. Set build command to `npm run build`
3. Set publish directory to `dist`
4. Add environment variables from your `.env` file

### Backend Deployment Options

- **Render**
- **Heroku**
- **AWS Lambda**
- **GCP Cloud Functions**

> ⚠️ Remember to set up the appropriate environment variables on your deployment platform.

## 📊 Usage

1. **Sign in** using Google or Email authentication
2. **Upload** a student's answer sheet PDF
3. **Upload** the corresponding teacher's answer key PDF
4. **Review** the AI-generated evaluation with detailed feedback
5. **Download** the report as structured PDF

   
## 📋 Document Preparation Guidelines

### Answer Key Guidelines

For optimal results when uploading answer keys:

1. **Ensure Question Numbers are Clearly Visible**: 
   Example: "Question 1: LED Characteristics (5 marks)"

2. **Include Clear Grading Criteria**: 
   Example: "Forward Voltage Characteristic (1 mark), Proper labeling (1 mark), Current analysis (1 mark)"

3. **Add Visual Clarity**: 
   Example: Include a properly labeled I-V curve diagram showing threshold voltage and current flow

4. **Include Grading Guidelines**: 
   Example: "5 marks: All characteristics accurately drawn with proper labels and axes
   4 marks: Correct curve with minor labeling issues
   3 marks: Basic understanding shown but missing key features"

5. **Maintain Consistent Formatting**: 
   Example: Use the same structure for all questions: number, title, marks, expected elements, grading criteria

6. **Add Overall Scoring Information**: 
   Example: "Total available marks: 15, Pass mark: 8 (53%), Distinction threshold: 12 (80%)"

The better structured your answer key, the more accurate the AI evaluation will be.

### Student Answer Sheet Guidelines

For accurate evaluation of student answers:

1. **Ensure Page Clarity**: 
   Example: Use good lighting when scanning or photographing answers, avoid shadows or glare

2. **Check Complete Document Scan**: 
   Example: If the exam has 5 pages, verify all 5 pages are included in the PDF

3. **Verify Question Numbers**: 
   Example: Each answer should be clearly marked with "Q1", "Question 1", or similar identifier

4. **Review PDF Quality**: 
   Example: Scan at 300 DPI or higher, check that all text and diagrams are sharp and readable

5. **Confirm Readability**: 
   Example: Handwritten equations like "∫(x²+1)dx = x³/3+x+C" should be clearly written

6. **Check Diagram Visibility**: 
   Example: Circuit diagrams should show all components and connections clearly

7. **Maintain Consistent Page Orientation**: 
   Example: All pages should be oriented the same way (portrait or landscape) without rotation

For handwritten mathematical expressions and diagrams, our AI is specially optimized to interpret and evaluate these elements accurately.
## 👨‍💻 Developers

- **Riswan Muhammed M S** - [rixprog](https://github.com/rixprog)
- **Surya Narayanana K V** - [suryanarayanankv](https://github.com/suryanarayanankv)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Groq](https://console.groq.com/) for providing the powerful AI API
- [Firebase](https://firebase.google.com/) for authentication services
- [FastAPI](https://fastapi.tiangolo.com/) for the efficient backend framework
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
