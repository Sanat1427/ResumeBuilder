import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import RenderResume from "../components/RenderResume";
import Modal from "../components/Modal";
import ThemeSelector from "../components/ThemeSelector";
import {
  ArrowLeft,
  Download,
  Palette,
  Trash2,
  Save,
  Check,
} from "lucide-react";

// ---------------- Resume Assistant ----------------
const ResumeAssistant = ({ currentPage, resumeData }) => {
  // Tips depending on current form section
  const tips = {
    "profile-info": [
      "Add your full name and professional title.",
      "Write a short 2–3 line summary that highlights your strengths.",
    ],
    "contact-info": [
      "Use a professional email address.",
      "Include LinkedIn, GitHub, or personal website if available.",
    ],
    "work-experience": [
      "List jobs in reverse chronological order.",
      "Use strong action verbs (e.g., Led, Developed, Designed).",
    ],
    "education-info": [
      "Include degree, institution, and year of completion.",
      "Only mention GPA or coursework if it adds value.",
    ],
    "skills": [
      "Focus on 6–10 key skills that match the job description.",
      "Group related skills together for readability.",
    ],
    "projects": [
      "Highlight 2–3 impactful projects.",
      "Include links to GitHub or live demo if possible.",
    ],
    "certifications": [
      "Add recent and relevant certifications only.",
    ],
    "additionalInfo": [
      "Mention languages, interests, or achievements.",
      "Keep it short and professional.",
    ],
  };

  // Smart suggestions based on resumeData
  const suggestions = [];
  if (currentPage === "profile-info") {
    if (!resumeData.profileInfo.fullName) {
      suggestions.push("You haven’t added your full name yet.");
    }
    if (!resumeData.profileInfo.designation) {
      suggestions.push("Consider adding your job title (e.g., Software Engineer).");
    }
    if (!resumeData.profileInfo.summary || resumeData.profileInfo.summary.length < 30) {
      suggestions.push("Your summary looks short — add more details about your strengths.");
    }
  }

  if (currentPage === "contact-info") {
    if (!resumeData.contactInfo.linkedin) {
      suggestions.push("Adding a LinkedIn link makes your resume stronger.");
    }
    if (!resumeData.contactInfo.email.includes("@")) {
      suggestions.push("Please add a valid professional email address.");
    }
  }

  if (currentPage === "skills" && resumeData.skills.length < 3) {
    suggestions.push("Add at least 3–5 strong skills relevant to your field.");
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Resume Assistant</h2>
      <p className="text-gray-600 text-sm">
        You’re editing: <span className="font-medium">{currentPage}</span>
      </p>

      {/* Tips */}
      <div className="bg-gray-50 p-3 rounded-lg border space-y-2">
        <h3 className="text-sm font-semibold">Tips</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {tips[currentPage]?.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* Smart suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 space-y-2">
          <h3 className="text-sm font-semibold text-blue-800">Suggestions</h3>
          <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
            {suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ---------------- Main EditResume Component ----------------
const EditResume = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Example resume data
  const [resumeData, setResumeData] = useState({
    profileInfo: { fullName: "", designation: "", summary: "" },
    contactInfo: { email: "", phone: "", linkedin: "" },
    workExperience: [],
    educationInfo: [],
    skills: [],
    projects: [],
    certifications: [],
    additionalInfo: "",
  });

  const [currentPage, setCurrentPage] = useState("profile-info");
  const [showThemeModal, setShowThemeModal] = useState(false);

  const handleSave = useCallback(() => {
    console.log("Resume saved!", resumeData);
    alert("Resume saved successfully!");
  }, [resumeData]);

  const handleDownload = useCallback(() => {
    console.log("Downloading resume as PDF...");
    alert("Download triggered!");
  }, []);

  const handleDelete = useCallback(() => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      console.log("Resume deleted:", id);
      navigate("/dashboard");
    }
  }, [id, navigate]);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <h1 className="text-lg font-semibold">Edit Resume</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Save className="w-4 h-4 mr-1" /> Save
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Download className="w-4 h-4 mr-1" /> Download
          </button>
          <button
            onClick={() => setShowThemeModal(true)}
            className="flex items-center px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            <Palette className="w-4 h-4 mr-1" /> Theme
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-12 gap-4 p-4">
        {/* Left: Resume Form Placeholder */}
        <div className="col-span-3 bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Form (Editing: {currentPage})</h2>
          {/* Replace with your actual form */}
          <p className="text-gray-500 text-sm">Form fields for {currentPage} will go here.</p>
        </div>

        {/* Center: Resume Preview */}
        <div className="col-span-6 bg-white p-4 rounded-lg shadow">
          <RenderResume resumeData={resumeData} />
        </div>

        {/* Right: Resume Assistant */}
        <div className="col-span-3 bg-white p-4 rounded-lg shadow">
          <ResumeAssistant currentPage={currentPage} resumeData={resumeData} />
        </div>
      </div>

      {/* Theme Modal */}
      {showThemeModal && (
        <Modal onClose={() => setShowThemeModal(false)}>
          <ThemeSelector />
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default EditResume;
