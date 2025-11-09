import React, { useState } from "react";
import Input from "./Input";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { Wand2 } from "lucide-react";

const CreateResumeForm = ({ onSuccess }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const [aiContent, setAiContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Create a new resume
  const handleCreateResume = async (e) => {
    e.preventDefault();
    if (!title) return setError("Please enter a resume title");

    setError("");
    try {
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, { title });
      if (response.data?._id) {
        // ✅ Notify Dashboard
        if (onSuccess) onSuccess(response.data);

        // ✅ Navigate to resume editor
        navigate(`/resume/${response.data._id}`);
      }
    } catch (error) {
      console.error("Error creating resume:", error);
      setError(error.response?.data?.message || "Something went wrong.");
    }
  };

  // 🔹 AI Resume Generation
  const handleAIGenerate = async () => {
    if (!title) return setError("Please enter a resume title first");
    setError("");
    setAiContent("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/ai/generate", { title });
      if (res.data.success) setAiContent(res.data.aiResume);
      else setError("AI generation failed. Please try again.");
    } catch (err) {
      console.error(err);
      setError("Something went wrong during AI generation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-gray-100 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Create New Resume</h3>
      <p className="text-gray-600 mb-8">
        Give your Resume a title to get started. You can customize everything later.
      </p>

      <form onSubmit={handleCreateResume}>
        <Input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          label="Resume Title"
          placeholder="e.g., John Doe - Software Engineer"
          type="text"
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-rose-200 transition-all"
          >
            Create Resume
          </button>

          <button
            type="button"
            onClick={handleAIGenerate}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-indigo-200 transition-all"
          >
            <Wand2 className="w-5 h-5" />
            {loading ? "Generating..." : "AI Generate"}
          </button>
        </div>
      </form>

      {aiContent && (
        <div className="mt-6 bg-gray-50 p-4 rounded-xl border">
          <h4 className="font-semibold text-gray-800 mb-2">AI Generated Resume Draft:</h4>
          <pre className="whitespace-pre-wrap text-gray-700 text-sm">{aiContent}</pre>
        </div>
      )}
    </div>
  );
};

export default CreateResumeForm;
