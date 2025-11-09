"use client";
import React, { useEffect, useRef, useState } from "react";
import { LuExternalLink, LuGithub } from "react-icons/lu";
import { formatYearMonth } from "../utils/helper";

const TemplateTwo = ({ resumeData = {}, containerWidth, themeConfig = {} }) => {
  const {
    primaryColor = "#2563eb",
    accentColor = "#60a5fa",
    fontFamily = "'Inter', sans-serif",
  } = themeConfig;

  const {
    profileInfo = {},
    contactInfo = {},
    education = [],
    workExperience = [],
    projects = [],
    skills = [],
    certifications = [],
    languages = [],
    interests = [],
  } = resumeData;

  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (resumeRef.current && containerWidth > 0) {
      const actualWidth = resumeRef.current.offsetWidth;
      setBaseWidth(actualWidth);
      setScale(containerWidth / actualWidth);
    }
  }, [containerWidth]);

  const sectionTitle = {
    color: primaryColor,
    borderBottom: `2px solid ${accentColor}`,
  };

  return (
    <div
      ref={resumeRef}
      className="p-6 bg-white text-black max-w-4xl mx-auto"
      style={{
        transform: containerWidth ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        width: containerWidth ? `${baseWidth}px` : undefined,
        fontFamily,
      }}
    >
      {/* Header */}
      <div className="text-center mb-3">
        <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>
          {profileInfo.fullName}
        </h1>
        <p className="text-sm text-gray-700 mb-2">{profileInfo.designation}</p>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600">
          {contactInfo.email && (
            <a href={`mailto:${contactInfo.email}`} style={{ color: accentColor }}>
              {contactInfo.email}
            </a>
          )}
          {contactInfo.phone && <span>{contactInfo.phone}</span>}
          {contactInfo.linkedin && (
            <a href={contactInfo.linkedin} style={{ color: accentColor }}>
              LinkedIn
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {profileInfo.summary && (
        <section className="mb-3">
          <h2 className="text-sm font-bold uppercase mb-1 pb-1" style={sectionTitle}>
            Summary
          </h2>
          <p className="text-xs text-gray-800 leading-relaxed">
            {profileInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {workExperience.length > 0 && (
        <section className="mb-3">
          <h2 className="text-sm font-bold uppercase mb-1 pb-1" style={sectionTitle}>
            Experience
          </h2>
          {workExperience.map((exp, idx) => (
            <div key={idx} className="mb-2">
              <h3 className="font-semibold text-xs text-gray-800">{exp.role}</h3>
              <p className="text-[11px] italic text-gray-600">
                {exp.company} | {formatYearMonth(exp.startDate)} -{" "}
                {formatYearMonth(exp.endDate)}
              </p>
              <p className="text-xs text-gray-700 mt-1">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-3">
          <h2 className="text-sm font-bold uppercase mb-1 pb-1" style={sectionTitle}>
            Projects
          </h2>
          {projects.map((proj, idx) => (
            <div key={idx} className="mb-2">
              <h3 className="font-semibold text-xs">{proj.title}</h3>
              <p className="text-xs text-gray-700">{proj.description}</p>
              <div className="flex gap-2 text-[11px] mt-1">
                {proj.github && (
                  <a href={proj.github} style={{ color: accentColor }}>
                    <LuGithub size={10} /> GitHub
                  </a>
                )}
                {proj.liveDemo && (
                  <a href={proj.liveDemo} style={{ color: accentColor }}>
                    <LuExternalLink size={10} /> Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-3">
          <h2 className="text-sm font-bold uppercase mb-1 pb-1" style={sectionTitle}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-1 text-xs">
            {skills.map((s, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded"
                style={{ backgroundColor: `${accentColor}22`, color: primaryColor }}
              >
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TemplateTwo;
