import { LayoutTemplate, Sun, Moon } from "lucide-react";
import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ProfileInfoCard } from "./Cards";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useContext(UserContext);

  // Detect scroll for enhanced effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`h-16 sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/80 dark:bg-[#0f172a]/85 backdrop-blur-xl border-b border-violet-200/50 dark:border-slate-800 shadow-lg shadow-violet-100/20 dark:shadow-none"
          : "bg-white/60 dark:bg-[#0f172a]/65 backdrop-blur-lg border-b border-violet-100/30 dark:border-slate-900"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-5 h-full px-4 md:px-6">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 group transition-all duration-300"
        >
          {/* Icon Container with Glow */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative w-10 h-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-fuchsia-200/40 group-hover:scale-110 transition-transform duration-300">
              <LayoutTemplate className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Logo Text */}
          <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent tracking-tight group-hover:from-fuchsia-600 group-hover:to-violet-500 transition-all duration-500">
            ResumeRocket
          </span>
        </Link>

        {/* Right Profile Info & Theme Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
            title="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <ProfileInfoCard />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
