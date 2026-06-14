import React, { useState, useEffect } from "react";
import { Sparkles, Loader2, Check, AlertTriangle, Play, RefreshCw, Eye, History, FileText, ArrowRight } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

/* -------------------- 1. JOB DESCRIPTION MATCH FORM -------------------- */
export const JobMatchForm = ({ resumeId, onApplyAction }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      return toast.error("Please paste a job description first.");
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/ai/match-jd", {
        resumeId,
        jobDescription
      });
      if (res.data && res.data.success) {
        setResults(res.data);
        toast.success("🎯 JD analysis completed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Job Match analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_#000]">
        <h2 className="text-sm font-black uppercase tracking-wider mb-2">🎯 Job Description Match</h2>
        <p className="text-[11px] text-slate-500 mb-4">
          Paste the target job description below to scan for keyword alignment, missing skills, and get optimization suggestions.
        </p>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste Job Description here..."
          className="w-full h-32 p-3 border-2 border-black bg-slate-50 font-mono text-[11px] text-black focus:outline-none focus:bg-white resize-y"
        />

        <button
          onClick={handleMatch}
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-[#ffe17c] text-black font-black uppercase text-xs border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#000] disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={14} /> Scanning Resume & JD...
            </>
          ) : (
            <>
              <Sparkles size={14} /> Scan & Align Resume
            </>
          )}
        </button>
      </div>

      {results && (
        <div className="space-y-4">
          {/* Main Score Widget */}
          <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_#000]">
            <h3 className="text-xs font-black uppercase tracking-wider mb-3">Analysis Match Scores</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-[#ffe17c]/20 border-2 border-black p-3 rounded-none shadow-[2px_2px_0px_#000]">
                <div className="text-xl font-black text-black">{results.matchScore}%</div>
                <div className="text-[8px] font-black uppercase tracking-wider text-slate-500 mt-1">Overall Match</div>
              </div>
              <div className="bg-slate-50 border-2 border-black p-3 rounded-none shadow-[2px_2px_0px_#000]">
                <div className="text-base font-black text-black">{results.keywordMatch}%</div>
                <div className="text-[8px] font-black uppercase tracking-wider text-slate-500 mt-1">Keywords</div>
              </div>
              <div className="bg-slate-50 border-2 border-black p-3 rounded-none shadow-[2px_2px_0px_#000]">
                <div className="text-base font-black text-black">{results.skillsMatch}%</div>
                <div className="text-[8px] font-black uppercase tracking-wider text-slate-500 mt-1">Skills</div>
              </div>
              <div className="bg-slate-50 border-2 border-black p-3 rounded-none shadow-[2px_2px_0px_#000]">
                <div className="text-base font-black text-black">{results.experienceMatch}%</div>
                <div className="text-[8px] font-black uppercase tracking-wider text-slate-500 mt-1">Experience</div>
              </div>
            </div>
          </div>

          {/* Keywords Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_#000]">
              <h4 className="text-xs font-black uppercase tracking-wider text-green-700 mb-2">Matched Keywords</h4>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {results.matchedKeywords?.length > 0 ? (
                  results.matchedKeywords.map((kw, i) => (
                    <span key={i} className="text-[9px] bg-green-50 text-green-700 font-bold border border-green-300 px-2 py-0.5">
                      ✓ {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-400 italic">No direct keyword matches found.</span>
                )}
              </div>
            </div>

            <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_#000]">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 mb-2">Missing Keywords</h4>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {results.missingKeywords?.length > 0 ? (
                  results.missingKeywords.map((kw, i) => (
                    <span key={i} className="text-[9px] bg-amber-50 text-amber-800 font-bold border border-amber-300 px-2 py-0.5">
                      ⚠ {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-green-600 italic">Excellent! No major missing keywords.</span>
                )}
              </div>
            </div>
          </div>

          {/* Actionable Suggestions */}
          <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_#000]">
            <h3 className="text-xs font-black uppercase tracking-wider mb-3">AI Match Suggestions</h3>
            <div className="space-y-3">
              {results.suggestions?.map((sug, i) => (
                <div key={i} className="p-3 border border-black bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex-1">
                    <p className="text-[11px] leading-relaxed text-slate-700 font-medium">{sug.text}</p>
                  </div>
                  <button
                    onClick={() => onApplyAction(sug.action)}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-black text-white hover:bg-neutral-800 border border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_#ffe17c] active:translate-y-[1px] active:shadow-[1px_1px_0px_#ffe17c] transition-all cursor-pointer"
                  >
                    <Check size={10} /> Apply Suggestion
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


/* -------------------- 2. AI RESUME REVIEW FORM -------------------- */
export const ResumeReviewForm = ({ resumeId, onApplyAction }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [ignoredIds, setIgnoredIds] = useState(new Set());

  const handleReview = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/ai/review", { resumeId });
      if (res.data && res.data.success) {
        setResults(res.data);
        setIgnoredIds(new Set()); // Reset ignores
        toast.success("🕵️ Resume audit completed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Resume Review audit failed.");
    } finally {
      setLoading(false);
    }
  };

  const ignoreSuggestion = (id) => {
    setIgnoredIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    toast.success("Suggestion ignored.");
  };

  const filteredSuggestions = results?.suggestions?.filter(sug => !ignoredIds.has(sug.id)) || [];

  return (
    <div className="space-y-6">
      <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_#000] text-center">
        <h2 className="text-sm font-black uppercase tracking-wider text-left mb-2">🕵️ AI Resume Reviewer</h2>
        <p className="text-[11px] text-slate-500 text-left mb-4">
          Analyze your resume structure, content strength, key metrics, and ATS compatibility across a complete audit checklist.
        </p>

        <button
          onClick={handleReview}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#ffe17c] text-black border-2 border-black font-black uppercase text-xs shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#000] disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={14} /> Analyzing Resume Layout & Verbs...
            </>
          ) : (
            <>
              <Play size={14} /> Audit My Resume
            </>
          )}
        </button>
      </div>

      {results && (
        <div className="space-y-4">
          {/* Audit Metrics */}
          <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_#000]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
              <h3 className="text-xs font-black uppercase tracking-wider">Audit Result Score</h3>
              <span className="text-lg font-black text-[#171e19]">{results.overallScore}/100</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(results.categories || {}).map(([key, val]) => (
                <div key={key} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                    <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span>{val}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 border border-slate-300">
                    <div className="h-full bg-slate-800" style={{ width: `${val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Audit Issues */}
          <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_#000]">
            <h3 className="text-xs font-black uppercase tracking-wider mb-3">Audit Flags & Recommendations</h3>
            {filteredSuggestions.length > 0 ? (
              <div className="space-y-3.5">
                {filteredSuggestions.map((sug, i) => (
                  <div key={i} className="p-3 border-2 border-black bg-slate-50 flex flex-col gap-2 shadow-[2px_2px_0px_#000]">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-start gap-1.5">
                        <AlertTriangle className="text-amber-500 mt-0.5 flex-shrink-0" size={12} />
                        <span className="text-[11px] leading-relaxed text-slate-700 font-medium">{sug.text}</span>
                      </div>
                      <span className="text-[8px] bg-slate-200 text-slate-700 px-1 py-0.5 border border-slate-350 font-black uppercase tracking-wider flex-shrink-0">
                        {sug.section}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-1 border-t border-dashed border-slate-300 pt-2">
                      <button
                        onClick={() => onApplyAction(sug.action)}
                        className="px-2 py-1 bg-black text-white hover:bg-neutral-800 text-[9px] font-black uppercase border border-black shadow-[1.5px_1.5px_0px_#ffe17c] active:translate-y-[0.5px] cursor-pointer"
                      >
                        Apply Suggestion
                      </button>
                      <button
                        onClick={() => ignoreSuggestion(sug.id)}
                        className="px-2 py-1 bg-white text-slate-650 hover:bg-slate-100 hover:text-black text-[9px] font-black uppercase border border-black shadow-[1.5px_1.5px_0px_#000] cursor-pointer"
                      >
                        Ignore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-green-700 italic">No pending optimization recommendations remaining.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


/* -------------------- 3. SNAPSHOTS & DIFFS FORM -------------------- */
export const SnapshotsForm = ({ resumeId, resumeData, themeConfig, onRestoreResume }) => {
  const [snapshots, setSnapshots] = useState([]);
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCompare, setActiveCompare] = useState({ idA: "", idB: "" });
  const [diffResults, setDiffResults] = useState(null);

  // Load snapshots history
  const loadSnapshots = async () => {
    try {
      const res = await axiosInstance.get(`/api/resume/${resumeId}/versions`);
      if (res.data && res.data.success) {
        setSnapshots(res.data.versions);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (resumeId) loadSnapshots();
  }, [resumeId]);

  const handleCreateSnapshot = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/resume/versions", {
        resumeId,
        label: label.trim() || `Save version (${new Date().toLocaleTimeString()})`
      });
      if (res.data && res.data.success) {
        toast.success("⏱️ Version snapshot saved successfully!");
        setLabel("");
        loadSnapshots();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save snapshot version.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (versionId) => {
    if (!window.confirm("Are you sure you want to restore your resume to this state? All unsaved current changes will be overwritten.")) return;
    try {
      const res = await axiosInstance.post("/api/resume/versions/restore", {
        resumeId,
        versionId
      });
      if (res.data && res.data.success) {
        toast.success("Resume state restored!");
        if (onRestoreResume) {
          onRestoreResume(res.data.resume);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to restore snapshot.");
    }
  };

  const handleCompare = async () => {
    const { idA, idB } = activeCompare;
    if (!idA || !idB) {
      return toast.error("Please select two versions to compare.");
    }
    if (idA === idB) {
      return toast.error("Please select different versions to compare.");
    }

    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/resume/versions/compare?resumeId=${resumeId}&versionAId=${idA}&versionBId=${idB}`);
      if (res.data && res.data.success) {
        setDiffResults(res.data.comparison);
        toast.success("Diff comparison computed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Diff comparison failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create snapshot */}
      <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_#000]">
        <h2 className="text-sm font-black uppercase tracking-wider mb-2">⏱️ Save Version Snapshot</h2>
        <p className="text-[11px] text-slate-500 mb-4">
          Save your current resume data and styling preset to snapshot history so you can roll back or review diffs later.
        </p>

        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label (e.g. Add Docker, Before JD match...)"
          className="w-full p-2.5 border-2 border-black bg-slate-50 text-xs font-bold text-black focus:outline-none focus:bg-white"
        />

        <button
          onClick={handleCreateSnapshot}
          disabled={loading}
          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ffe17c] text-black border-2 border-black font-black uppercase text-xs shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] cursor-pointer"
        >
          {loading ? "Creating Snapshot..." : "Create Snapshot"}
        </button>
      </div>

      {/* Snapshot list */}
      <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_#000]">
        <h3 className="text-xs font-black uppercase tracking-wider mb-3">Snapshots History</h3>
        {snapshots.length > 0 ? (
          <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
            {snapshots.map((snap) => (
              <div key={snap._id} className="p-2.5 border border-black bg-slate-50 flex justify-between items-center gap-2">
                <div>
                  <div className="text-[11px] font-black text-slate-800">{snap.label}</div>
                  <div className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">
                    Ver: {snap.versionNumber} | {new Date(snap.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleRestore(snap._id)}
                    className="px-2 py-1 bg-black text-white hover:bg-neutral-800 text-[9px] font-black uppercase border border-black cursor-pointer"
                  >
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-slate-400 italic">No saved versions found. Create one above!</p>
        )}
      </div>

      {/* Compare Panel */}
      {snapshots.length >= 2 && (
        <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_#000]">
          <h3 className="text-xs font-black uppercase tracking-wider mb-3">Compare Snapshots</h3>
          <div className="flex flex-col sm:flex-row gap-3 items-center mb-3">
            <select
              value={activeCompare.idA}
              onChange={(e) => setActiveCompare(prev => ({ ...prev, idA: e.target.value }))}
              className="w-full p-2 border-2 border-black bg-slate-50 text-[10px] font-bold"
            >
              <option value="">Select Base Version</option>
              {snapshots.map(s => (
                <option key={s._id} value={s._id}>Ver {s.versionNumber}: {s.label}</option>
              ))}
            </select>
            <ArrowRight size={16} className="text-slate-400 flex-shrink-0" />
            <select
              value={activeCompare.idB}
              onChange={(e) => setActiveCompare(prev => ({ ...prev, idB: e.target.value }))}
              className="w-full p-2 border-2 border-black bg-slate-50 text-[10px] font-bold"
            >
              <option value="">Select Target Version</option>
              {snapshots.map(s => (
                <option key={s._id} value={s._id}>Ver {s.versionNumber}: {s.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCompare}
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-black text-white border-2 border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_#ffe17c] cursor-pointer"
          >
            <History size={11} /> Compare & View Diffs
          </button>
        </div>
      )}

      {/* Diff Output */}
      {diffResults && (
        <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_#000] space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">Comparison Diffs</h3>
            <span className="text-[9px] font-bold bg-[#ffe17c] border border-black px-1.5 py-0.5">
              Ver {diffResults.versionA?.number} ➔ Ver {diffResults.versionB?.number}
            </span>
          </div>

          {/* Summary Diff */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase text-slate-500">Summary Comparison</h4>
            <div className="p-3 border border-black bg-slate-50 text-[11px] leading-relaxed">
              {diffResults.diff?.summary?.oldVal === diffResults.diff?.summary?.newVal ? (
                <span className="text-slate-500 italic">No summary changes detected.</span>
              ) : (
                <div className="space-y-2">
                  <div className="text-red-650 bg-red-50 p-1.5 border border-red-200">
                    <span className="font-bold">- OLD:</span> {diffResults.diff.summary.oldVal}
                  </div>
                  <div className="text-green-700 bg-green-50 p-1.5 border border-green-200">
                    <span className="font-bold">+ NEW:</span> {diffResults.diff.summary.newVal}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Skills Diff */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase text-slate-500">Skills Diffs</h4>
            <div className="p-3 border border-black bg-slate-50 text-[10px] leading-relaxed">
              {diffResults.diff?.skills?.added?.length === 0 && diffResults.diff?.skills?.removed?.length === 0 ? (
                <span className="text-slate-500 italic">No skill additions or deletions.</span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {diffResults.diff?.skills?.removed?.map((s, i) => (
                    <span key={i} className="bg-red-50 text-red-700 border border-red-250 px-1.5 py-0.5 font-bold">
                      - {s}
                    </span>
                  ))}
                  {diffResults.diff?.skills?.added?.map((s, i) => (
                    <span key={i} className="bg-green-50 text-green-700 border border-green-250 px-1.5 py-0.5 font-bold">
                      + {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Work Exp Diff */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase text-slate-500">Experience Diffs</h4>
            <div className="space-y-2">
              {diffResults.diff?.experience?.length > 0 ? (
                diffResults.diff.experience.map((exp, i) => (
                  <div key={i} className="p-2.5 border border-slate-300 bg-slate-50 text-[10px] space-y-1.5">
                    <div className="font-black text-slate-800 border-b border-dashed border-slate-300 pb-1">
                      {exp.role} at {exp.company} (Index {exp.index + 1})
                    </div>
                    <div className="text-red-605">
                      <span className="font-black text-red-700">Removed:</span> {exp.oldDesc}
                    </div>
                    <div className="text-green-650">
                      <span className="font-black text-green-700">Added:</span> {exp.newDesc}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-slate-450 italic">No experience description edits found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
