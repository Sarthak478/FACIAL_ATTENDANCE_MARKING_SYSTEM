# 🎯 Facial Attendance Marking System

An AI-powered attendance management platform that leverages facial recognition and real-time computer vision to automate attendance tracking.

Built using a microservice architecture with React, Node.js, Python, MongoDB, MediaPipe, Face Embeddings, and FAISS for efficient face identification.

---

## 🚀 Overview

Traditional attendance systems are time-consuming, error-prone, and vulnerable to proxy attendance.

Facial Attendance Marking System automates the entire workflow by combining modern web technologies with machine learning pipelines to provide fast, accurate, and scalable attendance tracking.

The system captures facial data through a web interface, generates facial embeddings using deep learning models, and performs similarity matching through FAISS-based indexing for near real-time recognition.

---

## ✨ Features

### 👤 Smart User Registration

- Student registration workflow
- Face capture and preview
- Retake functionality
- Image validation before submission

### 🎥 Real-Time Face Detection

- Browser-based live camera feed
- MediaPipe-powered face detection
- Bounding box visualization
- Face alignment verification

### 🧠 AI Recognition Pipeline

- Face embedding generation
- Feature vector extraction
- Similarity-based recognition
- FAISS vector indexing

### 📋 Attendance Management

- Automated attendance marking
- Attendance history storage
- Timestamp tracking
- Duplicate attendance prevention

### ⚡ Scalable Architecture

- React frontend
- Node.js API layer
- Dedicated Python ML service
- MongoDB persistence layer

---

## 🏗️ System Architecture

```text
┌──────────────────┐
│   React Client   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Node.js Backend  │
│ Express Server   │
└────────┬─────────┘
         │
 ┌───────┴────────┐
 ▼                ▼

MongoDB      Python ML Service
             │
             ▼
      Face Embeddings
             │
             ▼
           FAISS
```

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Tailwind CSS
- MediaPipe Vision Tasks

### Backend

- Node.js
- Express.js
- Multer

### Database

- MongoDB

### Machine Learning

- Python
- OpenCV
- Face Embeddings
- FAISS

---

## 📂 Project Structure

```bash
FACIAL_ATTENDANCE_MARKING_SYSTEM/

├── frontend/
│   ├── src/
│   ├── components/
│   └── pages/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── models/
│
├── ml-service/
│   ├── embeddings/
│   ├── recognition/
│   └── faiss-index/
│
└── README.md
```

---

## 🔄 Workflow

### Registration

1. User enters personal details
2. Camera opens
3. Face image captured
4. Image sent to ML service
5. Embeddings generated
6. Embeddings stored

### Attendance Marking

1. User opens attendance portal
2. Face detected in browser
3. Image sent to backend
4. Backend forwards request to ML service
5. FAISS performs similarity search
6. Attendance marked automatically
   
---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Sarthak478/FACIAL_ATTENDANCE_MARKING_SYSTEM.git
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### ML Service Setup

```bash
cd ml-service

pip install -r requirements.txt

python app.py
```

---

## 🔐 Environment Variables

### Backend

```env
MONGODB_URI=
PORT=
ML_SERVICE_URL=
```

### Frontend

```env
VITE_API_URL=
```

---

## 🎯 Future Enhancements

- Multi-face attendance support
- Role-based authentication
- Attendance analytics dashboard
- Face liveness detection
- Mobile application
- Cloud deployment support
- Real-time notifications

---

## 📈 Key Learnings

- Designing microservice-based systems
- Integrating ML pipelines with web applications
- Real-time browser vision processing
- Vector similarity search using FAISS
- Scalable API architecture
- AI + Full Stack application development

---

## 👨‍💻 Author

**Sarthak Ameriya**

Full Stack Developer | MERN Stack | AI & Computer Vision

GitHub: https://github.com/Sarthak478
