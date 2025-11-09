import React, { useEffect, useRef, useState } from "react";
import { resumeTemplates, DUMMY_RESUME_DATA } from "../utils/data";
import { TemplateCard } from "./Cards";
import RenderResume from "./RenderResume";
import Tabs from "./Tabs";
import { Check, Sparkles, Palette, Loader2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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

  // Selected template tracking
  const initialIndex = resumeTemplates.findIndex((t) => t.id === selectedTheme);
  const [selectedTemplate, setSelectedTemplate] = useState({
    theme: selectedTheme || resumeTemplates[0]?.id || "",
    index: initialIndex >= 0 ? initialIndex : 0,
  });

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
    window.addEventListener("resize", updateBaseWidth);
    return () => window.removeEventListener("resize", updateBaseWidth);
  }, []);

  /* -------------------- AI Theme Suggestion Preview -------------------- */
  const handleAIThemePreview = async () => {
    try {
      setIsAIProcessing(true);
      toast.loading("AI is analyzing your resume...");
      const res = await axiosInstance.post("/api/ai/analyze", { resumeData });
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

        const themeRes = await axiosInstance.post("/api/ai/generate", { prompt });
        const aiTheme = themeRes.data.aiResume || {};

        // Show the AI preview theme, don’t apply yet
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

  /* -------------------- Render -------------------- */
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 sm:p-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl text-white shadow-lg">
        <Tabs tabs={TAB_DATA} activeTab={tabValue} setActiveTab={setTabValue} />
        <button
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-white text-violet-700 font-bold rounded-2xl hover:scale-105 transition-all shadow-lg hover:shadow-xl"
          onClick={handleThemeSelection}
        >
          <Check size={18} /> Apply Theme
        </button>
      </div>

      {/* ---------- Templates Tab ---------- */}
      {tabValue === "Templates" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Template List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-auto p-2">
              {resumeTemplates.map((template, index) => (
                <TemplateCard
                  key={`templates_${index}`}
                  thumbnailImg={template.thumbnailImg}
                  isSelected={selectedTemplate.index === index}
                  onSelect={() => setSelectedTemplate({ theme: template.id, index })}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div
            className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-4 sm:p-6"
            ref={resumeRef}
          >
            <motion.div
              key={selectedTemplate.theme}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <RenderResume
                templateId={selectedTemplate.theme}
                resumeData={resumeData || DUMMY_RESUME_DATA}
                containerWidth={baseWidth}
                themeConfig={themeConfig}
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* ---------- Customization Tab ---------- */}
      {tabValue === "Customization" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Palette size={18} className="text-purple-600" /> Customize Your Theme
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Primary Color</label>
                <input
                  type="color"
                  value={themeConfig.primaryColor}
                  onChange={(e) => updateTheme("primaryColor", e.target.value)}
                  className="w-16 h-8 ml-3 rounded cursor-pointer border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Accent Color</label>
                <input
                  type="color"
                  value={themeConfig.accentColor}
                  onChange={(e) => updateTheme("accentColor", e.target.value)}
                  className="w-16 h-8 ml-3 rounded cursor-pointer border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Font Family</label>
                <select
                  value={themeConfig.fontFamily}
                  onChange={(e) => updateTheme("fontFamily", e.target.value)}
                  className="w-full border p-2 rounded-lg mt-1"
                >
                  <option value="'Poppins', sans-serif">Poppins</option>
                  <option value="'Inter', sans-serif">Inter</option>
                  <option value="'Roboto Slab', serif">Roboto Slab</option>
                  <option value="'Playfair Display', serif">Playfair Display</option>
                  <option value="'Roboto Mono', monospace">Roboto Mono</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Layout Style</label>
                <select
                  value={themeConfig.layout}
                  onChange={(e) => updateTheme("layout", e.target.value)}
                  className="w-full border p-2 rounded-lg mt-1"
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="creative">Creative</option>
                  <option value="compact">Compact</option>
                </select>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-gray-700 mb-2">💼 Profession Presets</h3>
              <div className="flex gap-3 flex-wrap">
                {presets.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => applyPreset(preset)}
                    className="px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-violet-100 to-fuchsia-100 hover:scale-105 border"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6" ref={resumeRef}>
            <RenderResume
              templateId={selectedTemplate.theme}
              resumeData={resumeData || DUMMY_RESUME_DATA}
              containerWidth={baseWidth}
              themeConfig={themeConfig}
            />
          </div>
        </div>
      )}

      {/* ---------- AI Suggestions Tab (PREVIEW MODE) ---------- */}
      {tabValue === "AI Suggestions" && (
        <div className="p-6 bg-white rounded-2xl border shadow-sm flex flex-col items-center text-center space-y-5">
          <Sparkles size={32} className="text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            Let AI Design Your Perfect Resume Theme ✨
          </h2>
          <p className="text-sm text-gray-600 max-w-md">
            AI will suggest colors, fonts, and layout for your resume. You can preview the result
            before applying it.
          </p>

          <button
            onClick={handleAIThemePreview}
            disabled={isAIProcessing}
            className="mt-3 flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition"
          >
            {isAIProcessing ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {isAIProcessing ? "AI is thinking..." : "Preview AI Suggested Theme"}
          </button>

          {aiSuggestedTheme && (
            <div className="mt-6 w-full max-w-4xl space-y-4">
              <h3 className="font-semibold text-gray-700">🔮 AI Suggested Theme Preview</h3>
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <RenderResume
                  templateId={selectedTemplate.theme}
                  resumeData={resumeData || DUMMY_RESUME_DATA}
                  containerWidth={baseWidth}
                  themeConfig={aiSuggestedTheme}
                />
              </div>

              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => {
                    setThemeConfig(aiSuggestedTheme);
                    setAiSuggestedTheme(null);
                    toast.success("✨ AI theme applied successfully!");
                  }}
                  className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
                >
                  ✅ Apply This Theme
                </button>
                <button
                  onClick={() => setAiSuggestedTheme(null)}
                  className="bg-gray-200 text-gray-800 px-5 py-2 rounded-xl hover:bg-gray-300 transition"
                >
                  ❌ Discard
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
