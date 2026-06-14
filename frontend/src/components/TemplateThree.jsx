import React, { useEffect, useRef, useState } from "react";
import { formatYearMonth } from "../utils/helper";

const TemplateThree = ({ resumeData = {}, containerWidth, themeConfig = {} }) => {
  const {
    primaryColor = "#1e3a8a",
    accentColor = "#3b82f6",
    fontFamily = "'Roboto Slab', serif",
  } = themeConfig;

  const {
    profileInfo = {},
    contactInfo = {},
    education = [],
    workExperience = [],
    projects = [],
    skills = [],
    certifications = [],
    interests = [],
  } = resumeData;

  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(1100);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (resumeRef.current && containerWidth > 0) {
      const actualBaseWidth = resumeRef.current.offsetWidth;
      setBaseWidth(actualBaseWidth);
      setScale(containerWidth / actualBaseWidth);
    }
  }, [containerWidth]);

  return (
    <div
      ref={resumeRef}
      className="bg-white text-black max-w-screen-lg mx-auto"
      style={{
        transform: containerWidth ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth ? `${baseWidth}px` : "auto",
        fontFamily,
      }}
    >
      {/* Header */}
      <header className="text-center border-b-4 pb-2 mb-3" style={{ borderColor: primaryColor }}>
        <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>
          {profileInfo.fullName}
        </h1>
        <p className="text-sm text-gray-700">{profileInfo.designation}</p>
        <p className="text-xs text-gray-600 mt-1">{profileInfo.summary}</p>
      </header>

      <div className="grid grid-cols-12 gap-4 px-6 pb-6">
        {/* Sidebar */}
        <aside className="col-span-4 pr-4 border-r" style={{ borderColor: `${accentColor}33` }}>
          <h2 className="text-sm font-bold uppercase mb-2" style={{ color: primaryColor }}>
            Contact
          </h2>
          <ul className="text-xs text-gray-700 space-y-1 mb-3">
            {contactInfo.email && <li>Email: {contactInfo.email}</li>}
            {contactInfo.phone && <li>Phone: {contactInfo.phone}</li>}
            {contactInfo.linkedin && <li>LinkedIn: {contactInfo.linkedin}</li>}
          </ul>

          {skills.length > 0 && (
            <>
              <h2 className="text-sm font-bold uppercase mb-2" style={{ color: primaryColor }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-1 text-xs mb-3">
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
            </>
          )}

          {education.length > 0 && (
            <>
              <h2 className="text-sm font-bold uppercase mb-2" style={{ color: primaryColor }}>
                Education
              </h2>
              {education.map((edu, i) => (
                <div key={i} className="text-xs mb-2">
                  <p className="font-bold">{edu.institution}</p>
                  <p>{edu.degree}</p>
                </div>
              ))}
            </>
          )}
        </aside>

        {/* Main Content */}
        <main className="col-span-8 pl-4">
          {workExperience.length > 0 && (
            <section className="mb-3">
              <h2
                className="text-sm font-bold uppercase mb-1 pb-1 border-b"
                style={{ borderColor: accentColor, color: primaryColor }}
              >
                Work Experience
              </h2>
              {workExperience.map((exp, i) => (
                <div key={i} className="mb-2 text-xs">
                  <p className="font-semibold">{exp.role}</p>
                  <p className="italic text-gray-600">{exp.company}</p>
                  <p className="text-gray-700 mt-1">{exp.description}</p>
                </div>
              ))}
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2
                className="text-sm font-bold uppercase mb-1 pb-1 border-b"
                style={{ borderColor: accentColor, color: primaryColor }}
              >
                Projects
              </h2>
              {projects.map((proj, i) => (
                <div key={i} className="mb-2 text-xs">
                  <p className="font-semibold">{proj.title}</p>
                  <p className="text-gray-700">{proj.description}</p>
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default TemplateThree;
