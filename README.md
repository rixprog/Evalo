<p align="center">
  <img src="https://raw.githubusercontent.com/rixprog/evalo/main/public/evalo-logo.png" alt="Evalo Logo" width="300" />
</p>

<h1 align="center">Evalo - AI-Based Exam Paper Evaluator</h1>

<p align="center">
  <strong>🚀 Correct answer sheets with ease using AI. Smart feedback. Fast grading.</strong><br />
  🔗 <a href="https://evaloai.netlify.app/">Live Demo → evaloai.netlify.app</a>
</p>

## 📚 About

Evalo is a modern exam paper correction platform that automates the tedious task of evaluating student answer sheets. Just upload the student's answer sheet PDF and the teacher's answer key — Evalo will instantly process the documents, evaluate each answer using advanced AI, and deliver precise scores with detailed feedback.

## ✨ Features

- 📄 Upload student answer sheets and teacher answer keys in PDF format
- ⚡ Uses **Groq API** for fast and intelligent text processing
- 🧠 AI evaluates each answer, checks correctness, and provides a comprehensive review
- 💬 Detailed feedback on mistakes and suggestions for improvement
- 🔐 **Google and Email Authentication** using Firebase
- ⚙️ Built with **FastAPI** for a robust backend and **React + TypeScript** for a sleek frontend
- 🎨 Tailwind CSS for responsive, clean UI
- ⚡ Vite for lightning-fast development experience

## 🔧 Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: FastAPI (Python)
- **AI Integration**: Groq API
- **Auth**: Firebase (Google & Email)
- **PDF Processing**: Custom pipeline for extracting and analyzing content

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

**Make sure to change the fetch links in the components section with your localhost api endpoints**
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

### Backend Deployment

The FastAPI backend can be deployed to platforms like:

- **Render**
- **Heroku**
- **AWS Lambda**
- **GCP Cloud Functions**

Make sure to set up the appropriate environment variables on your deployment platform.

## 📊 Usage

1. **Sign in** using Google or Email authentication
2. **Upload** a student's answer sheet PDF
3. **Upload** the corresponding teacher's answer key PDF
4. **Review** the AI-generated evaluation with detailed feedback
5. **Download** the report as structured pdf

## 👨‍💻 Developers

- **Riswan Muhammed M S** - [rixprog](https://github.com/rixprog)
- **Surya Narayanana K V**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Groq](https://console.groq.com/) for providing the powerful AI API
- [Firebase](https://firebase.google.com/) for authentication services
- [FastAPI](https://fastapi.tiangolo.com/) for the efficient backend framework
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling