import { LayoutTemplate } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ProfileInfoCard } from "./Cards";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Detect scroll for subtle shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`h-16 sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/20 backdrop-blur-xl border-b border-white/10 shadow-md shadow-fuchsia-500/5"
          : "bg-white/10 backdrop-blur-xl border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-5 h-full px-4 md:px-6">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 group transition-all duration-300"
        >
          {/* Icon Container with Glow */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 blur-lg opacity-40 group-hover:opacity-60 transition"></div>
            <div className="relative w-10 h-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-fuchsia-200/30 group-hover:scale-105 transition-transform duration-300">
              <LayoutTemplate className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Logo Text */}
          <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent tracking-tight group-hover:from-fuchsia-500 group-hover:to-violet-400 transition-all duration-500">
            ResumeRocket
          </span>
        </Link>

        {/* Right Profile Info */}
        <div className="flex items-center gap-4">
          {/* Optional nav links (if you want later) */}
          {/* <Link
            to="/dashboard"
            className={`hidden sm:block text-sm font-medium transition-all ${
              location.pathname === "/dashboard"
                ? "text-fuchsia-500"
                : "text-gray-200 hover:text-fuchsia-400"
            }`}
          >
            Dashboard
          </Link> */}

          <ProfileInfoCard />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
