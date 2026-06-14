import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import RenderResume from "../components/RenderResume";
import Modal from "../components/Modal";
import ThemeSelector from "../components/ThemeSelector";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Download,
  Palette,
  Trash2,
  Loader2,
  Check,
  Brain,
  Save,
  Sparkles,
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Hammer,
  FolderGit,
  Award,
  Globe,
  Settings,
  HelpCircle,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2
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
import html2pdf from "html2pdf.js";
import { JobMatchForm, ResumeReviewForm, SnapshotsForm } from "./OptimizationForms";

/* -------------------- Resize Observer Hook -------------------- */
const useResizeObserver = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useCallback((node) => {
    if (!node) return;
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, []);
  return { ...size, ref };
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
      leetcode: "",
      codechef: "",
      portfolio: "",
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
    primaryColor: "#000000",
    accentColor: "#ffe17c",
    fontFamily: "'Urbanist', sans-serif",
    layout: "modern",
  });

  const { ref: previewContainerRef, width: previewWidth } = useResizeObserver();
  const [currentPage, setCurrentPage] = useState("profile-info");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Zoom and Fullscreen states
  const [zoomMode, setZoomMode] = useState("fit");
  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);

  // Embedded AI assistant states
  const [activeInlineAI, setActiveInlineAI] = useState({
    section: null, // "summary" | "experience" | "project" | "skills"
    index: null,   // index of list item
    loading: false,
    suggestion: null,
    selectedSkills: []
  });

  /* -------------------- Load Existing Resume -------------------- */
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/api/resume/${resumeId}`);
        if (res.data) {
          setResumeData(res.data);
          if (res.data.template) {
            setThemeConfig({
              primaryColor: res.data.template.primaryColor || "#000000",
              accentColor: res.data.template.accentColor || "#ffe17c",
              fontFamily: res.data.template.fontFamily || "'Urbanist', sans-serif",
              layout: res.data.template.layout || "modern",
            });
          }
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

  /* -------------------- Save -------------------- */
  const handleSave = async (showToast = true) => {
    try {
      const payload = {
        ...resumeData,
        template: {
          theme: resumeData.template?.theme || "01",
          ...themeConfig
        }
      };
      await axiosInstance.put(`/api/resume/${resumeId}`, payload);
      if (showToast) toast.success("✅ Saved!");
    } catch (error) {
      console.error(error);
      if (showToast) toast.error("Failed to save");
    }
  };

  /* -------------------- Duplication for Sub-forms Lists -------------------- */
  const addArrayItem = (section, defaultObj) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), defaultObj],
    }));
  };

  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const array = prev[section] || [];
      if (array.length <= 1) {
        toast.error("You must keep at least one entry!");
        return prev;
      }
      return {
        ...prev,
        [section]: array.filter((_, i) => i !== index),
      };
    });
  };

  /* -------------------- Embedded AI Assistant Helpers -------------------- */
  const toggleSkillSelect = (skillName) => {
    setActiveInlineAI(prev => {
      const exists = prev.selectedSkills.includes(skillName);
      const updated = exists
        ? prev.selectedSkills.filter(s => s !== skillName)
        : [...prev.selectedSkills, skillName];
      return { ...prev, selectedSkills: updated };
    });
  };

  const triggerInlineAI = async (section, index = null, currentValue = "", extraContext = {}) => {
    setActiveInlineAI({
      section,
      index,
      loading: true,
      suggestion: null,
      selectedSkills: []
    });

    try {
      let promptText = "";
      let taskType = "resume_summary";

      if (section === "summary") {
        taskType = "resume_summary";
        promptText = `Create a professional resume summary for a candidate named ${resumeData.profileInfo?.fullName || "Candidate"} with designation "${resumeData.profileInfo?.designation || ""}". achievements/skills context: "${currentValue || resumeData.skills.map(s => s.name).join(", ")}"`;
      } else if (section === "experience") {
        taskType = "experience_rewrite";
        promptText = `Optimize this resume work experience description / bullet point to be data-driven and high-impact: "${currentValue}". Role: "${extraContext.role || ""}", Company: "${extraContext.company || ""}".`;
      } else if (section === "project") {
        taskType = "project_description";
        promptText = `Generate a data-driven, professional description for a project titled "${extraContext.title || ""}". Technologies used: "${extraContext.technologies || ""}". Current description: "${currentValue}".`;
      } else if (section === "skills") {
        taskType = "skill_suggestions";
        promptText = `Suggest top 8 technical skills and ATS keywords for a resume with designation: "${resumeData.profileInfo?.designation || ""}". Work Experience: "${resumeData.workExperience.map(exp => exp.role + " at " + exp.company).join(", ")}".`;
      }

      const payload = {
        prompt: promptText,
        name: resumeData?.profileInfo?.fullName || "Candidate",
        role: resumeData?.profileInfo?.designation || "Candidate",
        skills: resumeData.skills.map((s) => s.name).filter(Boolean),
        experience: resumeData.workExperience.map((exp) => exp.description),
        task: taskType
      };

      const res = await axiosInstance.post("/api/ai/generate", payload);
      if (res.data?.success && res.data.aiResume) {
        const aiData = res.data.aiResume;
        
        if (section === "skills" && Array.isArray(aiData.skills)) {
          setActiveInlineAI({
            section,
            index,
            loading: false,
            suggestion: aiData.skills,
            selectedSkills: aiData.skills
          });
          toast.success("✨ AI suggested skills ready!");
          return;
        }

        let suggestionText = "";
        if (section === "summary") {
          if (aiData.summary) {
            suggestionText = aiData.summary;
          } else if (aiData.raw) {
            suggestionText = aiData.raw;
          } else {
            suggestionText = typeof aiData === "string" ? aiData : JSON.stringify(aiData);
          }
        } else if (section === "experience") {
          if (aiData.experience && Array.isArray(aiData.experience) && aiData.experience.length > 0) {
            const firstExp = aiData.experience[0];
            if (Array.isArray(firstExp.details)) {
              suggestionText = firstExp.details.join("\n");
            } else if (firstExp.details) {
              suggestionText = firstExp.details;
            } else if (firstExp.description) {
              suggestionText = firstExp.description;
            } else {
              suggestionText = typeof firstExp === "string" ? firstExp : JSON.stringify(firstExp);
            }
          } else if (aiData.experience && typeof aiData.experience === "string") {
            suggestionText = aiData.experience;
          } else if (aiData.raw) {
            suggestionText = aiData.raw;
          } else if (aiData.description) {
            suggestionText = aiData.description;
          } else {
            suggestionText = typeof aiData === "string" ? aiData : JSON.stringify(aiData);
          }
        } else if (section === "project") {
          if (aiData.projects && Array.isArray(aiData.projects) && aiData.projects.length > 0) {
            const firstProj = aiData.projects[0];
            if (firstProj.description) {
              suggestionText = firstProj.description;
            } else if (Array.isArray(firstProj.details)) {
              suggestionText = firstProj.details.join("\n");
            } else {
              suggestionText = typeof firstProj === "string" ? firstProj : JSON.stringify(firstProj);
            }
          } else if (aiData.projects && typeof aiData.projects === "string") {
            suggestionText = aiData.projects;
          } else if (aiData.raw) {
            suggestionText = aiData.raw;
          } else if (aiData.description) {
            suggestionText = aiData.description;
          } else {
            suggestionText = typeof aiData === "string" ? aiData : JSON.stringify(aiData);
          }
        } else {
          suggestionText = typeof aiData === "string" ? aiData : JSON.stringify(aiData);
        }

        setActiveInlineAI({
          section,
          index,
          loading: false,
          suggestion: suggestionText,
          selectedSkills: []
        });
        toast.success("✨ AI suggestion ready!");
      } else {
        throw new Error("AI failed to return valid content");
      }
    } catch (err) {
      console.error(err);
      toast.error("AI assistant failed. Please try again.");
      setActiveInlineAI(prev => ({ ...prev, loading: false }));
    }
  };

  const acceptInlineAI = () => {
    const { section, index, suggestion, selectedSkills } = activeInlineAI;

    if (section === "summary") {
      setResumeData(prev => ({
        ...prev,
        profileInfo: { ...prev.profileInfo, summary: suggestion }
      }));
      toast.success("Summary applied!");
    } else if (section === "experience") {
      const updated = [...resumeData.workExperience];
      updated[index].description = suggestion;
      setResumeData(prev => ({ ...prev, workExperience: updated }));
      toast.success("Experience updated!");
    } else if (section === "project") {
      const updated = [...resumeData.projects];
      updated[index].description = suggestion;
      setResumeData(prev => ({ ...prev, projects: updated }));
      toast.success("Project description updated!");
    } else if (section === "skills") {
      const existingSkillNames = new Set(resumeData.skills.map(s => s.name.toLowerCase()));
      const newSkills = selectedSkills
        .filter(skillName => !existingSkillNames.has(skillName.toLowerCase()))
        .map(skillName => ({ name: skillName, progress: 80 }));

      if (newSkills.length > 0) {
        setResumeData(prev => ({
          ...prev,
          skills: [...prev.skills, ...newSkills]
        }));
        toast.success(`Added ${newSkills.length} new skills!`);
      } else {
        toast.error("No new skills were added (already exist).");
      }
    }

    // Trigger save and reset state
    setTimeout(() => {
      handleSave(false);
    }, 100);
    
    setActiveInlineAI({ section: null, index: null, loading: false, suggestion: null, selectedSkills: [] });
  };

  const regenerateInlineAI = () => {
    const { section, index } = activeInlineAI;
    let currentValue = "";
    let extraContext = {};

    if (section === "summary") {
      currentValue = resumeData.profileInfo?.summary || "";
    } else if (section === "experience") {
      currentValue = resumeData.workExperience[index]?.description || "";
      extraContext = {
        role: resumeData.workExperience[index]?.role || "",
        company: resumeData.workExperience[index]?.company || ""
      };
    } else if (section === "project") {
      currentValue = resumeData.projects[index]?.description || "";
      extraContext = {
        title: resumeData.projects[index]?.title || "",
        technologies: ""
      };
    } else if (section === "skills") {
      currentValue = "";
    }

    triggerInlineAI(section, index, currentValue, extraContext);
  };

  const cancelInlineAI = () => {
    setActiveInlineAI({ section: null, index: null, loading: false, suggestion: null, selectedSkills: [] });
  };

  const applyOptimizationAction = (action) => {
    if (!action || !action.type || !action.payload) return;
    const { type, payload } = action;

    setResumeData((prev) => {
      const updated = { ...prev };

      if (type === "add_skill") {
        const name = payload.name;
        const exists = (updated.skills || []).some(s => s.name?.toLowerCase() === name.toLowerCase());
        if (!exists) {
          updated.skills = [...(updated.skills || []), payload];
          toast.success(`Skill '${name}' added!`);
        } else {
          toast.error(`Skill '${name}' already exists.`);
        }
      } else if (type === "append_experience_bullet") {
        const { index, text } = payload;
        const experience = [...(updated.workExperience || [])];
        if (experience[index]) {
          const currentDesc = experience[index].description || "";
          experience[index].description = currentDesc ? `${currentDesc}\n${text}` : text;
          updated.workExperience = experience;
          toast.success("Applied suggestion to experience!");
        } else {
          toast.error("Experience entry not found");
        }
      } else if (type === "update_summary") {
        updated.profileInfo = { ...(updated.profileInfo || {}), summary: payload };
        toast.success("Summary updated!");
      } else if (type === "update_project_description") {
        const { index, value } = payload;
        const projects = [...(updated.projects || [])];
        if (projects[index]) {
          projects[index].description = value;
          updated.projects = projects;
          toast.success("Applied suggestion to project description!");
        } else {
          toast.error("Project entry not found");
        }
      }

      setTimeout(() => {
        handleSave(false);
      }, 150);

      return updated;
    });
  };

  /* -------------------- Score System -------------------- */
  const calculateScore = () => {
    let score = 20; // base score
    const checklist = {
      profile: false,
      contact: false,
      experience: false,
      education: false,
      skills: false,
      projects: false,
    };

    if (resumeData.profileInfo?.fullName && resumeData.profileInfo?.summary) {
      score += 15;
      checklist.profile = true;
    }
    if (resumeData.contactInfo?.email && resumeData.contactInfo?.phone) {
      score += 15;
      checklist.contact = true;
    }
    if (resumeData.workExperience?.length > 0 && resumeData.workExperience[0]?.company) {
      score += 20;
      checklist.experience = true;
    }
    if (resumeData.education?.length > 0 && resumeData.education[0]?.institution) {
      score += 10;
      checklist.education = true;
    }
    if (resumeData.skills?.length >= 2 && resumeData.skills[0]?.name) {
      score += 10;
      checklist.skills = true;
    }
    if (resumeData.projects?.length > 0 && resumeData.projects[0]?.title) {
      score += 10;
      checklist.projects = true;
    }

    return { score, checklist };
  };

  const { score, checklist } = calculateScore();

  // Zoom mode scale calculation
  let calculatedScale = 1;
  if (zoomMode === "50") {
    calculatedScale = 0.5;
  } else if (zoomMode === "75") {
    calculatedScale = 0.75;
  } else if (zoomMode === "100") {
    calculatedScale = 1.0;
  } else if (zoomMode === "fit") {
    calculatedScale = previewWidth ? Math.max(0.3, (previewWidth - 24) / 800) : 1;
  }

  /* -------------------- PDF Exporter -------------------- */
  const handleDownload = () => {
    setIsDownloading(true);
    toast.loading("Exporting PDF...");
    const element = document.getElementById("resume-preview-pdf");
    
    const opt = {
      margin: 0,
      filename: `${resumeData.title || "resume"}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .then(() => {
        toast.dismiss();
        toast.success("PDF exported successfully!");
      })
      .catch((err) => {
        console.error(err);
        toast.dismiss();
        toast.error("Export failed");
      })
      .finally(() => setIsDownloading(false));
  };

  /* -------------------- Navigation Mappings -------------------- */
  const sidebarLinks = [
    { id: "profile-info", label: "Personal Info", icon: <User size={14} /> },
    { id: "contact-info", label: "Contact Details", icon: <Mail size={14} /> },
    { id: "work-experience", label: "Work Experience", icon: <Briefcase size={14} /> },
    { id: "education-info", label: "Education Details", icon: <GraduationCap size={14} /> },
    { id: "skills", label: "Skills Matrix", icon: <Hammer size={14} /> },
    { id: "projects", label: "Key Projects", icon: <FolderGit size={14} /> },
    { id: "certifications", label: "Certifications", icon: <Award size={14} /> },
    { id: "additionalInfo", label: "Languages & Interests", icon: <Globe size={14} /> },
    { id: "job-match", label: "Job Match", icon: <Sparkles size={14} /> },
    { id: "resume-review", label: "Resume Review", icon: <Check size={14} /> },
    { id: "versions", label: "Snapshots & Diffs", icon: <Save size={14} /> }
  ];

  return (
    <div className="min-h-screen bg-[#fcfbfc] text-black flex flex-col relative font-sans selection:bg-[#ffe17c]">
      
      {/* TOP EDITOR TOOLBAR (Yellow banner sticky) */}
      <header className="sticky top-0 z-30 bg-[#ffe17c] border-b-3 border-black p-4 flex justify-between items-center text-black shadow-sm flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-1.5 border border-black bg-white hover:bg-slate-50 text-black shadow-[2px_2px_0px_#000]"
          >
            <ArrowLeft size={16} />
          </button>
          <TitleInput
            title={resumeData.title}
            setTitle={(v) => {
              setResumeData((prev) => ({ ...prev, title: v }));
              handleSave(false);
            }}
          />
          <span className="text-[10px] font-black uppercase tracking-wider bg-white border border-black px-2 py-0.5 shadow-[1px_1px_0px_#000]">
            Auto-saved (local)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenPreviewModal(true)}
            className="neo-btn-push bg-[#b7c6c2] text-black px-4 py-2 text-xs font-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
          >
            <Eye size={14} className="inline mr-1" /> Full Preview
          </button>
          <button
            onClick={handleDownload}
            className="neo-btn-push bg-[#171e19] text-white px-4 py-2 text-xs font-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
          >
            <Download size={14} className="inline mr-1" /> Download
          </button>
          <button
            onClick={() => setOpenThemeSelector(true)}
            className="neo-btn-push bg-[#ffe17c] text-black border-2 border-black px-3 py-2 text-xs font-black"
          >
            <Palette size={14} />
          </button>
        </div>
      </header>

      {/* THREE-COLUMN WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 h-[calc(100vh-76px)] overflow-hidden bg-slate-50">
        
        {/* COLUMN 1: LEFT SIDEBAR NAVIGATION & SCORE WIDGET */}
        <aside className="w-full lg:w-52 flex-shrink-0 flex flex-col justify-between bg-[#171e19] border-2 border-black p-4 text-white overflow-y-auto custom-scrollbar h-full shadow-[4px_4px_0px_#000]">
          <div className="space-y-4">
            <h3 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-700 pb-1.5">
              Form Sections
            </h3>

            {/* Nav list */}
            <nav className="flex flex-col gap-2">
              {sidebarLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setCurrentPage(link.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 border-2 border-black text-left font-black uppercase text-xs tracking-wider shadow-[2px_2px_0px_#000] transition-all cursor-pointer ${
                    currentPage === link.id
                      ? "bg-[#ffe17c] text-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000]"
                      : "bg-white text-black hover:bg-[#ffe17c] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000]"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Sticky scorecard at bottom of sidebar */}
          <div className="bg-[#ffe17c] text-black border-2 border-black p-3 shadow-[2px_2px_0px_#000] mt-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider">Resume Score</span>
              <span className="text-sm font-black">{score}/100</span>
            </div>
            
            <div className="w-full h-2 bg-white border border-black rounded-none overflow-hidden mb-3">
              <div
                className="h-full bg-black"
                style={{ width: `${score}%` }}
              ></div>
            </div>

            {/* Checklist items */}
            <div className="space-y-1 text-[9px] font-black uppercase text-slate-700">
              <div className="flex items-center gap-1.5">
                <span>{checklist.profile ? "✓" : "⚠"}</span>
                <span>Summary & Intro</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>{checklist.contact ? "✓" : "⚠"}</span>
                <span>Contact Details</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>{checklist.experience ? "✓" : "⚠"}</span>
                <span>Experience Entries</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>{checklist.skills ? "✓" : "⚠"}</span>
                <span>Skills matrix</span>
              </div>
            </div>
          </div>
        </aside>

        {/* COLUMN 2: CENTER FORM EDITOR */}
        <main className="flex-1 min-w-[380px] bg-white border-2 border-black flex flex-col h-full overflow-hidden shadow-[6px_6px_0px_#000]">
          <div className="flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar text-black">
            
            {/* Display correct form based on currentPage state */}
            {(() => {
              switch (currentPage) {
                case "profile-info":
                  return (
                    <ProfileInfoForm
                      profileData={resumeData.profileInfo}
                      updateSection={(k, v) => {
                        setResumeData((prev) => ({
                          ...prev,
                          profileInfo: { ...prev.profileInfo, [k]: v },
                        }));
                        handleSave(false);
                      }}
                      activeInlineAI={activeInlineAI}
                      triggerInlineAI={triggerInlineAI}
                      acceptInlineAI={acceptInlineAI}
                      regenerateInlineAI={regenerateInlineAI}
                      cancelInlineAI={cancelInlineAI}
                    />
                  );
                case "contact-info":
                  return (
                    <ContactInfoForm
                      contactInfo={resumeData.contactInfo}
                      updateSection={(k, v) => {
                        setResumeData((prev) => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, [k]: v },
                        }));
                        handleSave(false);
                      }}
                    />
                  );
                case "work-experience":
                  return (
                    <WorkExperienceForm
                      workExperience={resumeData.workExperience}
                      updateArrayItem={(i, k, v) => {
                        const updated = [...resumeData.workExperience];
                        updated[i][k] = v;
                        setResumeData((prev) => ({
                          ...prev,
                          workExperience: updated,
                        }));
                        handleSave(false);
                      }}
                      addArrayItem={() =>
                        addArrayItem("workExperience", {
                          company: "",
                          role: "",
                          startDate: "",
                          endDate: "",
                          description: "",
                        })
                      }
                      removeArrayItem={(i) => removeArrayItem("workExperience", i)}
                      activeInlineAI={activeInlineAI}
                      triggerInlineAI={triggerInlineAI}
                      acceptInlineAI={acceptInlineAI}
                      regenerateInlineAI={regenerateInlineAI}
                      cancelInlineAI={cancelInlineAI}
                    />
                  );
                case "education-info":
                  return (
                    <EducationDetailsForm
                      educationInfo={resumeData.education}
                      updateArrayItem={(i, k, v) => {
                        const updated = [...resumeData.education];
                        updated[i][k] = v;
                        setResumeData((prev) => ({
                          ...prev,
                          education: updated,
                        }));
                        handleSave(false);
                      }}
                      addArrayItem={() =>
                        addArrayItem("education", {
                          degree: "",
                          institution: "",
                          startDate: "",
                          endDate: "",
                        })
                      }
                      removeArrayItem={(i) => removeArrayItem("education", i)}
                    />
                  );
                case "skills":
                  return (
                    <SkillsInfoForm
                      skillsInfo={resumeData.skills}
                      updateArrayItem={(i, k, v) => {
                        const updated = [...resumeData.skills];
                        updated[i][k] = v;
                        setResumeData((prev) => ({
                          ...prev,
                          skills: updated,
                        }));
                        handleSave(false);
                      }}
                      addArrayItem={() => addArrayItem("skills", { name: "", progress: 0 })}
                      removeArrayItem={(i) => removeArrayItem("skills", i)}
                      activeInlineAI={activeInlineAI}
                      triggerInlineAI={triggerInlineAI}
                      acceptInlineAI={acceptInlineAI}
                      regenerateInlineAI={regenerateInlineAI}
                      cancelInlineAI={cancelInlineAI}
                      toggleSkillSelect={toggleSkillSelect}
                    />
                  );
                case "projects":
                  return (
                    <ProjectDetailForm
                      projectInfo={resumeData.projects}
                      updateArrayItem={(i, k, v) => {
                        const updated = [...resumeData.projects];
                        updated[i][k] = v;
                        setResumeData((prev) => ({
                          ...prev,
                          projects: updated,
                        }));
                        handleSave(false);
                      }}
                      addArrayItem={() =>
                        addArrayItem("projects", {
                          title: "",
                          description: "",
                          github: "",
                          liveDemo: "",
                        })
                      }
                      removeArrayItem={(i) => removeArrayItem("projects", i)}
                      activeInlineAI={activeInlineAI}
                      triggerInlineAI={triggerInlineAI}
                      acceptInlineAI={acceptInlineAI}
                      regenerateInlineAI={regenerateInlineAI}
                      cancelInlineAI={cancelInlineAI}
                    />
                  );
                case "certifications":
                  return (
                    <CertificationInfoForm
                      certifications={resumeData.certifications}
                      updateArrayItem={(i, k, v) => {
                        const updated = [...resumeData.certifications];
                        updated[i][k] = v;
                        setResumeData((prev) => ({
                          ...prev,
                          certifications: updated,
                        }));
                        handleSave(false);
                      }}
                      addArrayItem={() =>
                        addArrayItem("certifications", {
                          title: "",
                          issuer: "",
                          year: "",
                        })
                      }
                      removeArrayItem={(i) => removeArrayItem("certifications", i)}
                    />
                  );
                case "additionalInfo":
                  return (
                    <AdditionalInfoForm
                      languages={resumeData.languages}
                      interests={resumeData.interests}
                      updateArrayItem={(s, i, k, v) => {
                        const updated = [...resumeData[s]];
                        if (k === null) {
                          updated[i] = v;
                        } else {
                          updated[i][k] = v;
                        }
                        setResumeData((prev) => ({ ...prev, [s]: updated }));
                        handleSave(false);
                      }}
                      addArrayItem={(s, item) => addArrayItem(s, item)}
                      removeArrayItem={(s, i) => removeArrayItem(s, i)}
                    />
                  );
                case "job-match":
                  return (
                    <JobMatchForm
                      resumeId={resumeId}
                      onApplyAction={applyOptimizationAction}
                    />
                  );
                case "resume-review":
                  return (
                    <ResumeReviewForm
                      resumeId={resumeId}
                      onApplyAction={applyOptimizationAction}
                    />
                  );
                case "versions":
                  return (
                    <SnapshotsForm
                      resumeId={resumeId}
                      resumeData={resumeData}
                      themeConfig={themeConfig}
                      onRestoreResume={(restored) => {
                        setResumeData(restored);
                        if (restored.template) {
                          setThemeConfig({
                            primaryColor: restored.template.primaryColor || "#000000",
                            accentColor: restored.template.accentColor || "#ffe17c",
                            fontFamily: restored.template.fontFamily || "'Urbanist', sans-serif",
                            layout: restored.template.layout || "modern",
                          });
                        }
                      }}
                    />
                  );
                default:
                  return null;
              }
            })()}
          </div>

          {/* Navigation Controls footer */}
          <div className="p-4 border-t-2 border-black flex justify-between bg-[#ffe17c]/5">
            <button
              onClick={() => {
                const idx = sidebarLinks.findIndex((x) => x.id === currentPage);
                if (idx > 0) setCurrentPage(sidebarLinks[idx - 1].id);
              }}
              disabled={currentPage === "profile-info"}
              className="px-4 py-2 border-2 border-black bg-white text-black font-extrabold text-xs uppercase shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => {
                const idx = sidebarLinks.findIndex((x) => x.id === currentPage);
                if (idx < sidebarLinks.length - 1) setCurrentPage(sidebarLinks[idx + 1].id);
              }}
              className="px-4 py-2 border-2 border-black bg-[#ffe17c] text-black font-extrabold text-xs uppercase shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000]"
            >
              Next
            </button>
          </div>
        </main>

        {/* COLUMN 3: RIGHT LIVE PREVIEW PANEL */}
        <section className="w-full lg:w-[43%] flex-shrink-0 min-w-[380px] bg-white border-2 border-black flex flex-col h-full overflow-hidden shadow-[6px_6px_0px_#000] p-4">
          <div className="flex justify-between items-center mb-3 pb-3 border-b-2 border-black">
            <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              Live Preview
            </span>
            <div className="flex items-center gap-1 bg-white border border-black p-0.5 shadow-[2px_2px_0px_#000]">
              {["50", "75", "100", "fit"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setZoomMode(mode)}
                  className={`px-2 py-0.5 text-[10px] font-black uppercase border border-transparent cursor-pointer transition-all ${
                    zoomMode === mode ? "bg-[#ffe17c] text-black border-black" : "text-slate-600 hover:text-black"
                  }`}
                >
                  {mode === "fit" ? "Fit" : `${mode}%`}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-auto custom-scrollbar bg-slate-100 border-2 border-black p-3 relative flex justify-center items-start">
            <div 
              ref={previewContainerRef}
              style={{
                width: `${800 * calculatedScale}px`,
                height: `${1131 * calculatedScale}px`,
                position: "relative",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                transition: "width 0.15s ease-out, height 0.15s ease-out"
              }}
            >
              <div
                style={{
                  transform: `scale(${calculatedScale})`,
                  transformOrigin: "top left",
                  width: "800px",
                  height: "1131px",
                  position: "absolute",
                  left: 0,
                  top: 0
                }}
              >
                <RenderResume
                  key={`preview-${resumeData.template?.theme}-${themeConfig.primaryColor}`}
                  templateId={resumeData.template?.theme || "01"}
                  resumeData={resumeData}
                  containerWidth={800}
                  themeConfig={themeConfig}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Removed Drawer */}

      {/* THEME SELECTION MODAL */}
      <Modal
        isOpen={openThemeSelector}
        onClose={() => setOpenThemeSelector(false)}
        title="Template Configuration"
        containerClass="relative flex flex-col bg-white border-3 border-black rounded-none overflow-hidden w-[85vw] h-[85vh] shadow-[12px_12px_0px_#000]"
        bodyClass="flex-1 flex flex-col min-h-0 overflow-hidden"
      >
        <div className="flex-1 flex flex-col min-h-0 text-black">
          <ThemeSelector
            selectedTheme={resumeData.template?.theme || "01"}
            setSelectedTheme={(theme) => {
              setResumeData((prev) => {
                const updated = {
                  ...prev,
                  template: {
                    ...prev.template,
                    theme,
                    primaryColor: themeConfig.primaryColor,
                    accentColor: themeConfig.accentColor,
                    fontFamily: themeConfig.fontFamily,
                    layout: themeConfig.layout,
                  }
                };
                
                // Immediately save the updated state
                const savePayload = {
                  ...updated,
                  template: {
                    theme,
                    primaryColor: themeConfig.primaryColor,
                    accentColor: themeConfig.accentColor,
                    fontFamily: themeConfig.fontFamily,
                    layout: themeConfig.layout,
                  }
                };
                
                axiosInstance.put(`/api/resume/${resumeId}`, savePayload)
                  .then(() => {
                    toast.success("🎨 Theme applied successfully!");
                  })
                  .catch((err) => {
                    console.error(err);
                    toast.error("Failed to save theme choice.");
                  });
                
                return updated;
              });
            }}
            resumeData={resumeData}
            themeConfig={themeConfig}
            setThemeConfig={setThemeConfig}
            onClose={() => setOpenThemeSelector(false)}
          />
        </div>
      </Modal>

      {/* FULL RESUME PREVIEW MODAL */}
      <Modal
        isOpen={openPreviewModal}
        onClose={() => setOpenPreviewModal(false)}
        title="Resume Preview"
        containerClass="relative flex flex-col bg-white border-3 border-black rounded-none overflow-hidden w-[95vw] h-[95vh] shadow-[12px_12px_0px_#000]"
        bodyClass="flex-1 flex flex-col min-h-0 overflow-hidden"
      >
        <div className="p-5 flex-1 flex flex-col items-center bg-slate-100 overflow-y-auto custom-scrollbar">
          <div id="resume-preview-modal-container" className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_#000] w-[800px] min-h-[1131px] aspect-[1/1.414]">
            <RenderResume
              templateId={resumeData.template?.theme || "01"}
              resumeData={resumeData}
              containerWidth={800}
              themeConfig={themeConfig}
            />
          </div>
          <button
            onClick={handleDownload}
            className="mt-6 flex-shrink-0 neo-btn-push bg-[#ffe17c] text-black px-6 py-3 text-xs shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
          >
            Download PDF
          </button>
        </div>
      </Modal>

      {/* HIDDEN PREVIEW ELEMENT FOR PDF GENERATION */}
      <div className="absolute left-[-9999px] top-[-9999px] pointer-events-none">
        <div id="resume-preview-pdf" style={{ width: "800px" }} className="bg-white text-black p-8">
          <RenderResume
            templateId={resumeData.template?.theme || "01"}
            resumeData={resumeData}
            containerWidth={800}
            themeConfig={themeConfig}
          />
        </div>
      </div>

    </div>
  );
};

export default EditResume;
