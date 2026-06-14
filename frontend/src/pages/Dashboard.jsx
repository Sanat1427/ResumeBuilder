import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  LucideFilePlus,
  LucideTrash2,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  Copy,
  Download,
  Brain,
  Upload,
  Sparkles,
  LayoutTemplate,
  Settings,
  User,
  ShieldCheck,
  Menu,
  X,
  Star,
  Zap,
  Volume2
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { ResumeSummaryCard, ProfileInfoCard } from "../components/Cards";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import Modal from "../components/Modal";
import CreateResumeForm from "../components/CreateResumeForm";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../context/UserContext";
import html2pdf from "html2pdf.js";
import RenderResume from "../components/RenderResume";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allResumes, setAllResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Advanced features modals
  const [openImportModal, setOpenImportModal] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [importFile, setImportFile] = useState(null);
  const [importConfidence, setImportConfidence] = useState(null);
  const [importData, setImportData] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("resumes");
  const [analyticsData, setAnalyticsData] = useState(null);
  
  // ATS & AI Assistant modals
  const [openAnalyzeModal, setOpenAnalyzeModal] = useState(false);
  const [selectedResumeToAnalyze, setSelectedResumeToAnalyze] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzingLoading, setAnalyzingLoading] = useState(false);

  // General Settings Modal
  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  // Hidden preview for PDF downloading
  const [downloadingResume, setDownloadingResume] = useState(null);

  // Mobile sidebar state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch placement analytics
  const fetchPlacementAnalytics = async () => {
    try {
      const res = await axiosInstance.get("/api/ai/user-analytics");
      if (res.data && res.data.success) {
        setAnalyticsData(res.data.analytics);
      }
    } catch (err) {
      console.warn("Failed to load analytics: ", err.message);
    }
  };

  useEffect(() => {
    fetchPlacementAnalytics();
  }, [allResumes]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!importFile) return toast.error("Please select a file to upload.");
    
    const formData = new FormData();
    formData.append("resumeFile", importFile);
    
    setImportLoading(true);
    setImportData(null);
    setImportConfidence(null);
    toast.loading("AI is parsing resume text details...");
    
    try {
      const res = await axiosInstance.post("/api/ai/import", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.dismiss();
      if (res.data && res.data.success) {
        setImportData(res.data.parsedData);
        setImportConfidence(res.data.confidenceScores);
        toast.success("Resume parsed successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error(err.response?.data?.message || "Parsing failed. Please verify format.");
    } finally {
      setImportLoading(false);
    }
  };

  const handleSaveImportedResume = async () => {
    if (!importData) return;
    toast.loading("Creating resume...");
    try {
      const payload = {
        title: importData.title || "Imported Resume",
        profileInfo: importData.profileInfo,
        contactInfo: {
          ...importData.contactInfo,
          leetcode: importData.contactInfo?.leetcode || "",
          codechef: importData.contactInfo?.codechef || "",
          portfolio: importData.contactInfo?.portfolio || importData.contactInfo?.website || "",
          website: importData.contactInfo?.portfolio || importData.contactInfo?.website || ""
        },
        workExperience: importData.workExperience,
        education: importData.education,
        skills: importData.skills,
        projects: importData.projects,
        certifications: importData.certifications,
        languages: importData.languages,
        interests: importData.interests
      };
      
      const res = await axiosInstance.post(API_PATHS.RESUME.CREATE, payload);
      if (res.data?._id) {
        toast.dismiss();
        toast.success("✅ Resume imported successfully!");
        setOpenImportModal(false);
        setImportData(null);
        setImportConfidence(null);
        setImportFile(null);
        navigate(`/resume/${res.data._id}`);
      }
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Failed to save imported resume.");
    }
  };

  const renderAnalyticsDashboard = () => {
    const stats = analyticsData || {
      totalResumes: allResumes.length,
      jdMatchesCount: 0,
      aiReviewsCount: 0,
      suggestionsApplied: 0,
      scoreTrend: [],
      templateCounts: {}
    };

    const readinessPercent = Math.min(100, Math.round((stats.suggestionsApplied * 15) + (stats.jdMatchesCount * 10) + (avgAtsScore * 0.5)));

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-black uppercase tracking-tight border-b-2 border-black pb-2">
          📈 Placement Readiness Analytics
        </h2>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1">Total Resumes</span>
            <span className="text-2xl font-black text-black">{stats.totalResumes}</span>
          </div>
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1">Suggestions Used</span>
            <span className="text-2xl font-black text-black">{stats.suggestionsApplied}</span>
          </div>
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1">JD Scans Run</span>
            <span className="text-2xl font-black text-black">{stats.jdMatchesCount}</span>
          </div>
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1">AI Audits Run</span>
            <span className="text-2xl font-black text-black">{stats.aiReviewsCount}</span>
          </div>
        </div>

        {/* Readiness Metric */}
        <div className="border-2 border-black p-5 bg-white shadow-[6px_6px_0px_#000] space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black uppercase">Application Readiness Index</h3>
              <p className="text-[10px] text-slate-500 font-bold mt-0.5">Based on score improvement and target JD matches</p>
            </div>
            <span className="text-lg font-black text-[#171e19]">{readinessPercent}%</span>
          </div>
          <div className="w-full h-4 bg-slate-100 border-2 border-black rounded-none overflow-hidden">
            <div className="h-full bg-[#ffe17c]" style={{ width: `${readinessPercent}%` }}></div>
          </div>
          <p className="text-[10px] font-bold text-slate-700 italic">
            {readinessPercent < 50 
              ? "⚠ Resume scores are currently low. Paste job descriptions and click 'Apply Suggestion' in the editor to boost keyword counts."
              : readinessPercent < 80
              ? "⚡ Good progress. Optimize experience descriptions to add more quantifiable achievements and industry keywords."
              : "🚀 Ready! Your resume has excellent ATS compatibility and keyword alignment. Download PDF and apply!"}
          </p>
        </div>

        {/* Graph & Templates list */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 border-2 border-black p-5 bg-white shadow-[6px_6px_0px_#000] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">ATS Score Improvement over Time</h3>
            
            {stats.scoreTrend?.length > 0 ? (
              <div className="relative pt-4">
                <svg viewBox="0 0 500 200" className="w-full h-48 overflow-visible">
                  <line x1="0" y1="20" x2="500" y2="20" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="180" x2="500" y2="180" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                  
                  <text x="5" y="15" fill="#94a3b8" fontSize="8" fontWeight="bold">100</text>
                  <text x="5" y="95" fill="#94a3b8" fontSize="8" fontWeight="bold">50</text>
                  <text x="5" y="175" fill="#94a3b8" fontSize="8" fontWeight="bold">0</text>

                  {(() => {
                    const points = stats.scoreTrend.map((log, index) => {
                      const x = stats.scoreTrend.length > 1 ? (index / (stats.scoreTrend.length - 1)) * 430 + 35 : 250;
                      const y = 180 - (log.score / 100) * 160;
                      return { x, y, score: log.score, title: log.resumeTitle };
                    });

                    const pathData = points.reduce((acc, p, i) => {
                      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                    }, "");

                    return (
                      <>
                        {points.length > 1 && (
                          <path d={pathData} fill="none" stroke="black" strokeWidth="3" />
                        )}
                        {points.map((p, idx) => (
                          <g key={idx}>
                            <circle cx={p.x} cy={p.y} r="5" fill="#ffe17c" stroke="black" strokeWidth="2" />
                            <text x={p.x - 10} y={p.y - 10} fill="black" fontSize="8" fontWeight="black">
                              {p.score}%
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
                <div className="text-[8px] font-black uppercase text-center tracking-widest text-slate-400 mt-2">
                  Chronological Resume Scan Audits
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-450 italic py-12 text-center border border-dashed border-slate-300">
                Audit your resumes in the editor to populate improvement trends graphs.
              </p>
            )}
          </div>

          <div className="lg:col-span-4 border-2 border-black p-5 bg-white shadow-[6px_6px_0px_#000]">
            <h3 className="text-xs font-black uppercase tracking-wider mb-4">Templates Distribution</h3>
            <div className="space-y-3 text-[10px] font-bold text-slate-700">
              {Object.keys(stats.templateCounts).length > 0 ? (
                Object.entries(stats.templateCounts).map(([key, count]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between items-center capitalize">
                      <span>{key.replace(/-/g, " ")}</span>
                      <span>{count}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 border border-slate-350">
                      <div className="h-full bg-black" style={{ width: `${Math.min(100, (count / totalResumes) * 100)}%` }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic">No template metrics captured yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 🧮 Calculate completion %
  const calculateCompletion = (resume) => {
    if (!resume) return 0;
    let filled = 0;
    let total = 0;

    if (resume.profileInfo) {
      const pFields = ["fullName", "designation", "summary"];
      pFields.forEach(f => {
        total++;
        if (resume.profileInfo[f]) filled++;
      });
    }

    if (resume.contactInfo) {
      const cFields = ["email", "phone", "location"];
      cFields.forEach(f => {
        total++;
        if (resume.contactInfo[f]) filled++;
      });
    }

    const arrays = ["workExperience", "education", "skills", "projects", "certifications"];
    arrays.forEach(arr => {
      total++;
      if (Array.isArray(resume[arr]) && resume[arr].length > 0 && resume[arr][0] && Object.values(resume[arr][0]).some(Boolean)) {
        filled++;
      }
    });

    return total === 0 ? 0 : Math.round((filled / total) * 100);
  };

  // 🧾 Fetch resumes
  const fetchAllResumes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      const resumesWithCompletion = response.data.map((resume) => ({
        ...resume,
        completion: calculateCompletion(resume),
      }));
      setAllResumes(resumesWithCompletion);
      localStorage.setItem("cachedResumes", JSON.stringify(resumesWithCompletion));
    } catch (error) {
      console.warn("⚠️ Error fetching resumes, reading cache...");
      const cached = localStorage.getItem("cachedResumes");
      if (cached) {
        setAllResumes(JSON.parse(cached));
      } else {
        setAllResumes([]);
      }
      toast.error("Unable to load live resumes. Loaded from cache.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllResumes();
  }, []);

  // Calculate stats
  const totalResumes = allResumes.length;
  const draftResumes = allResumes.filter(r => r.completion < 80).length;
  const completedResumes = allResumes.filter(r => r.completion >= 80).length;
  const avgAtsScore = allResumes.length > 0 
    ? Math.round(allResumes.reduce((acc, r) => acc + Math.min(100, Math.round(r.completion * 0.9 + 10)), 0) / allResumes.length)
    : 0;

  // 🗑️ Delete resume
  const handleDeleteResume = async () => {
    if (!resumeToDelete) return;
    try {
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeToDelete));
      const updatedResumes = allResumes.filter(
        (resume) => resume._id !== resumeToDelete
      );
      setAllResumes(updatedResumes);
      localStorage.setItem("cachedResumes", JSON.stringify(updatedResumes));
      toast.success("Resume deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete resume");
    } finally {
      setResumeToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  // 📂 Duplicate Resume
  const handleDuplicateResume = async (resume) => {
    try {
      toast.loading("Duplicating your resume...");
      const duplicatePayload = {
        title: `${resume.title || "Untitled Resume"} (Copy)`,
        template: resume.template || { theme: "01" },
        profileInfo: resume.profileInfo,
        contactInfo: resume.contactInfo,
        workExperience: resume.workExperience,
        education: resume.education,
        skills: resume.skills,
        projects: resume.projects,
        certifications: resume.certifications,
        languages: resume.languages,
        interests: resume.interests,
      };

      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, duplicatePayload);
      if (response.data?._id) {
        toast.dismiss();
        toast.success("✅ Resume duplicated successfully!");
        fetchAllResumes();
      }
    } catch (error) {
      console.error("Duplication failed:", error);
      toast.dismiss();
      toast.error("Failed to duplicate resume");
    }
  };

  // 📥 Download Resume PDF directly
  const handleDownloadPDF = (resume) => {
    setDownloadingResume(resume);
    toast.loading("Compiling PDF download...");
    setTimeout(() => {
      const element = document.getElementById("hidden-resume-download");
      if (element) {
        html2pdf()
          .from(element)
          .save(`${resume.title || "resume"}.pdf`)
          .then(() => {
            toast.dismiss();
            toast.success("PDF exported successfully! 🎉");
            setDownloadingResume(null);
          })
          .catch((err) => {
            console.error(err);
            toast.dismiss();
            toast.error("PDF generation failed");
            setDownloadingResume(null);
          });
      } else {
        toast.dismiss();
        toast.error("Failed to find print container");
        setDownloadingResume(null);
      }
    }, 800);
  };

  // 📋 JSON Import
  const handleImportResume = async (e) => {
    e.preventDefault();
    try {
      if (!importJson.trim()) return toast.error("Please paste your resume JSON");
      const parsedData = JSON.parse(importJson);
      
      toast.loading("Importing resume data...");
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title: parsedData.title || "Imported Resume",
        ...parsedData
      });

      if (response.data?._id) {
        toast.dismiss();
        toast.success("✅ Resume imported successfully!");
        setOpenImportModal(false);
        setImportJson("");
        fetchAllResumes();
      }
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Invalid JSON format or network error");
    }
  };

  // 🧠 AI Analysis Request
  const handleAIAnalyze = async () => {
    if (!selectedResumeToAnalyze) return toast.error("Please select a resume to analyze");
    const resume = allResumes.find(r => r._id === selectedResumeToAnalyze);
    if (!resume) return;

    try {
      setAnalyzingLoading(true);
      setAnalysisResult(null);
      const res = await axiosInstance.post("/api/ai/analyze", { 
        resumeData: resume,
        task: "ats_analysis"
      });
      if (res.data?.success) {
        setAnalysisResult(res.data.analysis);
      } else {
        toast.error("Analysis failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("AI analysis request failed");
    } finally {
      setAnalyzingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbfc] text-black flex flex-col md:flex-row font-sans selection:bg-[#ffe17c]">
      
      {/* MOBILE HEADER BAR */}
      <div className="md:hidden bg-[#171e19] border-b-2 border-black p-4 flex justify-between items-center text-white relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#ffe17c] border border-black flex items-center justify-center">
            <LayoutTemplate className="w-4 h-4 text-black" />
          </div>
          <span className="font-black text-lg tracking-tight">ResumeRocket</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 border border-white bg-white text-black"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* LEFT SIDEBAR PANEL (Neo-Brutalist Dark) */}
      <aside className={`w-full md:w-64 bg-[#171e19] border-r-3 border-black p-5 flex flex-col justify-between text-white fixed md:sticky top-14 md:top-0 h-[calc(100vh-56px)] md:h-screen z-40 transition-transform duration-300 md:translate-x-0 ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="space-y-8">
          {/* Logo */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ffe17c] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000]">
              <LayoutTemplate className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black uppercase tracking-tight">
              Resume<span className="text-[#ffe17c]">Rocket</span>
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-2">
            {[
              { label: "Dashboard", icon: <LayoutTemplate size={16} />, active: activeTab === "resumes", action: () => { setActiveTab("resumes"); setMobileMenuOpen(false); } },
              { label: "Placement Stats", icon: <TrendingUp size={16} />, active: activeTab === "analytics", action: () => { setActiveTab("analytics"); setMobileMenuOpen(false); } },
              { label: "Import Resume", icon: <Upload size={16} />, active: false, action: () => { setOpenImportModal(true); setMobileMenuOpen(false); } },
              { label: "Settings", icon: <Settings size={16} />, active: false, action: () => { setOpenSettingsModal(true); setMobileMenuOpen(false); } }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-3 border-2 border-black text-left font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_#000] transition-all cursor-pointer ${
                  item.active 
                    ? "bg-[#ffe17c] text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]" 
                    : "bg-white text-black hover:bg-[#ffe17c] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Premium Upgrade Panel */}
        <div className="bg-[#b7c6c2] text-black border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
          <h4 className="font-black text-xs uppercase tracking-wider mb-1">Unlock AI Features</h4>
          <p className="text-[10px] font-bold text-slate-700 leading-tight mb-3">Get advanced ATS checkers and high impact bullet points.</p>
          <button
            onClick={() => toast("Premium payment system coming soon!")}
            className="w-full py-2 bg-[#ffe17c] text-black border-2 border-black font-black text-[10px] uppercase tracking-widest hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] shadow-[2px_2px_0px_#000]"
          >
            Upgrade Plan
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE AREA */}
      <main className="flex-1 p-6 space-y-8 overflow-y-auto max-h-screen">
        
        {/* DASHBOARD HEADER BANNER (Yellow Neo-Brutalist Panel) */}
        <div className="bg-[#ffe17c] text-black border-2 border-black p-6 shadow-[8px_8px_0px_#000] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">
              Welcome back, {user?.name || "User"}
            </h1>
            <p className="text-sm font-bold text-slate-800 mt-1 uppercase tracking-wide">
              Let's build a resume that gets you noticed.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setOpenCreateModal(true)}
              className="flex-1 md:flex-initial neo-btn-push bg-white text-black px-4 py-2 text-xs font-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
            >
              Create Resume
            </button>
            <ProfileInfoCard />
          </div>
        </div>

        {/* STATS CARDS GRID */}
        {!loading && allResumes.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Resumes", value: totalResumes, color: "bg-white" },
              { label: "Draft Resumes", value: draftResumes, color: "bg-white" },
              { label: "Completed CVs", value: completedResumes, color: "bg-white" },
              { label: "Avg ATS Score", value: `${avgAtsScore}/100`, color: "bg-white" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`${stat.color} text-black border-2 border-black p-4 shadow-[4px_4px_0px_#000] flex flex-col justify-between`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
                  {stat.label}
                </span>
                <span className="text-3xl font-black text-black block leading-none">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        )}
                   {/* PRIMARY LAYOUT CONTENT SPLIT */}
        {activeTab === "resumes" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT SIDE: Resume Cards List */}
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-xl font-black uppercase tracking-tight border-b-2 border-black pb-2 flex items-center gap-2">
                <FileText size={20} /> Active Resumes
              </h2>

              {loading && (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-none h-10 w-10 border-4 border-black border-t-[#ffe17c]"></div>
                </div>
              )}

              {!loading && allResumes.length === 0 && (
                <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_#000] text-center max-w-xl mx-auto py-12">
                  <div className="w-12 h-12 bg-[#ffe17c] border border-black flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_#000]">
                    <LucideFilePlus className="text-black" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-wider text-black">No resumes found</h3>
                  <p className="text-xs text-slate-650 font-bold mt-2 mb-6">
                    You haven't built any resumes yet. Start showcasing your credentials today!
                  </p>
                  <button
                    onClick={() => setOpenCreateModal(true)}
                    className="neo-btn-push bg-[#ffe17c] text-black px-6 py-2.5 text-xs shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
                  >
                    Create Resume
                  </button>
                </div>
              )}

              {!loading && allResumes.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {allResumes.map((resume) => (
                    <ResumeSummaryCard
                      key={resume._id}
                      title={resume.title || "Untitled Resume"}
                      createdAt={dayjs(resume.createdAt).toISOString()}
                      updatedAt={dayjs(resume.updatedAt).toISOString()}
                      completion={resume.completion || 0}
                      templateUsed={resume.template?.theme === "01" ? "Modern" : resume.template?.theme === "02" ? "Professional" : "Minimal"}
                      onSelect={() => navigate(`/resume/${resume._id}`)}
                      onDuplicate={() => handleDuplicateResume(resume)}
                      onDownload={() => handleDownloadPDF(resume)}
                      onDelete={() => {
                        setResumeToDelete(resume._id);
                        setShowDeleteConfirm(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT SIDE: Quick Actions Panel */}
            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tight border-b-2 border-black pb-2">
                Quick Tasks
              </h2>

              <div className="space-y-4">
                {/* Create Card */}
                <div
                  onClick={() => setOpenCreateModal(true)}
                  className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] cursor-pointer transition flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-[#ffe17c] border border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000] group-hover:scale-105 transition-transform">
                    <LucideFilePlus size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-black uppercase tracking-wide">
                      Create Resume
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">Start fresh from a template</p>
                  </div>
                </div>

                {/* Import Card */}
                <div
                  onClick={() => setOpenImportModal(true)}
                  className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] cursor-pointer transition flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-[#b7c6c2] border border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000] group-hover:scale-105 transition-transform">
                    <Upload size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-black uppercase tracking-wide">
                      Import Resume
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">Upload PDF/DOCX/TXT resume</p>
                  </div>
                </div>

                {/* AI Assistant card */}
                <div
                  onClick={() => {
                    if (allResumes.length === 0) return toast.error("Please create a resume first");
                    setOpenAnalyzeModal(true);
                    setSelectedResumeToAnalyze(allResumes[0]._id);
                  }}
                  className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] cursor-pointer transition flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-[#ffe17c] border border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000] group-hover:scale-105 transition-transform">
                    <Brain size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-black uppercase tracking-wide">
                      AI Assistant
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">Evaluate and score keywords</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          renderAnalyticsDashboard()
        )}
      </main>

      {/* CREATE RESUME DIALOG */}
      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
      >
        <CreateResumeForm
          onSuccess={() => {
            setOpenCreateModal(false);
            fetchAllResumes();
          }}
        />
      </Modal>

      {/* DELETE CONFIRMATION DIALOG */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Deletion"
        showActionBtn
        actionBtnText="Delete Resume"
        actionBtnClassName="bg-red-500 text-white font-black"
        onActionClick={handleDeleteResume}
      >
        <div className="p-5 text-center space-y-4">
          <div className="w-12 h-12 bg-red-100 border border-black flex items-center justify-center mx-auto text-red-650 shadow-[2px_2px_0px_#000] animate-bounce">
            <LucideTrash2 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase text-black">Confirm CV Deletion</h3>
            <p className="text-xs text-slate-500 font-bold mt-1">
              This action will erase the resume data permanently.
            </p>
          </div>
        </div>
      </Modal>

      {/* IMPORT DIALOG (PDF, DOCX, TXT with AI Parse) */}
      <Modal
        isOpen={openImportModal}
        onClose={() => {
          setOpenImportModal(false);
          setImportData(null);
          setImportConfidence(null);
          setImportFile(null);
        }}
        title="Import Existing Resume"
      >
        <div className="p-5 space-y-5 text-black">
          {!importData ? (
            <form onSubmit={handleFileUpload} className="space-y-4">
              <p className="text-xs text-slate-650 font-bold">
                Select a PDF, DOCX, or TXT resume to upload. Our AI will extract all text, auto-structure the fields, and populate the editor.
              </p>
              
              <div className="border-2 border-dashed border-black p-6 bg-slate-50 flex flex-col items-center justify-center text-center">
                <Upload size={24} className="text-slate-400 mb-2" />
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => setImportFile(e.target.files[0])}
                  className="text-xs font-bold w-full max-w-[200px]"
                />
                <span className="text-[9px] text-slate-400 mt-1 uppercase font-bold">PDF, DOCX, or TXT (Max 10MB)</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={importLoading || !importFile}
                  className="flex-1 py-2.5 bg-[#ffe17c] text-black border-2 border-black font-black uppercase text-xs shadow-[2px_2px_0px_#000] active:translate-x-[1px] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {importLoading ? "Uploading & Parsing..." : "Parse & Upload Resume"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenImportModal(false)}
                  className="py-2 px-4 bg-white text-black border-2 border-black font-black uppercase text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {(() => {
                const getConfidenceLabel = (key) => {
                const labels = {
                  email: "Email Address",
                  phone: "Phone Number",
                  linkedinUrl: "LinkedIn URL",
                  githubUrl: "GitHub URL",
                  leetcodeUrl: "LeetCode URL",
                  codechefUrl: "CodeChef URL",
                  portfolioUrl: "Portfolio URL",
                  linkedinLabel: "LinkedIn Label Found",
                  githubLabel: "GitHub Label Found",
                  leetcodeLabel: "LeetCode Label Found",
                  codechefLabel: "CodeChef Label Found",
                  portfolioLabel: "Portfolio Label Found"
                };
                return labels[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
              };
              
              const hasMissingUrls = Object.entries(importConfidence || {}).some(
                ([key, val]) => key.endsWith("Label") && val === 25
              );
              
              return (
                <div className="space-y-4">
                  {hasMissingUrls && (
                    <div className="p-3 border-2 border-red-500 bg-red-50 text-red-800 font-bold text-xs shadow-[2px_2px_0px_#ef4444]">
                      ⚠️ We found social profile references but could not determine the actual URLs. Please fill them in below.
                    </div>
                  )}
                  
                  <div className="border-2 border-black p-4 bg-[#ffe17c]/10 shadow-[2px_2px_0px_#000]">
                    <h4 className="text-xs font-black uppercase tracking-wider mb-2">Extraction Confidence Ratings</h4>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600">
                      {Object.entries(importConfidence || {})
                        .filter(([_, val]) => val > 0)
                        .map(([section, val]) => (
                          <div key={section} className="flex justify-between items-center p-1 bg-white border border-slate-200">
                            <span className="capitalize">{getConfidenceLabel(section)}</span>
                            <span className={val > 80 ? "text-green-700" : "text-amber-700"}>{val}%</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Editable Fields Review Area */}
                  <div className="border-2 border-black p-4 bg-white shadow-[2px_2px_0px_#000] space-y-3 max-h-56 overflow-y-auto custom-scrollbar">
                    <h4 className="text-xs font-black uppercase tracking-wider border-b pb-1">Review Parsed Details</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase">Candidate Name</label>
                        <input
                          type="text"
                          value={importData.profileInfo?.fullName || ""}
                          onChange={(e) => setImportData(prev => ({
                            ...prev,
                            profileInfo: { ...prev.profileInfo, fullName: e.target.value }
                          }))}
                          className="w-full p-1 border border-black text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase">Designation</label>
                        <input
                          type="text"
                          value={importData.profileInfo?.designation || ""}
                          onChange={(e) => setImportData(prev => ({
                            ...prev,
                            profileInfo: { ...prev.profileInfo, designation: e.target.value }
                          }))}
                          className="w-full p-1 border border-black text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase">Email</label>
                        <input
                          type="text"
                          value={importData.contactInfo?.email || ""}
                          onChange={(e) => setImportData(prev => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, email: e.target.value }
                          }))}
                          className="w-full p-1 border border-black text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase">Phone</label>
                        <input
                          type="text"
                          value={importData.contactInfo?.phone || ""}
                          onChange={(e) => setImportData(prev => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, phone: e.target.value }
                          }))}
                          className="w-full p-1 border border-black text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase">LinkedIn URL</label>
                        <input
                          type="text"
                          value={importData.contactInfo?.linkedin || ""}
                          onChange={(e) => setImportData(prev => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, linkedin: e.target.value }
                          }))}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full p-1 border border-black text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase">GitHub URL</label>
                        <input
                          type="text"
                          value={importData.contactInfo?.github || ""}
                          onChange={(e) => setImportData(prev => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, github: e.target.value }
                          }))}
                          placeholder="https://github.com/username"
                          className="w-full p-1 border border-black text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase">LeetCode URL</label>
                        <input
                          type="text"
                          value={importData.contactInfo?.leetcode || ""}
                          onChange={(e) => setImportData(prev => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, leetcode: e.target.value }
                          }))}
                          placeholder="https://leetcode.com/username"
                          className="w-full p-1 border border-black text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase">CodeChef URL</label>
                        <input
                          type="text"
                          value={importData.contactInfo?.codechef || ""}
                          onChange={(e) => setImportData(prev => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, codechef: e.target.value }
                          }))}
                          placeholder="https://codechef.com/users/username"
                          className="w-full p-1 border border-black text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase">Portfolio / Website URL</label>
                        <input
                          type="text"
                          value={importData.contactInfo?.portfolio || importData.contactInfo?.website || ""}
                          onChange={(e) => setImportData(prev => ({
                            ...prev,
                            contactInfo: { 
                              ...prev.contactInfo, 
                              portfolio: e.target.value,
                              website: e.target.value
                            }
                          }))}
                          placeholder="https://yourportfolio.com"
                          className="w-full p-1 border border-black text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex gap-2">
                <button
                  onClick={handleSaveImportedResume}
                  className="flex-1 py-2.5 bg-[#171e19] text-white border-2 border-black font-black uppercase text-xs shadow-[2px_2px_0px_#ffe17c] active:translate-x-[1px] cursor-pointer"
                >
                  Verify & Import into Editor
                </button>
                <button
                  type="button"
                  onClick={() => { setImportData(null); setImportConfidence(null); }}
                  className="py-2.5 px-4 bg-white text-black border-2 border-black font-black uppercase text-xs"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* AI ASSISTANT / ATS ANALYSIS DIALOG */}
      <Modal
        isOpen={openAnalyzeModal}
        onClose={() => {
          setOpenAnalyzeModal(false);
          setAnalysisResult(null);
          setSelectedResumeToAnalyze("");
        }}
        title="ATS Score & AI Analysis"
      >
        <div className="p-5 space-y-5 text-black">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1 text-black">Select Resume</label>
            <select
              value={selectedResumeToAnalyze}
              onChange={(e) => setSelectedResumeToAnalyze(e.target.value)}
              className="w-full border-2 border-black p-2.5 rounded-none font-bold text-sm bg-white"
            >
              <option value="">-- Pick a resume --</option>
              {allResumes.map(r => (
                <option key={r._id} value={r._id}>{r.title}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAIAnalyze}
            disabled={analyzingLoading || !selectedResumeToAnalyze}
            className="w-full py-3 bg-[#ffe17c] text-black border-2 border-black font-black uppercase tracking-wider text-xs shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#000] disabled:opacity-50 transition-all cursor-pointer"
          >
            {analyzingLoading ? "Analyzing..." : "Analyze with AI"}
          </button>

          {analysisResult && (
            <div className="mt-4 space-y-4 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
              
              {/* ATS Score card */}
              <div className="p-4 bg-[#ffe17c] border-2 border-black shadow-[4px_4px_0px_#000] flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-xs uppercase tracking-widest text-black mb-1">
                    ATS Score
                  </h4>
                  <p className="text-[10px] font-bold text-slate-700 leading-tight">Your CV matches 76% of role parameters.</p>
                </div>
                <div className="w-14 h-14 rounded-none border-2 border-black bg-white flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_#000]">
                  76%
                </div>
              </div>

              {/* Tone summary */}
              <div className="p-3 bg-white border-2 border-black rounded-none">
                <h4 className="font-extrabold text-xs text-black uppercase tracking-widest mb-1">
                  Overall Tone Summary
                </h4>
                <p className="text-xs font-bold text-slate-700">
                  {analysisResult.toneSummary}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-[#b7c6c2]/20 border-2 border-black rounded-none">
                  <h4 className="font-extrabold text-xs text-black uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    💪 Strengths
                  </h4>
                  <ul className="list-disc pl-4 text-[11px] text-slate-800 font-bold space-y-1">
                    {analysisResult.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                
                <div className="p-3 bg-white border-2 border-black rounded-none">
                  <h4 className="font-extrabold text-xs text-black uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    ⚠ Improvement Areas
                  </h4>
                  <ul className="list-disc pl-4 text-[11px] text-slate-800 font-bold space-y-1">
                    {analysisResult.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* SETTINGS DIALOG */}
      <Modal
        isOpen={openSettingsModal}
        onClose={() => setOpenSettingsModal(false)}
        title="Settings"
      >
        <div className="p-5 text-black space-y-4">
          <h3 className="font-black text-sm uppercase tracking-wider text-black border-b border-black pb-2">Workspace Config</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span>Automatic Saves</span>
              <span className="text-emerald-650 font-black">ENABLED (LOCAL)</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold">
              <span>API Endpoints Mode</span>
              <span className="text-slate-600 font-black">PRODUCTION</span>
            </div>
          </div>
          <button
            onClick={() => setOpenSettingsModal(false)}
            className="w-full py-2 bg-white text-black border-2 border-black font-black uppercase text-xs tracking-wider cursor-pointer"
          >
            Close Settings
          </button>
        </div>
      </Modal>

      {/* HIDDEN PREVIEW ELEMENT FOR PDF DOWNLOAD COMPILATION */}
      {downloadingResume && (
        <div className="absolute left-[-9999px] top-[-9999px] pointer-events-none">
          <div id="hidden-resume-download" style={{ width: "800px" }} className="bg-white text-black p-8">
            <RenderResume
              templateId={downloadingResume.template?.theme || "01"}
              resumeData={downloadingResume}
              containerWidth={800}
              themeConfig={{
                primaryColor: downloadingResume.template?.primaryColor || "#6D28D9",
                accentColor: downloadingResume.template?.accentColor || "#F472B6",
                fontFamily: downloadingResume.template?.fontFamily || "'Poppins', sans-serif",
                layout: downloadingResume.template?.layout || "modern",
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
