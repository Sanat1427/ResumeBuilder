import React, { useState, useRef, useCallback } from "react";
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
  Save,
  Check,
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
import { buttonStyles, containerStyles } from "../assets/dummystyle";
import html2pdf from "html2pdf.js";

// Resize observer hook
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

// --- Resume Assistant --- //
const ResumeAssistant = ({ currentPage, resumeData }) => {
  const tips = {
    "profile-info": [
      "Use your full name as it appears on official documents.",
      "A clear designation (e.g., 'Software Engineer') sets the tone.",
      "Write a 2–3 sentence summary highlighting strengths and goals.",
    ],
    "contact-info": [
      "Double-check your email and phone for accuracy.",
      "Add LinkedIn and GitHub if relevant to your career path.",
      "A personal website is a big plus for creative/tech roles.",
    ],
    "work-experience": [
      "Focus on achievements, not just responsibilities.",
      "Use action verbs like 'Led', 'Built', 'Improved'.",
      "Quantify impact (e.g., 'Improved efficiency by 20%').",
    ],
    "education-info": [
      "List your highest degree first.",
      "Include relevant coursework if you’re early in your career.",
      "Don’t forget honors, scholarships, or academic projects.",
    ],
    "skills": [
      "Prioritize skills relevant to your target job.",
      "Mix both technical and soft skills.",
      "Rate your skill levels honestly.",
    ],
    "projects": [
      "Showcase projects that prove your skills in action.",
      "Link GitHub or Live Demo if possible.",
      "Briefly describe tools, tech stack, and impact.",
    ],
    "certifications": [
      "Add only relevant and recognized certifications.",
      "Include the issuing authority and year.",
    ],
    "additionalInfo": [
      "Languages can help you stand out globally.",
      "Add hobbies that reflect creativity, teamwork, or leadership.",
      "Keep it short and authentic.",
    ],
  };

  const suggestions = tips[currentPage] || [];

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-3">💡 Resume Assistant</h2>
      <p className="text-gray-600 text-sm mb-4">
        Here are some quick tips to improve this section:
      </p>
      <ul className="space-y-3 text-sm">
        {suggestions.map((tip, i) => (
          <li
            key={i}
            className="flex items-start gap-2 p-2 rounded-lg bg-violet-50 border border-violet-100"
          >
            <span className="text-violet-600 mt-0.5">✔</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>

      {/* Motivational footer */}
      <div className="mt-auto pt-4 text-xs text-gray-500 border-t">
        ✨ Keep going — every detail makes your resume stronger!
      </div>
    </div>
  );
};

const EditResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [resumeData, setResumeData] = useState({
    title: "Professional Resume",
    profileInfo: { fullName: "", designation: "", summary: "" },
    contactInfo: { email: "", phone: "", location: "", linkedin: "", github: "", website: "" },
    workExperience: [{ company: "", role: "", startDate: "", endDate: "", description: "" }],
    education: [{ degree: "", institution: "", startDate: "", endDate: "" }],
    skills: [{ name: "", progress: 0 }],
    projects: [{ title: "", description: "", github: "", liveDemo: "" }],
    certifications: [{ title: "", issuer: "", year: "" }],
    languages: [{ name: "", progress: 0 }],
    interests: [""],
    template: { theme: "" },
  });

  const { ref: previewContainerRef, width: previewWidth } = useResizeObserver();
  const [currentPage, setCurrentPage] = useState("profile-info");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
    if (currentPage === "profile-info") {
      const { fullName, designation, summary } = resumeData.profileInfo;
      if (!fullName || !designation || !summary) {
        setErrorMsg("Please complete all profile fields before continuing.");
        return;
      }
    }
    setErrorMsg("");
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentPage(pages[nextIndex]);
      setProgress(Math.round((nextIndex / (pages.length - 1)) * 100));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setOpenPreviewModal(true);
    }
  };

  const goBack = () => {
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentPage(pages[prevIndex]);
      setProgress(Math.round((prevIndex / (pages.length - 1)) * 100));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/dashboard");
    }
  };

  // Update handlers
  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  };

  const updateArrayItem = (section, index, key, value) => {
    setResumeData((prev) => {
      const updated = [...prev[section]];
      if (key === null) updated[index] = value;
      else updated[index] = { ...updated[index], [key]: value };
      return { ...prev, [section]: updated };
    });
  };

  const addArrayItem = (section, newItem) =>
    setResumeData((prev) => ({ ...prev, [section]: [...prev[section], newItem] }));
  const removeArrayItem = (section, index) =>
    setResumeData((prev) => {
      const updated = [...prev[section]];
      updated.splice(index, 1);
      return { ...prev, [section]: updated };
    });

  const handleDeleteResume = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId));
      toast.success("Resume deleted successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete resume");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndExit = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.put(API_PATHS.RESUME.UPDATE(resumeId), resumeData);
      toast.success("Resume saved!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Save failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTheme = (theme) =>
    setResumeData((prev) => ({ ...prev, template: { ...prev.template, theme } }));

  // ✅ NEW PDF DOWNLOAD USING html2pdf.js
  const downloadPDF = () => {
    if (!resumeData) return;
    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      const element = document.getElementById("resume-preview"); // target RenderResume container
      const opt = {
        margin: 0,
        filename: `${resumeData.title || "resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 }, // better quality
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          setDownloadSuccess(true);
          toast.success("PDF downloaded!");
        });
    } catch (err) {
      console.error(err);
      toast.error("Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  // --- RENDER FORM FUNCTION ---
  const renderForm = () => {
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm
            profileData={resumeData.profileInfo}
            updateSection={(k, v) => updateSection("profileInfo", k, v)}
            onNext={validateAndNext}
          />
        );
      case "contact-info":
        return (
          <ContactInfoForm
            contactInfo={resumeData.contactInfo}
            updateSection={(k, v) => updateSection("contactInfo", k, v)}
          />
        );
      case "work-experience":
        return (
          <WorkExperienceForm
            workExperience={resumeData.workExperience}
            updateArrayItem={(i, k, v) => updateArrayItem("workExperience", i, k, v)}
            addArrayItem={(n) => addArrayItem("workExperience", n)}
            removeArrayItem={(i) => removeArrayItem("workExperience", i)}
          />
        );
      case "education-info":
        return (
          <EducationDetailsForm
            educationInfo={resumeData.education}
            updateArrayItem={(i, k, v) => updateArrayItem("education", i, k, v)}
            addArrayItem={(n) => addArrayItem("education", n)}
            removeArrayItem={(i) => removeArrayItem("education", i)}
          />
        );
      case "skills":
        return (
          <SkillsInfoForm
            skillsInfo={resumeData.skills}
            updateArrayItem={(i, k, v) => updateArrayItem("skills", i, k, v)}
            addArrayItem={(n) => addArrayItem("skills", n)}
            removeArrayItem={(i) => removeArrayItem("skills", i)}
          />
        );
      case "projects":
        return (
          <ProjectDetailForm
            projectInfo={resumeData.projects}
            updateArrayItem={(i, k, v) => updateArrayItem("projects", i, k, v)}
            addArrayItem={(n) => addArrayItem("projects", n)}
            removeArrayItem={(i) => removeArrayItem("projects", i)}
          />
        );
      case "certifications":
        return (
          <CertificationInfoForm
            certifications={resumeData.certifications}
            updateArrayItem={(i, k, v) => updateArrayItem("certifications", i, k, v)}
            addArrayItem={(n) => addArrayItem("certifications", n)}
            removeArrayItem={(i) => removeArrayItem("certifications", i)}
          />
        );
      case "additionalInfo":
        return (
          <AdditionalInfoForm
            languages={resumeData.languages}
            interests={resumeData.interests}
            updateArrayItem={(s, i, k, v) => updateArrayItem(s, i, k, v)}
            addArrayItem={(s, n) => addArrayItem(s, n)}
            removeArrayItem={(s, i) => removeArrayItem(s, i)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-sm p-4 flex items-center justify-between">
        <TitleInput
          title={resumeData.title}
          setTitle={(v) => setResumeData((prev) => ({ ...prev, title: v }))}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setOpenThemeSelector(true)}
            className="flex items-center gap-1 rounded-xl border px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
          >
            <Palette size={16} /> Theme
          </button>
          <button
            onClick={handleDeleteResume}
            disabled={isLoading}
            className="flex items-center gap-1 rounded-xl border border-red-400 text-red-600 px-3 py-2 text-sm shadow-sm hover:bg-red-50"
          >
            <Trash2 size={16} /> Delete
          </button>
          <button
            onClick={() => setOpenPreviewModal(true)}
            className="flex items-center gap-1 rounded-xl bg-blue-600 text-white px-3 py-2 text-sm shadow hover:bg-blue-700"
          >
            <Download size={16} /> Preview
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Form */}
        <div className="rounded-2xl border bg-white shadow-md p-6 h-[85vh] flex flex-col lg:col-span-1">
          <StepProgress progress={progress} />
          <div className="flex-1 overflow-y-auto pr-2">{renderForm()}</div>
          {errorMsg && (
            <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}
          <div className="mt-4 flex justify-between">
            <button
              onClick={goBack}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              onClick={handleSaveAndExit}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-green-600 text-white px-4 py-2 text-sm shadow hover:bg-green-700"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
              {isLoading ? "Saving..." : "Save & Exit"}
            </button>
            <button
              onClick={validateAndNext}
              className={buttonStyles.next}
              disabled={isLoading}
            >
              {currentPage === "additionalInfo" ? "Preview & Download" : "Next"}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="hidden lg:block lg:col-span-1">
          <div className={containerStyles.previewContainer}>
            <div className="preview-container relative" ref={previewContainerRef}>
              <div className={containerStyles.previewInner}>
                <RenderResume
                  key={`preview-${resumeData.template.theme}`}
                  templateId={resumeData.template.theme}
                  resumeData={resumeData}
                  containerWidth={previewWidth}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resume Assistant */}
        <div className="rounded-2xl border bg-white shadow-md p-6 h-[85vh] overflow-y-auto lg:col-span-1">
          <ResumeAssistant currentPage={currentPage} resumeData={resumeData} />
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
          setSelectedTheme={updateTheme}
          resumeData={resumeData}
          onClose={() => setOpenThemeSelector(false)}
        />
      </Modal>

      {/* Preview & Download Modal */}
      <Modal
        isOpen={openPreviewModal}
        onClose={() => setOpenPreviewModal(false)}
        title={resumeData.title}
        showActionBtn
        actionBtnText={
          isDownloading ? "Generating..." : downloadSuccess ? "Downloaded!" : "Download PDF"
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
            containerWidth={null}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default EditResume;
