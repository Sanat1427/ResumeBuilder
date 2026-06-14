import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  LayoutTemplate,
  Menu,
  X,
  Zap,
  Download,
  Sparkles,
  CheckCircle,
  Star,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Terminal,
  MousePointerClick
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../context/UserContext";
import { ProfileInfoCard } from "../components/Cards";
import Modal from "../components/Modal";
import Login from "../components/Login";
import Signup from "../components/Signup";
import resumePreviewImg from "../assets/resume-preview.png";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const [rewriteState, setRewriteState] = useState("before"); // before -> rewriting -> after

  const handleCTA = () => {
    if (!user) setOpenAuthModal(true);
    else navigate("/dashboard");
  };

  // Trigger auto-rewriting demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      setRewriteState((prev) => {
        if (prev === "before") return "rewriting";
        if (prev === "rewriting") return "after";
        return "before";
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const marqueeRoles = [
    "Software Engineers",
    "Students",
    "Product Managers",
    "Designers",
    "Freshers",
    "Consultants",
    "Software Engineers",
    "Students",
    "Product Managers",
    "Designers",
    "Freshers",
    "Consultants",
  ];

  return (
    <div className="min-h-screen bg-[#171e19] text-white flex flex-col relative font-sans selection:bg-[#ffe17c] selection:text-black">
      {/* Decorative Neo-Brutalist Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#171e19] border-b-3 border-black px-6 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 bg-[#ffe17c] border-2 border-black flex items-center justify-center neo-shadow-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[2px_2px_0px_#000] transition-all">
            <LayoutTemplate className="w-5 h-5 text-black" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#ffffff]">
            Resume<span className="text-[#ffe17c]">Rocket</span>
          </span>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          className="md:hidden p-2 border-2 border-black bg-white text-black neo-shadow-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_#000] transition-all"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#templates" className="font-extrabold hover:text-[#ffe17c] transition-colors text-sm uppercase tracking-wide">
            Templates
          </a>
          <a href="#features" className="font-extrabold hover:text-[#ffe17c] transition-colors text-sm uppercase tracking-wide">
            Features
          </a>
          <a href="#how-it-works" className="font-extrabold hover:text-[#ffe17c] transition-colors text-sm uppercase tracking-wide">
            How It Works
          </a>

          {user ? (
            <ProfileInfoCard />
          ) : (
            <button
              onClick={handleCTA}
              className="neo-btn-primary"
            >
              Get Started
            </button>
          )}
        </div>
      </header>

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#171e19] border-b-3 border-black text-white py-6 px-6 flex flex-col gap-4 relative z-40"
          >
            <a href="#templates" onClick={() => setMobileMenuOpen(false)} className="font-extrabold text-lg">Templates</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="font-extrabold text-lg">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="font-extrabold text-lg">How It Works</a>
            
            {user ? (
              <button
                className="w-full text-center py-3 border-2 border-white font-bold rounded-none"
                onClick={() => {
                  navigate("/dashboard");
                  setMobileMenuOpen(false);
                }}
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                className="w-full neo-btn-primary"
                onClick={() => {
                  handleCTA();
                  setMobileMenuOpen(false);
                }}
              >
                Get Started
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-6 md:px-16 lg:px-24 py-16 lg:py-24 gap-12 relative z-10 max-w-7xl mx-auto w-full">
        {/* HERO LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 text-center lg:text-left max-w-2xl"
        >
          <div className="inline-flex self-center lg:self-start items-center gap-2 px-3 py-1.5 bg-[#b7c6c2] text-[#171e19] font-black uppercase text-xs tracking-wider border-2 border-black neo-shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> AI resume writer
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] text-white">
            Build a Resume <br className="hidden md:block"/>
            That Gets <span className="bg-[#ffe17c] text-black px-3 py-1 inline-block rotate-[-2deg] border-2 border-black my-1">Interviews.</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-lg mx-auto lg:mx-0 font-bold leading-relaxed">
            Create ATS-friendly resumes, improve them with AI, and export professional PDFs in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-6 justify-center lg:justify-start mt-8 w-full sm:w-auto">
            {/* Primary CTA with Badge */}
            <div className="relative flex flex-col items-start w-full sm:w-auto">
              <div className="absolute -top-3.5 left-4 bg-white text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 border border-black shadow-[2px_2px_0px_#000] z-10">
                Most Popular
              </div>
              <motion.button
                onClick={handleCTA}
                className="w-full sm:w-auto min-w-[220px] bg-[#ffe17c] text-black border-2 border-black rounded-[12px] px-8 py-[18px] font-black text-lg uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-[8px_8px_0px_#000]"
                whileHover={{ 
                  x: 4, 
                  y: 4,
                  boxShadow: "4px 4px 0px #000000"
                }}
                whileTap={{ 
                  x: 8, 
                  y: 8,
                  boxShadow: "0px 0px 0px #000000"
                }}
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  scale: {
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                    repeatDelay: 3
                  }
                }}
              >
                Create Resume Free <ArrowRight className="w-5 h-5 flex-shrink-0" />
              </motion.button>
            </div>

            {/* Secondary CTA */}
            <motion.a
              href="#templates"
              className="w-full sm:w-auto min-w-[220px] bg-white text-black border-2 border-black rounded-[12px] px-8 py-[18px] font-black text-lg uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-[8px_8px_0px_#171e19]"
              whileHover={{ 
                x: 4, 
                y: 4,
                boxShadow: "4px 4px 0px #171e19"
              }}
              whileTap={{ 
                x: 8, 
                y: 8,
                boxShadow: "0px 0px 0px #171e19"
              }}
            >
              Browse Templates <ArrowRight className="w-5 h-5 flex-shrink-0" />
            </motion.a>
          </div>

          {/* Key Stats */}
          <div className="flex flex-wrap gap-8 justify-center lg:justify-start mt-8 pt-6 border-t-2 border-dashed border-white/20">
            <div>
              <div className="text-3xl font-black text-[#ffe17c]">50K+</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-extrabold">Resumes Created</div>
            </div>
            <div>
              <div className="text-3xl font-black text-[#b7c6c2]">98%</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-extrabold">ATS Pass Rate</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">4.9/5</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-extrabold">User Rating</div>
            </div>
          </div>
        </motion.div>

        {/* HERO RIGHT: Interactive Resume Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-1/2 flex justify-center"
        >
          <div className="relative w-full max-w-[460px] bg-white text-black p-6 border-3 border-black neo-shadow-hero transform hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-lg transition-all">
            {/* ATS Badge */}
            <div className="absolute -top-4 -right-4 bg-[#ffe17c] text-black text-xs font-black uppercase tracking-widest px-3 py-1.5 border-2 border-black neo-shadow-sm rotate-[6deg]">
              🛡️ ATS FRIENDLY
            </div>

            {/* Score circle */}
            <div className="flex items-center gap-3 mb-6 bg-[#b7c6c2]/30 border-2 border-black p-3">
              <div className="w-12 h-12 rounded-full border-3 border-black bg-[#ffe17c] flex items-center justify-center font-black text-sm">
                87%
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-wider">RESUME STRENGTH</h4>
                <p className="text-[10px] font-bold text-gray-700">Add certification for 95% score</p>
              </div>
            </div>

            {/* Simulated Live Preview */}
            <div className="space-y-4">
              <div className="border-b-2 border-black pb-2">
                <div className="h-5 bg-black w-2/3 mb-1.5"></div>
                <div className="h-3 bg-gray-400 w-1/2"></div>
              </div>
              <div className="space-y-1.5">
                <div className="h-2 bg-gray-300 w-full"></div>
                <div className="h-2 bg-gray-300 w-full"></div>
                <div className="h-2 bg-gray-300 w-4/5"></div>
              </div>

              {/* AI suggestion overlay box inside Mockup */}
              <div className="border-2 border-black bg-[#ffe17c]/25 p-3 rounded-none relative">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 mb-1">
                  <Sparkles size={12} className="text-black fill-yellow-400" />
                  AI Suggestion
                </div>
                <p className="text-[10px] font-bold text-gray-700 italic">
                  Change "Built website" to "Developed responsive web application..." for 12% higher impact.
                </p>
              </div>

              {/* Education section mockup */}
              <div>
                <div className="h-3.5 bg-black w-1/4 mb-1.5"></div>
                <div className="h-2 bg-gray-300 w-1/2"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SOCIAL PROOF MARQUEE */}
      <section className="bg-black py-4 border-y-3 border-black overflow-hidden relative w-full">
        <div className="animate-marquee flex gap-8 items-center">
          {marqueeRoles.map((role, idx) => (
            <React.Fragment key={idx}>
              <span className="text-[#ffe17c] font-black text-xl md:text-2xl uppercase tracking-wider flex items-center gap-3">
                <Zap className="fill-[#ffe17c] w-5 h-5 text-black" /> {role}
              </span>
              <span className="text-white/30 font-black text-xl">•</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* PROBLEM VS SOLUTION SECTION */}
      <section className="py-20 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
            Stop Getting <span className="bg-[#b7c6c2] text-black px-2.5 py-0.5 border-2 border-black inline-block rotate-[-1deg]">Rejected</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base font-bold mt-3 max-w-lg mx-auto">
            Traditional resume builders output generic layouts that fail ATS parser software. Here is how we fix it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {/* Problem Card */}
          <div className="bg-[#1e2720] border-3 border-black p-8 neo-shadow-lg transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-sm transition-all">
            <div className="w-12 h-12 bg-red-400 border-2 border-black flex items-center justify-center mb-6">
              <AlertCircle className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-2xl font-black uppercase text-red-400 mb-6">The Old Way</h3>
            <ul className="space-y-4">
              {[
                "ATS Rejections from unreadable designs",
                "Generic Templates that look like everyone else's",
                "Poor Formatting and awkward column wrapping",
                "Low Interview Rate from weak bullet descriptions",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300 font-bold text-sm">
                  <span className="text-red-400 font-black">✕</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Solution Card */}
          <div className="bg-white text-black border-3 border-black p-8 neo-shadow-lg transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-sm transition-all">
            <div className="w-12 h-12 bg-[#ffe17c] border-2 border-black flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-2xl font-black uppercase text-black mb-6">Rocket Way</h3>
            <ul className="space-y-4">
              {[
                "ATS Optimized layouts that pass parsers 100%",
                "AI Enhanced content generated specifically for roles",
                "Modern Templates built with responsive styles",
                "Professional Layouts to impress top tier hiring teams",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-800 font-bold text-sm">
                  <span className="text-green-600 font-black">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section id="features" className="bg-[#b7c6c2] text-black py-20 px-6 md:px-16 lg:px-24 border-y-3 border-black w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              Powerful <span className="bg-white border-2 border-black px-2.5 py-0.5 inline-block rotate-[1.5deg]">Features</span>
            </h2>
            <p className="text-gray-800 font-bold text-sm md:text-base mt-3 max-w-lg mx-auto">
              Everything you need to craft high-impact resumes and land your next role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI Resume Builder",
                desc: "Describe your experience in simple sentences and let our AI expand them into high-performing bullet points.",
                icon: <Sparkles className="w-6 h-6" />,
                color: "bg-[#ffe17c]",
              },
              {
                title: "ATS Checker",
                desc: "Instantly scan your resume against standard ATS rules to catch parsing blockers and improve keyword ratios.",
                icon: <ShieldCheck className="w-6 h-6" />,
                color: "bg-white",
              },
              {
                title: "Resume Scoring",
                desc: "Get an interactive score based on depth of sections, summary length, skills coverage, and layout choices.",
                icon: <Zap className="w-6 h-6" />,
                color: "bg-orange-300",
              },
              {
                title: "Live Preview",
                desc: "Watch your changes render in real-time as you write. No loading spinners, no page refreshes.",
                icon: <LayoutTemplate className="w-6 h-6" />,
                color: "bg-sky-300",
              },
              {
                title: "Multiple Templates",
                desc: "Choose from Modern, Professional, Minimal, and Developer templates configured for readability.",
                icon: <Star className="w-6 h-6" />,
                color: "bg-rose-300",
              },
              {
                title: "One Click Export",
                desc: "Download cleanly compiled, standard PDF files ready for uploading straight to job portals.",
                icon: <Download className="w-6 h-6" />,
                color: "bg-emerald-300",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white border-3 border-black p-6 neo-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all"
              >
                <div className={`w-12 h-12 border-2 border-black flex items-center justify-center mb-4 ${f.color} neo-shadow-sm`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-black uppercase mb-2">{f.title}</h3>
                <p className="text-xs text-gray-700 font-bold leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
            How It <span className="bg-[#ffe17c] text-black px-2.5 py-0.5 border-2 border-black inline-block rotate-[-1.5deg]">Works</span>
          </h2>
          <p className="text-slate-400 font-bold text-sm md:text-base mt-3">
            Build your professional resume in 3 straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Choose Template",
              desc: "Select a layout (Modern, Developer, etc.) optimized for your sector.",
            },
            {
              step: "02",
              title: "Add Information",
              desc: "Enter details or generate bullet points using the integrated AI assistant.",
            },
            {
              step: "03",
              title: "Export & Apply",
              desc: "Download high-definition PDF files and start booking interviews.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#1e2720] border-3 border-black p-8 relative neo-shadow-lg"
            >
              <div className="absolute top-4 right-4 text-4xl font-black text-[#ffe17c]/30">
                {item.step}
              </div>
              <h3 className="text-xl font-black uppercase text-[#ffe17c] mb-3">{item.title}</h3>
              <p className="text-xs text-slate-300 font-bold leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEMPLATE SHOWCASE */}
      <section id="templates" className="bg-[#171e19] border-t-3 border-black py-20 px-6 md:px-16 lg:px-24 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              Premium <span className="bg-[#ffe17c] text-black px-2.5 py-0.5 border-2 border-black inline-block rotate-[1deg]">Templates</span>
            </h2>
            <p className="text-slate-400 font-bold text-sm md:text-base mt-3">
              Real, tested templates that look premium and read beautifully.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Modern Template",
                tag: "Modern",
                desc: "Two-column design optimized for maximum info density.",
                layout: (
                  <div className="flex gap-2 h-full">
                    <div className="w-1/3 bg-gray-200 border-r border-black p-1.5 space-y-2">
                      <div className="w-6 h-6 rounded-full bg-black"></div>
                      <div className="h-1 bg-black w-full"></div>
                      <div className="h-1 bg-gray-400 w-3/4"></div>
                    </div>
                    <div className="w-2/3 p-1.5 space-y-2">
                      <div className="h-2 bg-black w-1/2"></div>
                      <div className="h-1 bg-gray-400 w-full"></div>
                      <div className="h-1 bg-gray-400 w-full"></div>
                    </div>
                  </div>
                ),
              },
              {
                name: "Professional Template",
                tag: "Professional",
                desc: "Standard single-column layout preferred by formal industries.",
                layout: (
                  <div className="p-3 space-y-3 h-full">
                    <div className="flex flex-col items-center border-b pb-1">
                      <div className="h-3 bg-black w-1/3 mb-1"></div>
                      <div className="h-1.5 bg-gray-400 w-1/2"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-black w-1/4"></div>
                      <div className="h-1 bg-gray-300 w-full"></div>
                      <div className="h-1 bg-gray-300 w-4/5"></div>
                    </div>
                  </div>
                ),
              },
              {
                name: "Minimal Template",
                tag: "Minimal",
                desc: "Clean typography with spacious borders and minimal lines.",
                layout: (
                  <div className="p-3 space-y-2 h-full">
                    <div className="h-4 bg-gray-300 w-1/4"></div>
                    <div className="h-1 bg-gray-300 w-3/4"></div>
                    <div className="h-1.5 bg-black w-1/3 mt-4"></div>
                    <div className="h-1.5 bg-gray-300 w-5/6"></div>
                  </div>
                ),
              },
              {
                name: "Developer Template",
                tag: "Developer",
                desc: "Includes bold skill-badges and code layout architecture.",
                layout: (
                  <div className="p-3 space-y-3 h-full">
                    <div className="h-3 bg-black w-1/2"></div>
                    <div className="flex gap-1">
                      {["React", "Node", "SQL"].map((t, idx) => (
                        <span key={idx} className="text-[6px] font-bold border border-black px-1 py-0.5 bg-[#ffe17c]">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <div className="h-1 bg-gray-300 w-full"></div>
                      <div className="h-1 bg-gray-300 w-5/6"></div>
                    </div>
                  </div>
                ),
              },
              {
                name: "Executive Template",
                tag: "Executive",
                desc: "Elegant layout styled for leadership and management positions.",
                layout: (
                  <div className="p-3 space-y-2.5 h-full border-l-4 border-black">
                    <div className="h-3 bg-black w-2/3"></div>
                    <div className="h-1.5 bg-gray-500 w-1/3"></div>
                    <div className="space-y-1.5 mt-2">
                      <div className="h-1 bg-gray-300 w-full"></div>
                      <div className="h-1 bg-gray-300 w-11/12"></div>
                    </div>
                  </div>
                ),
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white text-black border-3 border-black p-4 neo-shadow-sm flex flex-col justify-between hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all"
              >
                <div>
                  <div className="w-full h-40 border-2 border-black bg-slate-50 mb-4 overflow-hidden">
                    {t.layout}
                  </div>
                  <h3 className="font-black text-lg uppercase mb-1">{t.name}</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border border-black bg-[#b7c6c2] inline-block mb-2">
                    {t.tag}
                  </span>
                  <p className="text-xs text-gray-600 font-bold">{t.desc}</p>
                </div>
                <button
                  onClick={handleCTA}
                  className="w-full mt-4 py-2 border-2 border-black bg-[#ffe17c] text-black font-black text-xs uppercase hover:bg-yellow-400 transition"
                >
                  Choose Template
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI REWRITE DEMO */}
      <section className="bg-[#b7c6c2] text-black py-20 px-6 md:px-16 lg:px-24 border-y-3 border-black w-full">
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12">
          {/* Demo Left */}
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-black uppercase leading-tight">
              Upgrade Your <br />
              Bullet Points <br />
              With <span className="bg-white border-2 border-black px-2.5 py-0.5 inline-block rotate-[-1.5deg]">AI Spark</span>
            </h2>
            <p className="text-gray-800 font-bold max-w-md mx-auto lg:mx-0">
              Transform weak descriptions into impact-focused, data-driven achievements instantly.
            </p>
            <div className="flex justify-center lg:justify-start">
              <button
                onClick={handleCTA}
                className="neo-btn-primary"
              >
                Try AI Optimization
              </button>
            </div>
          </div>

          {/* Demo Right: Interactive rewrite cards */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4 max-w-[500px] mx-auto">
            {/* Input Card */}
            <div className="bg-[#171e19] text-white border-2 border-black p-4 neo-shadow-sm relative">
              <span className="absolute top-2 right-2 text-[10px] font-black uppercase text-red-400 tracking-wider">
                Weak (Draft)
              </span>
              <h4 className="font-extrabold text-xs uppercase text-[#ffe17c] mb-1">User Input</h4>
              <p className="text-sm font-bold text-slate-300 italic">"Built a website"</p>
            </div>

            {/* Animation Connector Arrow */}
            <div className="flex justify-center">
              <motion.div
                animate={{
                  y: [0, 5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                }}
                className="bg-black text-[#ffe17c] border-2 border-black px-3 py-1 font-black text-xs uppercase"
              >
                {rewriteState === "before" && "Preparing AI..."}
                {rewriteState === "rewriting" && "Optimizing..."}
                {rewriteState === "after" && "Optimized! ✨"}
              </motion.div>
            </div>

            {/* Output Card */}
            <div className="bg-white text-black border-3 border-black p-4 neo-shadow-sm relative overflow-hidden">
              <span className="absolute top-2 right-2 text-[10px] font-black uppercase text-emerald-600 tracking-wider">
                Strong (AI Output)
              </span>
              <h4 className="font-extrabold text-xs uppercase text-slate-800 mb-1">ATS Friendly</h4>
              <p className="text-sm font-black text-gray-800 leading-snug">
                {rewriteState === "before" && "..."}
                {rewriteState === "rewriting" && "Writing bullet point..."}
                {rewriteState === "after" && "Developed a responsive web application serving 1,000+ monthly users using React and Node.js."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 md:px-16 bg-[#171e19] text-center relative overflow-hidden border-b-3 border-black w-full">
        <div className="max-w-3xl mx-auto relative z-10 space-y-8">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            Your Next Interview <br />
            Starts With a <span className="bg-[#ffe17c] text-black px-3 py-1 inline-block rotate-[1.5deg] border-2 border-black">Better Resume.</span>
          </h2>
          <p className="text-slate-300 font-bold text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Join thousands of applicants landing job interviews at major software and tech corporations.
          </p>
          <div className="flex justify-center pt-2">
            <button
              onClick={handleCTA}
              className="neo-btn-primary text-lg px-10 py-5"
            >
              Build Resume Free <ArrowRight className="ml-2 w-5 h-5 inline" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 bg-black text-slate-400 border-t-2 border-black">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ffe17c] border border-black flex items-center justify-center">
              <LayoutTemplate className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              Resume<span className="text-[#ffe17c]">Rocket</span>
            </span>
          </div>

          <div className="flex gap-8 text-xs uppercase tracking-widest font-black">
            <a href="#templates" className="hover:text-[#ffe17c] transition-colors">Templates</a>
            <a href="#features" className="hover:text-[#ffe17c] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#ffe17c] transition-colors">How It Works</a>
          </div>

          <div className="text-xs font-bold text-slate-500">
            © {new Date().getFullYear()} ResumeRocket — Built with ⚡ by{" "}
            <span className="font-extrabold text-[#ffe17c]">SANAT</span>
          </div>
        </div>
      </footer>

      {/* AUTH MODAL */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
        {currentPage === "signup" && <Signup setCurrentPage={setCurrentPage} />}
      </Modal>
    </div>
  );
};

export default LandingPage;
