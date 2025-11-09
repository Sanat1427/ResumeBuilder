import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  LayoutTemplate,
  Menu,
  X,
  Zap,
  Download,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserContext";
import { ProfileInfoCard } from "../components/Cards";
import Modal from "../components/Modal";
import Login from "../components/Login";
import Signup from "../components/Signup";
import resumePreview from "../assets/resume-preview.png";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) setOpenAuthModal(true);
    else navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 text-white overflow-hidden relative">
      {/* Glowing Background Elements */}
      <div className="absolute top-[-200px] right-[-100px] w-[400px] h-[400px] bg-cyan-400/30 blur-[160px] rounded-full"></div>
      <div className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] bg-indigo-500/40 blur-[200px] rounded-full"></div>

      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-6 py-4 bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <LayoutTemplate className="w-8 h-8 text-cyan-400" />
          <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent">
            ResumeRocket
          </span>
        </div>

        {/* MOBILE MENU */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* DESKTOP CTA */}
        <div className="hidden md:flex items-center">
          {user ? (
            <ProfileInfoCard />
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCTA}
              className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-indigo-400 text-gray-900 font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Get Started
            </motion.button>
          )}
        </div>
      </header>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-white/10 backdrop-blur-lg text-white py-4 px-6 flex flex-col gap-4 border-t border-white/20"
        >
          {user ? (
            <button
              className="w-full px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
              onClick={() => {
                navigate("/dashboard");
                setMobileMenuOpen(false);
              }}
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              className="w-full px-4 py-2 bg-gradient-to-r from-cyan-400 to-indigo-400 text-gray-900 font-semibold rounded-lg hover:opacity-90 transition"
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

      {/* HERO */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-20 gap-12 relative z-10">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-6 text-center md:text-left max-w-2xl"
        >
          <span className="uppercase text-sm tracking-widest flex items-center justify-center md:justify-start gap-2 text-cyan-300">
            <Sparkles className="w-4 h-4" /> AI-Powered Resume Builder
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Build Your <span className="text-cyan-300">Career-Ready</span> Resume Instantly ⚡
          </h1>
          <p className="text-lg text-gray-300 max-w-lg mx-auto md:mx-0">
            Create stunning, professional resumes in minutes with AI assistance and modern templates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-indigo-400 text-gray-900 rounded-full font-semibold shadow-md hover:shadow-lg transition"
              onClick={handleCTA}
            >
              Start Building <ArrowRight size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 border border-white/40 text-white/90 rounded-full font-semibold hover:bg-white/10 transition"
              onClick={handleCTA}
            >
              Explore Templates
            </motion.button>
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center md:justify-end w-full md:w-1/2"
        >
          <div className="relative group">
            <motion.img
              src={resumePreview}
              alt="Resume Preview"
              className="relative z-10 w-80 sm:w-72 md:w-96 rounded-2xl border border-white/10 shadow-2xl"
              animate={{
                y: [0, -6, 0],
                rotate: [0, -1, 1, 0],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 6,
                ease: "easeInOut",
              }}
            />
            <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold text-white shadow-md border border-white/20">
              ✨ AI-Generated Resume
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 md:px-20 bg-slate-900/70 backdrop-blur-md text-white relative z-10 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
              ResumeRocket
            </span>
          </h2>
          <p className="text-gray-400">
            Experience the power of modern design and AI-driven resume writing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: <Zap className="w-8 h-8 text-white" />,
              title: "Lightning Fast",
              desc: "Generate professional resumes in under 5 minutes.",
              gradient: "from-cyan-400 to-indigo-400",
            },
            {
              icon: <LayoutDashboard className="w-8 h-8 text-white" />,
              title: "Smart Templates",
              desc: "Clean, modern, and ATS-friendly designs for every career.",
              gradient: "from-indigo-500 to-purple-500",
            },
            {
              icon: <Download className="w-8 h-8 text-white" />,
              title: "Instant Export",
              desc: "Download high-quality, print-ready PDFs instantly.",
              gradient: "from-blue-500 to-cyan-400",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-md hover:shadow-xl transition-all"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r ${f.gradient} mb-4`}
              >
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-cyan-400 to-indigo-500 text-gray-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)]" />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your Future?
          </h2>
          <p className="text-lg opacity-80 mb-8">
            Join 50,000+ professionals crafting beautiful resumes today.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition"
            onClick={handleCTA}
          >
            Get Started for Free
          </motion.button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 border-t border-white/10 bg-slate-950 text-gray-400">
        © {new Date().getFullYear()} ResumeRocket — Built with 💙 by{" "}
        <span className="font-semibold text-cyan-400">SANAT</span>
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
