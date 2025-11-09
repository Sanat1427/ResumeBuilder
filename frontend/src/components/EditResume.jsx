import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import RenderResume from "../components/RenderResume";
import Modal from "../components/Modal";
import ThemeSelector from "../components/ThemeSelector";
import {
  AlertCircle,
  ArrowLeft,
  Download,
  Palette,
  Trash2,
  Loader2,
  Check,
  Brain,
  Save,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import toast from "react-hot-toast";
import StepProgress from "../components/StepProgress";
import {
  ProfileInfoForm,
  ContactInfoForm,
  WorkExperienceForm,
  EducationDetailsForm,
  SkillsInfoForm,
  ProjectDetailForm,
  CertificationInfoForm,
  AdditionalInfoForm,
} from "../components/Forms";
import { TitleInput } from "./Input";
import { containerStyles } from "../assets/dummystyle";
import html2pdf from "html2pdf.js";

/* -------------------- Resize Observer Hook -------------------- */
const useResizeObserver = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useCallback((node) => {
    if (!node) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, []);
  return { ...size, ref };
};

/* -------------------- Smart AI Resume Coach -------------------- */
const AIResumeCoach = ({ resumeData }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      toast.loading("Analyzing your resume with AI...");
      const res = await axiosInstance.post("/api/ai/analyze", { resumeData });
      toast.dismiss();

      if (res.data.success) {
        setAnalysis(res.data.analysis);
        toast.success("AI analysis complete ✅");
      } else {
        toast.error("Failed to analyze. Try again.");
      }
    } catch (err) {
      console.error("AI Analysis Error:", err);
      toast.dismiss();
      toast.error("AI analysis failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-xl p-4 shadow mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Brain size={18} /> AI Resume Coach
        </h2>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-white text-purple-700 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-purple-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {analysis ? (
          <>
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <h3 className="font-semibold text-green-700 text-sm mb-1">
                💪 Strengths
              </h3>
              <ul className="list-disc pl-5 text-xs text-gray-700">
                {analysis.strengths?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <h3 className="font-semibold text-red-700 text-sm mb-1">
                ⚠️ Weaknesses
              </h3>
              <ul className="list-disc pl-5 text-xs text-gray-700">
                {analysis.weaknesses?.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <h3 className="font-semibold text-yellow-700 text-sm mb-1">
                ✨ Suggestions
              </h3>
              <ul className="list-disc pl-5 text-xs text-gray-700">
                {analysis.suggestions?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <h3 className="font-semibold text-blue-700 text-sm mb-1">
                🗣️ Tone Summary
              </h3>
              <p className="text-xs text-gray-700">{analysis.toneSummary}</p>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600 text-sm mt-5">
            💬 Click{" "}
            <span className="font-semibold text-purple-600">“Analyze”</span> to
            get personalized resume feedback.
          </div>
        )}
      </div>

      <div className="mt-4 p-3 border-t text-xs text-gray-500 text-center">
        ⚙️ AI feedback helps you refine and elevate your resume.
      </div>
    </div>
  );
};

/* -------------------- Main Component -------------------- */
const EditResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [resumeData, setResumeData] = useState({
    title: "Professional Resume",
    profileInfo: { fullName: "", designation: "", summary: "" },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [
      { company: "", role: "", startDate: "", endDate: "", description: "" },
    ],
    education: [
      { degree: "", institution: "", startDate: "", endDate: "" },
    ],
    skills: [{ name: "", progress: 0 }],
    projects: [{ title: "", description: "", github: "", liveDemo: "" }],
    certifications: [{ title: "", issuer: "", year: "" }],
    languages: [{ name: "", progress: 0 }],
    interests: [""],
    template: { theme: "01" },
  });

  const [themeConfig, setThemeConfig] = useState({
    primaryColor: "#6D28D9",
    accentColor: "#F472B6",
    fontFamily: "'Poppins', sans-serif",
    layout: "modern",
  });

  const { ref: previewContainerRef, width: previewWidth } = useResizeObserver();
  const [currentPage, setCurrentPage] = useState("profile-info");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [promptModal, setPromptModal] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");

  /* -------------------- Load Existing Resume -------------------- */
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/api/resume/${resumeId}`);
        if (res.data) {
          setResumeData(res.data);
        } else {
          toast.error("Resume not found!");
        }
      } catch (error) {
        console.error("Error loading resume:", error);
        toast.error("Failed to load resume data.");
      } finally {
        setIsLoading(false);
      }
    };

    if (resumeId) fetchResume();
  }, [resumeId]);

  /* -------------------- Save & Exit -------------------- */
  const handleSaveAndExit = async () => {
    try {
      setIsLoading(true);
      toast.loading("Saving your resume...");
      await axiosInstance.put(`/api/resume/${resumeId}`, resumeData);
      toast.dismiss();
      toast.success("✅ Resume saved successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Save Error:", error.response?.data || error.message);
      toast.dismiss();
      toast.error("Failed to save resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------- AI Resume Generator -------------------- */
  const handleAIGenerate = async () => {
    try {
      if (!userPrompt.trim()) {
        toast.error("Please enter a prompt or description first!");
        return;
      }

      setIsLoading(true);
      toast.loading("Generating resume with AI...");

      const payload = {
        prompt: userPrompt,
       name: resumeData?.profileInfo?.fullName || "John Doe",
       role: resumeData?.profileInfo?.designation || "Software Engineer",
        skills: resumeData.skills.map((s) => s.name).filter(Boolean),
        experience: resumeData.workExperience.map(
          (exp) => `${exp.role} at ${exp.company}`
        ),
        education: resumeData.education.map(
          (edu) => `${edu.degree} at ${edu.institution}`
        ),
        projects: resumeData.projects.map((proj) => proj.title),
      };

      const res = await axiosInstance.post("/api/ai/generate", payload);

      if (res.data.success && res.data.aiResume) {
        const ai = res.data.aiResume;
        setResumeData((prev) => ({
          ...prev,
          profileInfo: {
            fullName: payload.name,
            designation: payload.role,
            summary: ai.summary || prev.profileInfo.summary,
          },
          skills: ai.skills
            ? ai.skills.map((name) => ({ name, progress: 80 }))
            : prev.skills,
          workExperience: ai.experience
            ? ai.experience.map((job) => ({
                company: job.company,
                role: job.title,
                startDate: job.duration?.split("-")[0]?.trim() || "",
                endDate: job.duration?.split("-")[1]?.trim() || "",
                description: job.details?.join("\n") || "",
              }))
            : prev.workExperience,
          education: ai.education
            ? ai.education.map((edu) => ({
                degree: edu.degree,
                institution: edu.institution,
                startDate: edu.year || "",
                endDate: "",
              }))
            : prev.education,
        }));

        toast.dismiss();
        toast.success("✨ AI resume generated successfully!");
        setPromptModal(false);
        setUserPrompt("");
      } else throw new Error("AI failed to generate structured data");
    } catch (error) {
      console.error("AI Generate Error:", error);
      toast.dismiss();
      toast.error("Failed to generate with AI. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------- Navigation -------------------- */
  const pages = [
    "profile-info",
    "contact-info",
    "work-experience",
    "education-info",
    "skills",
    "projects",
    "certifications",
    "additionalInfo",
  ];

  const validateAndNext = () => {
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentPage(pages[nextIndex]);
      setProgress(Math.round((nextIndex / (pages.length - 1)) * 100));
    } else setOpenPreviewModal(true);
  };

  const goBack = () => {
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentPage(pages[prevIndex]);
      setProgress(Math.round((prevIndex / (pages.length - 1)) * 100));
    } else navigate("/dashboard");
  };

  const downloadPDF = () => {
    setIsDownloading(true);
    const element = document.getElementById("resume-preview");
    html2pdf()
      .from(element)
      .save()
      .then(() => {
        setDownloadSuccess(true);
        toast.success("PDF downloaded!");
      })
      .finally(() => setIsDownloading(false));
  };

  /* -------------------- Render -------------------- */
  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="flex justify-center items-center h-[80vh] text-gray-600">
          <Loader2 className="animate-spin mr-2" /> Loading Resume...
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="sticky top-0 z-20 bg-white shadow-sm p-4 flex items-center justify-between">
            <TitleInput
              title={resumeData.title}
              setTitle={(v) => setResumeData((prev) => ({ ...prev, title: v }))}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveAndExit}
                disabled={isLoading}
                className="flex items-center gap-1 rounded-xl bg-green-600 text-white px-3 py-2 text-sm shadow hover:bg-green-700"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                {isLoading ? "Saving..." : "Save & Exit"}
              </button>

              <button
                onClick={() => setPromptModal(true)}
                disabled={isLoading}
                className="flex items-center gap-1 rounded-xl bg-purple-600 text-white px-3 py-2 text-sm shadow hover:bg-purple-700"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "✨ Generate with AI"}
              </button>
              <button
                onClick={() => setOpenThemeSelector(true)}
                className="flex items-center gap-1 rounded-xl border px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
              >
                <Palette size={16} /> Theme
              </button>
              <button
                onClick={() => setOpenPreviewModal(true)}
                className="flex items-center gap-1 rounded-xl bg-blue-600 text-white px-3 py-2 text-sm"
              >
                <Download size={16} /> Preview
              </button>
            </div>
          </div>

          {/* Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Left */}
            <div className="rounded-2xl border bg-white shadow-md p-6 h-[85vh] flex flex-col">
              <StepProgress progress={progress} />
              <div className="flex-1 overflow-y-auto pr-2">
                {{
                  "profile-info": (
                    <ProfileInfoForm
                      profileData={resumeData.profileInfo}
                      updateSection={(k, v) =>
                        setResumeData((prev) => ({
                          ...prev,
                          profileInfo: { ...prev.profileInfo, [k]: v },
                        }))
                      }
                    />
                  ),
                  "contact-info": (
                    <ContactInfoForm
                      contactInfo={resumeData.contactInfo}
                      updateSection={(k, v) =>
                        setResumeData((prev) => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, [k]: v },
                        }))
                      }
                    />
                  ),
                  "work-experience": (
                    <WorkExperienceForm
                      workExperience={resumeData.workExperience}
                      updateArrayItem={(i, k, v) => {
                        const updated = [...resumeData.workExperience];
                        updated[i][k] = v;
                        setResumeData((prev) => ({
                          ...prev,
                          workExperience: updated,
                        }));
                      }}
                    />
                  ),
                  "education-info": (
                    <EducationDetailsForm
                      educationInfo={resumeData.education}
                      updateArrayItem={(i, k, v) => {
                        const updated = [...resumeData.education];
                        updated[i][k] = v;
                        setResumeData((prev) => ({
                          ...prev,
                          education: updated,
                        }));
                      }}
                    />
                  ),
                  skills: (
                    <SkillsInfoForm
                      skillsInfo={resumeData.skills}
                      updateArrayItem={(i, k, v) => {
                        const updated = [...resumeData.skills];
                        updated[i][k] = v;
                        setResumeData((prev) => ({
                          ...prev,
                          skills: updated,
                        }));
                      }}
                    />
                  ),
                  projects: (
                    <ProjectDetailForm
                      projectInfo={resumeData.projects}
                      updateArrayItem={(i, k, v) => {
                        const updated = [...resumeData.projects];
                        updated[i][k] = v;
                        setResumeData((prev) => ({
                          ...prev,
                          projects: updated,
                        }));
                      }}
                    />
                  ),
                  certifications: (
                    <CertificationInfoForm
                      certifications={resumeData.certifications}
                      updateArrayItem={(i, k, v) => {
                        const updated = [...resumeData.certifications];
                        updated[i][k] = v;
                        setResumeData((prev) => ({
                          ...prev,
                          certifications: updated,
                        }));
                      }}
                    />
                  ),
                  additionalInfo: (
                    <AdditionalInfoForm
                      languages={resumeData.languages}
                      interests={resumeData.interests}
                      updateArrayItem={(s, i, k, v) => {
                        const updated = [...resumeData[s]];
                        updated[i][k] = v;
                        setResumeData((prev) => ({ ...prev, [s]: updated }));
                      }}
                    />
                  ),
                }[currentPage]}
              </div>

              <div className="mt-4 flex justify-between">
                <button onClick={goBack} className="border px-4 py-2 rounded-xl">
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={validateAndNext}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                >
                  {currentPage === "additionalInfo"
                    ? "Preview & Download"
                    : "Next"}
                </button>
              </div>
            </div>

            {/* Middle */}
            <div className="hidden lg:block">
              <div className={containerStyles.previewContainer}>
                <div ref={previewContainerRef}>
                  <RenderResume
                    key={`preview-${resumeData.template.theme}-${themeConfig.primaryColor}`}
                    templateId={resumeData.template.theme}
                    resumeData={resumeData}
                    containerWidth={previewWidth}
                    themeConfig={themeConfig}
                  />
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="rounded-2xl border bg-white shadow-md p-6 h-[85vh] overflow-y-auto">
              <AIResumeCoach resumeData={resumeData} />
            </div>
          </div>

          {/* Theme Modal */}
          <Modal
            isOpen={openThemeSelector}
            onClose={() => setOpenThemeSelector(false)}
            title="Select Theme"
          >
            <ThemeSelector
              selectedTheme={resumeData.template.theme}
              setSelectedTheme={(theme) =>
                setResumeData((prev) => ({
                  ...prev,
                  template: { ...prev.template, theme },
                }))
              }
              resumeData={resumeData}
              themeConfig={themeConfig}
              setThemeConfig={setThemeConfig}
              onClose={() => setOpenThemeSelector(false)}
            />
          </Modal>

          {/* AI Prompt Modal */}
          <Modal
            isOpen={promptModal}
            onClose={() => setPromptModal(false)}
            title="Generate Resume with AI"
            showActionBtn
            actionBtnText={
              isLoading ? "Generating..." : "Generate Resume"
            }
            actionBtnIcon={
              isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Check />
              )
            }
            onActionClick={handleAIGenerate}
          >
            <div className="flex flex-col gap-4">
              <label className="text-sm font-medium text-gray-700">
                Describe the kind of resume you want AI to create:
              </label>
              <textarea
                className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500"
                rows={4}
                placeholder="Example: Create a resume for a data analyst with 5 years of experience in Power BI and SQL."
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
            </div>
          </Modal>

          {/* Preview Modal */}
          <Modal
            isOpen={openPreviewModal}
            onClose={() => setOpenPreviewModal(false)}
            title={resumeData.title}
            showActionBtn
            actionBtnText={
              isDownloading
                ? "Generating..."
                : downloadSuccess
                ? "Downloaded!"
                : "Download PDF"
            }
            actionBtnIcon={
              isDownloading ? (
                <Loader2 className="animate-spin" />
              ) : downloadSuccess ? (
                <Check />
              ) : (
                <Download />
              )
            }
            onActionClick={downloadPDF}
          >
            <div id="resume-preview">
              <RenderResume
                key={`pdf-${resumeData.template.theme}`}
                templateId={resumeData.template.theme}
                resumeData={resumeData}
                themeConfig={themeConfig}
              />
            </div>
          </Modal>
        </>
      )}
    </DashboardLayout>
  );
};

export default EditResume;
