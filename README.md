# 🚀 AI-Powered Resume Builder

A modern, full-stack application that helps users create professional, ATS-optimized resumes using the power of Google's Gemini AI.

## ✨ Features

- **AI-Powered Generation**: Utilize Google Gemini AI to generate professional summaries, descriptions, and skills based on your inputs.
- **Real-time Preview**: See your resume updates in real-time as you edit.
- **PDF Export**: Download your polished resume as a high-quality PDF.
- **User Authentication**: Secure signup and login to save and manage your resumes.
- **Multiple Templates**: Choose from various professional resume templates (in progress).
- **Responsive Design**: Built with a mobile-first approach for use on any device.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) (with [Vite](https://vitejs.dev/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Hooks
- **PDF Generation**: `jspdf`, `html2canvas`
- **Routing**: React Router DOM

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose)
- **AI Integration**: Google Generative AI SDK (`@google/generative-ai`)
- **Authentication**: JWT (JSON Web Tokens) & `bcryptjs`

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a cloud URI)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Resume-builder
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

> **Note**: The current codebase may use a hardcoded MongoDB connection in `config/db.js`. For security, please make sure to update `backend/config/db.js` to use `process.env.MONGO_URI`.

Start the backend server:

```bash
npm start
# or for development with nodemon
npm run dev
```

The server should be running on `http://localhost:4000`.

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory (optional if using defaults):

```env
VITE_API_BASE_URL=http://localhost:4000
```

Start the frontend development server:

```bash
npm run dev
```

Access the application at `http://localhost:5173`.

## 📂 Project Structure

```
Resume-builder/
├── backend/                # Node.js/Express Backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route logic (Auth, AI, Resume)
│   ├── middleware/         # Auth & Error handling middleware
│   ├── models/             # Mongoose models (User, Resume)
│   ├── routes/             # API routes
│   └── server.js           # Entry point
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Application Pages
│   │   ├── utils/          # Helper functions & API paths
│   │   ├── App.jsx         # Main Component
│   │   └── main.jsx        # Entry point
│   ├── index.css           # Tailwind imports
│   └── vite.config.js      # Vite configuration
│
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.