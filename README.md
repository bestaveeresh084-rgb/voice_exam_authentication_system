---
# 🎤 Voice Authentication Online Exam System

This project is a **voice-based authentication and online examination platform** built with **Python (Flask)** and **HTML/CSS/JavaScript**.  
It verifies a student's identity using their **voice** before allowing them to take an exam.

---

## 🚀 Features

✅ **Voice Registration** – Students record their voice once to register.  
✅ **Voice Verification** – Matches the student's voice before exam access.  
✅ **Secure Exam Page** – Only verified users are redirected to the exam interface.  
✅ **Frontend + Backend Integration** – Built using Flask API and JS Fetch API.  
✅ **Dynamic, Modern UI** – Responsive design with animated gradients and glowing elements.  
✅ **No FFmpeg Required** – Pure browser-based WAV recording.

---

## 🧠 Workflow

1. **Register Voice**
   - Enter your Student ID.
   - Speak for 7 seconds to register your voice.
   - The system extracts MFCC features and saves a model in `backend/voice_models`.

2. **Verify Voice**
   - Enter your Student ID again.
   - Speak for 7 seconds to verify.
   - If your voice matches the saved model → Redirected to the exam page.

3. **Exam Page**
   - Simple online exam with multiple-choice questions.
   - Displays your score after submission.

---

## ⚙️ Installation

### 1️⃣ Clone or Download Project
```bash
git clone https://github.com/yourusername/voice_exam_authentication_system.git
cd voice_exam_authentication_system/backend
````

### 2️⃣ Install Dependencies

```bash
pip install flask flask-cors librosa scikit-learn sounddevice scipy numpy
```

### 3️⃣ Run Backend

```bash
python app.py
```

### 4️⃣ Open Frontend

Open `frontend/index.html` in a web browser (preferably Chrome).

---

## 🧩 Folder Structure

```
voice_exam_authentication_system/
│
├── backend/
│   ├── app.py
│   ├── voice_authentication.py
│   ├── voice_models/               # Stored voice models (.pkl)
│   └── requirements.txt
│
└── frontend/
    ├── index.html                  # Registration & Verification page
    ├── exam.html                   # Online exam page
    ├── style.css                   # Dynamic, glowing theme
    ├── script.js                   # Voice recording & upload logic
    └── exam.js                     # Exam submission logic
```

---

## 🧪 Example Console Output

```
➡ Received verify request for: 22
📁 Saved temp file: ... size: 155000 bytes
Verification Score: -80.11 | Threshold: -100
✅ Verification result: True
```

---

## 📸 Screenshots

**1️⃣ Voice Verification Screen**
Students record their voice for authentication.

**2️⃣ Exam Interface**
Animated, responsive multiple-choice question panel with glowing buttons.

---

## 👨‍💻 Technologies Used

| Component        | Technology                  |
| ---------------- | --------------------------- |
| Frontend         | HTML, CSS, JavaScript       |
| Backend          | Python Flask                |
| Voice Processing | Librosa, Scikit-learn (GMM) |
| Audio Format     | WAV                         |
| Data Storage     | Pickle Models (`.pkl`)      |

---

## 🧩 Future Enhancements

* 📡 Add database integration (SQLite / PostgreSQL)
* 🧠 Use deep learning-based speaker recognition (VGGVox / ECAPA-TDNN)
* 📷 Add face + voice dual authentication
* ⏱️ Include exam timers and question randomization

---

## 🏁 Credits

Developed by **Veeresh Besta**
🗓️ November 2025
🎓 Educational project demonstrating AI-based exam authentication.

```
