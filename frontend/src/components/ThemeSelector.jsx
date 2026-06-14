import React, { useEffect, useRef, useState, useContext } from "react";
import { resumeTemplates, DUMMY_RESUME_DATA } from "../utils/data";
import RenderResume from "./RenderResume";
import { Sparkles, Palette, Loader2, Award, CheckCircle, HelpCircle } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

/* -------------------- Constants -------------------- */
const TAB_DATA = [
  { label: "Templates" },
  { label: "Customization" },
  { label: "AI Suggestions" },
];

/* -------------------- Main Component -------------------- */
const ThemeSelector = ({
  selectedTheme,
  setSelectedTheme,
  resumeData,
  themeConfig,
  setThemeConfig,
  onClose,
}) => {
  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const [tabValue, setTabValue] = useState("Templates");
  
  // Filtering and gallery selections
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Selected template tracking
  const initialIndex = resumeTemplates.findIndex((t) => t.id === selectedTheme);
  const [selectedTemplate, setSelectedTemplate] = useState({
    theme: selectedTheme || resumeTemplates[0]?.id || "",
    index: initialIndex >= 0 ? initialIndex : 0,
  });

  // Preview zoom control
  const [zoomMode, setZoomMode] = useState("fit-width");

  // AI theme suggestion
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiSuggestedTheme, setAiSuggestedTheme] = useState(null);

  const handleThemeSelection = () => {
    setSelectedTheme(selectedTemplate.theme);
    onClose?.();
  };

  const updateBaseWidth = () => {
    if (resumeRef.current) setBaseWidth(resumeRef.current.offsetWidth);
  };

  useEffect(() => {
    updateBaseWidth();
    const timer = setTimeout(updateBaseWidth, 120);
    window.addEventListener("resize", updateBaseWidth);
    return () => {
      window.removeEventListener("resize", updateBaseWidth);
      clearTimeout(timer);
    };
  }, [tabValue, selectedTemplate.theme, aiSuggestedTheme, selectedCategory]);

  /* -------------------- AI Theme Suggestion Preview -------------------- */
  const handleAIThemePreview = async () => {
    try {
      setIsAIProcessing(true);
      toast.loading("AI is analyzing your resume...");
      
      const res = await axiosInstance.post("/api/ai/analyze", { 
        resumeData,
        task: "ats_analysis"
      });
      toast.dismiss();

      if (res.data.success) {
        const { toneSummary } = res.data.analysis;
        const prompt = `
          You are a UI design expert. 
          Suggest a resume theme color palette and font family that matches this tone: "${toneSummary}".
          Return JSON like:
          {
            "primaryColor": "#HEX",
            "accentColor": "#HEX",
            "fontFamily": "Font Name",
            "layout": "modern | classic | creative"
          }
        `;

        const themeRes = await axiosInstance.post("/api/ai/generate", { 
          prompt,
          task: "resume_summary"
        });
        const aiTheme = themeRes.data.aiResume || {};

        setAiSuggestedTheme({
          primaryColor: aiTheme.primaryColor || "#6D28D9",
          accentColor: aiTheme.accentColor || "#F472B6",
          fontFamily: aiTheme.fontFamily || "'Poppins', sans-serif",
          layout: aiTheme.layout || "modern",
        });

        toast.success("✨ AI suggested theme ready for preview!");
      } else {
        toast.error("AI could not analyze your resume.");
      }
    } catch (error) {
      console.error("AI Theme Suggestion Error:", error);
      toast.dismiss();
      toast.error("AI theme suggestion failed. Try again.");
    } finally {
      setIsAIProcessing(false);
    }
  };

  /* -------------------- Theme Updater -------------------- */
  const updateTheme = (key, value) => {
    setThemeConfig((prev) => ({ ...prev, [key]: value }));
  };

  /* -------------------- Profession Presets -------------------- */
  const presets = [
    {
      name: "Developer",
      colors: { primary: "#2563EB", accent: "#60A5FA" },
      font: "'Roboto Mono', monospace",
      layout: "modern",
    },
    {
      name: "Designer",
      colors: { primary: "#EC4899", accent: "#FBBF24" },
      font: "'Playfair Display', serif",
      layout: "creative",
    },
    {
      name: "Marketer",
      colors: { primary: "#16A34A", accent: "#A3E635" },
      font: "'Inter', sans-serif",
      layout: "classic",
    },
  ];

  const applyPreset = (preset) => {
    setThemeConfig({
      primaryColor: preset.colors.primary,
      accentColor: preset.colors.accent,
      fontFamily: preset.font,
      layout: preset.layout,
    });
    toast.success(`🎨 ${preset.name} theme applied!`);
  };

  /* -------------------- AI Template Recommendation Logic -------------------- */
  const getAiRecommendation = (designation = "") => {
    const title = designation.toLowerCase();
    if (title.includes("engineer") || title.includes("developer") || title.includes("tech") || title.includes("software") || title.includes("coder") || title.includes("programmer")) {
      return {
        template: resumeTemplates.find(t => t.id === "software-engineer"),
        confidence: 96,
        reason: "Emphasizes technical skills matrix and key engineering projects."
      };
    }
    if (title.includes("student") || title.includes("junior") || title.includes("intern") || title.includes("graduate") || title.includes("fresh")) {
      return {
        template: resumeTemplates.find(t => t.id === "student-fresher"),
        confidence: 94,
        reason: "Prioritizes your education timeline and university projects."
      };
    }
    if (title.includes("executive") || title.includes("director") || title.includes("vp") || title.includes("head") || title.includes("ceo") || title.includes("founder")) {
      return {
        template: resumeTemplates.find(t => t.id === "executive"),
        confidence: 92,
        reason: "Features center header and high-impact leadership summary."
      };
    }
    if (title.includes("designer") || title.includes("artist") || title.includes("creative") || title.includes("ui") || title.includes("ux")) {
      return {
        template: resumeTemplates.find(t => t.id === "creative"),
        confidence: 90,
        reason: "Expressive two-column format with custom accents."
      };
    }
    if (title.includes("consultant") || title.includes("advisor") || title.includes("analyst")) {
      return {
        template: resumeTemplates.find(t => t.id === "minimal"),
        confidence: 93,
        reason: "Spacious layout displaying minimal visual noise."
      };
    }
    return {
      template: resumeTemplates.find(t => t.id === "modern-professional"),
      confidence: 95,
      reason: "Universal single-column layout suitable for most hiring tracks."
    };
  };

  const aiRecommendation = getAiRecommendation(resumeData?.profileInfo?.designation || "");

  // Filters logic
  const filteredTemplates = selectedCategory === "All" 
    ? resumeTemplates 
    : resumeTemplates.filter(t => t.category === selectedCategory || (selectedCategory === "ATS Friendly" && t.category === "ATS Friendly"));

  const selectedDetails = resumeTemplates.find(t => t.id === selectedTemplate.theme) || resumeTemplates[0];

  // Zoom modes calculator
  let calculatedScale = 1;
  if (zoomMode === "50") calculatedScale = 0.5;
  else if (zoomMode === "75") calculatedScale = 0.75;
  else if (zoomMode === "100") calculatedScale = 1.0;
  else if (zoomMode === "125") calculatedScale = 1.25;
  else if (zoomMode === "fit-width") {
    calculatedScale = baseWidth ? Math.max(0.35, (baseWidth - 48) / 800) : 0.8;
  } else if (zoomMode === "fit-page") {
    calculatedScale = 0.45; // safe ratio to fit A4 page vertically
  }

  /* -------------------- Render -------------------- */
  return (
    <div className="flex flex-col h-full overflow-hidden text-black bg-slate-50">
      
      {/* TABS HEADER BAR */}
      <div className="flex border-b-2 border-black bg-white flex-shrink-0">
        {TAB_DATA.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => {
              setTabValue(tab.label);
              setAiSuggestedTheme(null);
            }}
            className={`flex-1 py-3 text-xs font-black uppercase border-r-2 border-black last:border-r-0 tracking-wider transition-all cursor-pointer ${
              tabValue === tab.label
                ? "bg-[#ffe17c] text-black"
                : "text-slate-500 hover:text-black bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABS CONTENT PANEL */}
      <div className="flex-1 overflow-hidden p-4 min-h-0 bg-slate-50">
        
        {/* ---------- Templates Tab ---------- */}
        {tabValue === "Templates" && (
          <div className="flex flex-col lg:flex-row w-full h-full overflow-hidden gap-4">
            
            {/* Sidebar list */}
            <div className="w-full lg:w-[350px] flex-shrink-0 flex flex-col bg-white border-2 border-black p-4 overflow-y-auto custom-scrollbar h-full shadow-[4px_4px_0px_#000]">
              
              {/* Category Filters */}
              <div className="space-y-2 mb-4 flex-shrink-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Categories</span>
                <div className="flex flex-wrap gap-1.5">
                  {["All", "ATS Friendly", "Professional", "Developer", "Student", "Executive", "Creative"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2 py-1 text-[9px] font-black uppercase border border-black cursor-pointer transition-all ${
                        selectedCategory === cat 
                          ? "bg-[#ffe17c] text-black shadow-[1.5px_1.5px_0px_#000]" 
                          : "bg-white text-slate-700 hover:text-black hover:border-black"
                      }`}
                    >
                      {cat === "ATS Friendly" ? "ATS" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Suggested Card */}
              {aiRecommendation && (
                <div className="bg-[#ffe17c]/10 border-2 border-black p-3.5 mb-4 shadow-[2px_2px_0px_#000] relative flex-shrink-0">
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black text-white text-[8px] font-black px-1.5 py-0.5 uppercase tracking-wide">
                    <Sparkles size={8} className="fill-yellow-400" /> AI SUGGESTED
                  </div>
                  <h4 className="text-[9px] font-black text-black uppercase tracking-wider mb-1">Recommended Layout</h4>
                  <p className="text-[11px] font-bold text-slate-700 mb-2 leading-tight">
                    For title: <span className="underline italic">"{resumeData?.profileInfo?.designation || "Graduate"}"</span>
                  </p>
                  <div className="flex justify-between items-center text-xs font-black mb-3">
                    <span className="text-slate-800">{aiRecommendation.template.name}</span>
                    <span className="text-emerald-700">{aiRecommendation.confidence}% Match</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTemplate({ 
                        theme: aiRecommendation.template.id, 
                        index: resumeTemplates.findIndex(t => t.id === aiRecommendation.template.id) 
                      });
                      setThemeConfig(aiRecommendation.template.defaultTheme);
                      toast.success(`Applied AI recommended template: ${aiRecommendation.template.name}`);
                    }}
                    className="w-full py-1.5 border-2 border-black bg-black text-white hover:bg-slate-900 text-[9px] font-black uppercase tracking-widest cursor-pointer shadow-[2px_2px_0px_#ffe17c] transition-all"
                  >
                    Apply Recommendation
                  </button>
                </div>
              )}

              {/* List of Template cards */}
              <div className="flex-1 space-y-3 pr-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-1">Designs Gallery</span>
                <div className="grid grid-cols-2 gap-3 p-1">
                  {filteredTemplates.map((template) => {
                    const isSelected = selectedTemplate.theme === template.id;
                    return (
                      <div
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplate({ 
                            theme: template.id, 
                            index: resumeTemplates.findIndex(t => t.id === template.id) 
                          });
                          setThemeConfig(template.defaultTheme);
                        }}
                        className={`group flex flex-col bg-white border-2 border-black rounded-none cursor-pointer transition-all duration-200 p-2 shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] relative ${
                          isSelected ? "bg-[#ffe17c]/5 border-[#ffe17c] shadow-[4px_4px_0px_#000]" : ""
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 bg-[#ffe17c] border border-black px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wider z-10">
                            Active
                          </div>
                        )}
                        <div className="aspect-[4/5] bg-slate-100 border border-slate-200 overflow-hidden mb-1.5">
                          <img
                            src={template.thumbnailImg}
                            alt={template.name}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-[10px] font-black text-black uppercase truncate">{template.name}</h4>
                          <div className="flex justify-between items-center text-[8px] font-black text-slate-500">
                            <span className="bg-slate-100 border border-slate-200 px-1 py-0.2 rounded-none">{template.badge}</span>
                            <span className="text-emerald-700">ATS {template.atsScore}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Template details card at sidebar bottom */}
              {selectedDetails && (
                <div className="bg-white border-2 border-black p-3.5 mt-4 space-y-2.5 shadow-[2px_2px_0px_#000] flex-shrink-0">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1.5">Selected Template</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-black">{selectedDetails.name}</span>
                    <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 uppercase">ATS: {selectedDetails.atsScore}%</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-600 leading-normal">{selectedDetails.description}</p>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Recommended For:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedDetails.recommendedFor.map((item, idx) => (
                        <span key={idx} className="text-[8px] font-black bg-slate-50 border border-slate-200 text-slate-700 px-1.5 py-0.5">
                          • {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Canvas Preview Workspace */}
            <div className="flex-grow bg-slate-100 border-2 border-black flex flex-col h-full overflow-hidden shadow-[4px_4px_0px_#000] p-4">
              
              {/* Preview controls */}
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-300 flex-shrink-0">
                <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  Interactive Preview
                </span>
                <div className="flex items-center gap-1 bg-white border border-black p-0.5 shadow-[2px_2px_0px_#000]">
                  {["50", "75", "100", "125", "fit-width", "fit-page"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setZoomMode(mode)}
                      className={`px-1.5 py-0.5 text-[9px] font-black uppercase border border-transparent cursor-pointer transition-all ${
                        zoomMode === mode ? "bg-[#ffe17c] text-black border-black" : "text-slate-600 hover:text-black"
                      }`}
                    >
                      {mode === "fit-width" ? "Fit W" : mode === "fit-page" ? "Fit P" : `${mode}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable canvas */}
              <div 
                className="flex-grow bg-slate-200 border-2 border-black overflow-auto custom-scrollbar relative flex justify-center items-start p-6" 
                ref={resumeRef}
              >
                <div 
                  style={{
                    width: `${800 * calculatedScale}px`,
                    height: `${1131 * calculatedScale}px`,
                    position: "relative",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
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
                      templateId={selectedTemplate.theme}
                      resumeData={resumeData || DUMMY_RESUME_DATA}
                      containerWidth={800}
                      themeConfig={themeConfig}
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ---------- Customization Tab ---------- */}
        {tabValue === "Customization" && (
          <div className="flex flex-col lg:flex-row w-full h-full overflow-hidden gap-4">
            
            {/* Customization Sidebar */}
            <div className="w-full lg:w-[350px] flex-shrink-0 flex flex-col bg-white border-2 border-black p-4 overflow-y-auto custom-scrollbar h-full shadow-[4px_4px_0px_#000] space-y-5">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">
                Color & Fonts Config
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black text-black uppercase tracking-wider mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeConfig.primaryColor}
                      onChange={(e) => updateTheme("primaryColor", e.target.value)}
                      className="w-10 h-10 border-2 border-black rounded-none cursor-pointer p-0 bg-transparent"
                    />
                    <span className="text-xs font-bold text-slate-700 font-mono">{themeConfig.primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-black uppercase tracking-wider mb-1">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeConfig.accentColor}
                      onChange={(e) => updateTheme("accentColor", e.target.value)}
                      className="w-10 h-10 border-2 border-black rounded-none cursor-pointer p-0 bg-transparent"
                    />
                    <span className="text-xs font-bold text-slate-700 font-mono">{themeConfig.accentColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-black uppercase tracking-wider mb-1">Font Family</label>
                  <select
                    value={themeConfig.fontFamily}
                    onChange={(e) => updateTheme("fontFamily", e.target.value)}
                    className="w-full border-2 border-black bg-white p-2 text-xs font-bold rounded-none outline-none focus:bg-[#ffe17c]/5"
                  >
                    <option value="'Poppins', sans-serif">Poppins</option>
                    <option value="'Inter', sans-serif">Inter</option>
                    <option value="'Roboto Slab', serif">Roboto Slab</option>
                    <option value="'Playfair Display', serif">Playfair Display</option>
                    <option value="'Roboto Mono', monospace">Roboto Mono</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-black uppercase tracking-wider mb-1">Layout Style</label>
                  <select
                    value={themeConfig.layout}
                    onChange={(e) => updateTheme("layout", e.target.value)}
                    className="w-full border-2 border-black bg-white p-2 text-xs font-bold rounded-none outline-none focus:bg-[#ffe17c]/5"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="creative">Creative</option>
                    <option value="compact">Compact</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 mt-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">💼 Quick Presets</h4>
                <div className="flex flex-col gap-2">
                  {presets.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="w-full py-2 border border-black bg-slate-50 text-black font-black uppercase text-[10px] rounded-none hover:bg-[#ffe17c] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] shadow-[2px_2px_0px_#000] transition-all cursor-pointer"
                    >
                      {preset.name} Preset
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Canvas Preview Workspace */}
            <div className="flex-grow bg-slate-100 border-2 border-black flex flex-col h-full overflow-hidden shadow-[4px_4px_0px_#000] p-4">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-300 flex-shrink-0">
                <span className="text-xs font-black uppercase tracking-wider">Customization Preview</span>
                <div className="flex items-center gap-1 bg-white border border-black p-0.5 shadow-[2px_2px_0px_#000]">
                  {["50", "75", "100", "125", "fit-width", "fit-page"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setZoomMode(mode)}
                      className={`px-1.5 py-0.5 text-[9px] font-black uppercase border border-transparent cursor-pointer transition-all ${
                        zoomMode === mode ? "bg-[#ffe17c] text-black border-black" : "text-slate-600 hover:text-black"
                      }`}
                    >
                      {mode === "fit-width" ? "Fit W" : mode === "fit-page" ? "Fit P" : `${mode}%`}
                    </button>
                  ))}
                </div>
              </div>

              <div 
                className="flex-grow bg-slate-200 border-2 border-black overflow-auto custom-scrollbar relative flex justify-center items-start p-6" 
                ref={resumeRef}
              >
                <div 
                  style={{
                    width: `${800 * calculatedScale}px`,
                    height: `${1131 * calculatedScale}px`,
                    position: "relative",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
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
                      templateId={selectedTemplate.theme}
                      resumeData={resumeData || DUMMY_RESUME_DATA}
                      containerWidth={800}
                      themeConfig={themeConfig}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ---------- AI Suggestions Tab ---------- */}
        {tabValue === "AI Suggestions" && (
          <div className="flex flex-col lg:flex-row w-full h-full overflow-hidden gap-4">
            
            {/* AI Control Sidebar */}
            <div className="w-full lg:w-[350px] flex-shrink-0 flex flex-col bg-white border-2 border-black p-4 overflow-y-auto custom-scrollbar h-full shadow-[4px_4px_0px_#000] space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">
                AI Tone Suggestion
              </h3>
              
              <p className="text-xs font-bold text-slate-700 leading-relaxed">
                Our AI will analyze the tone of your resume description to automatically draft a matching color scheme, font configuration, and layout theme.
              </p>

              <button
                type="button"
                onClick={handleAIThemePreview}
                disabled={isAIProcessing}
                className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-black bg-[#ffe17c] text-black font-black uppercase text-xs tracking-wider shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer disabled:opacity-50"
              >
                {isAIProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={14} /> Thinking...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} /> Analyze Tone
                  </>
                )}
              </button>

              {aiSuggestedTheme && (
                <div className="border-t border-slate-200 pt-3 space-y-3">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider">🔮 Suggested Option</h4>
                  <div className="text-[11px] space-y-1 font-bold text-slate-800 bg-slate-50 p-2.5 border border-slate-200">
                    <div>Primary: {aiSuggestedTheme.primaryColor}</div>
                    <div>Accent: {aiSuggestedTheme.accentColor}</div>
                    <div>Font: {aiSuggestedTheme.fontFamily}</div>
                    <div className="capitalize">Layout: {aiSuggestedTheme.layout}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setThemeConfig(aiSuggestedTheme);
                        setAiSuggestedTheme(null);
                        toast.success("✨ AI theme applied successfully!");
                      }}
                      className="flex-1 py-1.5 border border-black bg-emerald-500 text-white font-black uppercase text-[10px] shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] cursor-pointer"
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiSuggestedTheme(null)}
                      className="flex-1 py-1.5 border border-black bg-white text-slate-700 font-black uppercase text-[10px] shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] cursor-pointer"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Canvas Preview Workspace */}
            <div className="flex-grow bg-slate-100 border-2 border-black flex flex-col h-full overflow-hidden shadow-[4px_4px_0px_#000] p-4">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-300 flex-shrink-0">
                <span className="text-xs font-black uppercase tracking-wider">AI Suggestions Preview</span>
                <div className="flex items-center gap-1 bg-white border border-black p-0.5 shadow-[2px_2px_0px_#000]">
                  {["50", "75", "100", "125", "fit-width", "fit-page"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setZoomMode(mode)}
                      className={`px-1.5 py-0.5 text-[9px] font-black uppercase border border-transparent cursor-pointer transition-all ${
                        zoomMode === mode ? "bg-[#ffe17c] text-black border-black" : "text-slate-600 hover:text-black"
                      }`}
                    >
                      {mode === "fit-width" ? "Fit W" : mode === "fit-page" ? "Fit P" : `${mode}%`}
                    </button>
                  ))}
                </div>
              </div>

              <div 
                className="flex-grow bg-slate-200 border-2 border-black overflow-auto custom-scrollbar relative flex justify-center items-start p-6" 
                ref={resumeRef}
              >
                <div 
                  style={{
                    width: `${800 * calculatedScale}px`,
                    height: `${1131 * calculatedScale}px`,
                    position: "relative",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
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
                      templateId={selectedTemplate.theme}
                      resumeData={resumeData || DUMMY_RESUME_DATA}
                      containerWidth={800}
                      themeConfig={aiSuggestedTheme || themeConfig}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* FOOTER ACTION BUTTONS */}
      <div className="flex justify-end gap-3 p-4 border-t border-black bg-white flex-shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border-2 border-black bg-white text-black font-black uppercase text-xs tracking-wider cursor-pointer shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleThemeSelection}
          className="px-5 py-2 border-2 border-black bg-[#ffe17c] text-black font-black uppercase text-xs tracking-wider cursor-pointer shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000]"
        >
          Apply Template
        </button>
      </div>

    </div>
  );
};

export default ThemeSelector;
