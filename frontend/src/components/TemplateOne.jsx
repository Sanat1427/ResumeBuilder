import React, { useEffect, useRef, useState } from "react";
import { LuMail, LuPhone, LuGithub, LuGlobe } from "react-icons/lu";
import { RiLinkedinLine } from "react-icons/ri";
import {
  EducationInfo,
  WorkExperience,
  ProjectInfo,
  CertificationInfo,
} from "./ResumeSection";
import { formatYearMonth } from "../utils/helper";

const Title = ({ text, color }) => (
  <div className="relative w-fit mb-2">
    <h2
      className="text-base font-bold uppercase tracking-wide pb-1"
      style={{ color }}
    >
      {text}
    </h2>
    <div className="w-full h-[2px]" style={{ backgroundColor: color }} />
  </div>
);

const TemplateOne = ({ resumeData = {}, containerWidth, themeConfig = {} }) => {
  const {
    primaryColor = "#0d47a1",
    accentColor = "#64b5f6",
    fontFamily = "'Poppins', sans-serif",
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

  return (
    <div
      ref={resumeRef}
      className="p-6 bg-white text-gray-800"
      style={{
        transform: containerWidth ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        width: containerWidth ? `${baseWidth}px` : undefined,
        fontFamily,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 pb-3 mb-3">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>
            {profileInfo.fullName}
          </h1>
          <p className="text-lg font-medium text-gray-600">
            {profileInfo.designation}
          </p>
          <div className="flex flex-wrap gap-3 text-sm mt-2">
            {contactInfo.email && (
              <a
                href={`mailto:${contactInfo.email}`}
                style={{ color: accentColor }}
                className="flex items-center gap-1 hover:underline"
              >
                <LuMail /> {contactInfo.email}
              </a>
            )}
            {contactInfo.phone && (
              <span className="flex items-center gap-1 text-gray-600">
                <LuPhone /> {contactInfo.phone}
              </span>
            )}
            {contactInfo.location && <span>{contactInfo.location}</span>}
          </div>
        </div>

        <div className="text-sm flex flex-col items-end">
          {contactInfo.linkedin && (
            <a
              href={contactInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: accentColor }}
              className="hover:underline flex items-center gap-1"
            >
              <RiLinkedinLine /> LinkedIn
            </a>
          )}
          {contactInfo.github && (
            <a
              href={contactInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: accentColor }}
              className="hover:underline flex items-center gap-1"
            >
              <LuGithub /> GitHub
            </a>
          )}
          {contactInfo.website && (
            <a
              href={contactInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: accentColor }}
              className="hover:underline flex items-center gap-1"
            >
              <LuGlobe /> Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {profileInfo.summary && (
        <section className="mb-3">
          <Title text="Professional Summary" color={primaryColor} />
          <p className="text-sm leading-relaxed">{profileInfo.summary}</p>
        </section>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left */}
        <div className="col-span-2 space-y-4">
          {workExperience.length > 0 && (
            <section>
              <Title text="Work Experience" color={primaryColor} />
              {workExperience.map((exp, i) => (
                <WorkExperience
                  key={i}
                  company={exp.company}
                  role={exp.role}
                  duration={`${formatYearMonth(exp.startDate)} - ${formatYearMonth(exp.endDate)}`}
                  description={exp.description}
                />
              ))}
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <Title text="Projects" color={primaryColor} />
              {projects.map((proj, i) => (
                <ProjectInfo
                  key={i}
                  title={proj.title}
                  description={proj.description}
                  githubLink={proj.github}
                  liveDemoUrl={proj.liveDemo}
                />
              ))}
            </section>
          )}
        </div>

        {/* Right */}
        <div className="col-span-1 space-y-4">
          {skills.length > 0 && (
            <section>
              <Title text="Skills" color={primaryColor} />
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-2 py-1 rounded"
                    style={{ backgroundColor: `${accentColor}22`, color: primaryColor }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <Title text="Education" color={primaryColor} />
              {education.map((edu, i) => (
                <EducationInfo
                  key={i}
                  degree={edu.degree}
                  institution={edu.institution}
                  duration={`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}
                />
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateOne;
