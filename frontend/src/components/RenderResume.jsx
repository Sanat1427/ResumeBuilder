import React from "react";
import { resumeTemplates } from "../utils/data";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FolderGit, 
  Award, 
  BookOpen,
  Trophy
} from "lucide-react";

/* -------------------- Helper Date Formatter -------------------- */
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  if (dateStr.toLowerCase() === "present") return "Present";
  try {
    const parts = dateStr.split("-");
    if (parts.length >= 2) {
      const date = new Date(parts[0], parts[1] - 1);
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

/* -------------------- Helper Link & JSON Parsers -------------------- */
const ensureHttps = (url) => {
  if (!url) return "";
  const clean = url.trim();
  if (/^https?:\/\//i.test(clean)) return clean;
  return `https://${clean}`;
};

const formatUrl = (url, type) => {
  if (!url) return "";
  let clean = url.trim().replace(/\/$/, "");
  clean = clean.split("?")[0];
  
  if (type === "linkedin") {
    if (!clean.includes("linkedin.com")) {
      return `linkedin.com/in/${clean}`;
    }
    const match = clean.match(/linkedin\.com\/in\/([^/]+)/i);
    return match ? `linkedin.com/in/${match[1]}` : clean.replace(/(^\w+:|^)\/\//, "");
  }
  
  if (type === "github") {
    if (!clean.includes("github.com")) {
      return `github.com/${clean}`;
    }
    const match = clean.match(/github\.com\/([^/]+)/i);
    return match ? `github.com/${match[1]}` : clean.replace(/(^\w+:|^)\/\//, "");
  }

  if (type === "leetcode") {
    if (!clean.includes("leetcode.com")) {
      return `leetcode.com/${clean}`;
    }
    const match = clean.match(/leetcode\.com\/([^/]+)/i);
    return match ? `leetcode.com/${match[1]}` : clean.replace(/(^\w+:|^)\/\//, "");
  }

  if (type === "codechef") {
    if (!clean.includes("codechef.com")) {
      return `codechef.com/users/${clean}`;
    }
    const match = clean.match(/codechef\.com\/users\/([^/]+)/i);
    return match ? `codechef.com/users/${match[1]}` : clean.replace(/(^\w+:|^)\/\//, "");
  }

  return clean.replace(/(^\w+:|^)\/\//, "");
};

const parseIfJson = (val) => {
  if (typeof val !== "string") return val;
  const trimmed = val.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return val;
    }
  }
  return val;
};

const isValUrl = (url, type) => {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  if (!clean || clean === "linkedin" || clean === "github" || clean === "leetcode" || clean === "codechef" || clean === "portfolio" || clean === "website") return false;
  
  if (type === "linkedin") {
    if (clean === "linkedin.com" || clean === "linkedin.com/in" || clean === "linkedin.com/in/" || clean.endsWith("/linkedin")) {
      return false;
    }
  }
  if (type === "github") {
    if (clean === "github.com" || clean === "github.com/" || clean.endsWith("/github")) {
      return false;
    }
  }
  if (type === "leetcode") {
    if (clean === "leetcode.com" || clean === "leetcode.com/" || clean.endsWith("/leetcode")) {
      return false;
    }
  }
  if (type === "codechef") {
    if (clean === "codechef.com" || clean === "codechef.com/" || clean.endsWith("/codechef") || clean.includes("users/codechef")) {
      return false;
    }
  }
  if (type === "website" || type === "portfolio") {
    if (clean === "website" || clean === "portfolio" || clean === "http" || clean === "https" || clean === "http://" || clean === "https://") {
      return false;
    }
  }
  return true;
};

/* -------------------- Skills Rating Meter -------------------- */
const SkillMeter = ({ name, progress, color, isAtsClassic }) => {
  if (isAtsClassic) {
    return <span className="text-xs font-bold text-black bg-slate-100 border border-black px-2 py-0.5">{name}</span>;
  }
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between items-center text-xs font-bold text-black">
        <span>{name}</span>
        {progress > 0 && <span className="opacity-80">{Math.round(progress / 20)}/5</span>}
      </div>
      {progress > 0 && (
        <div className="w-full h-2.5 bg-slate-100 rounded-none overflow-hidden">
          <div 
            className="h-full transition-all duration-500" 
            style={{ width: `${progress}%`, backgroundColor: color || "#000000" }}
          ></div>
        </div>
      )}
    </div>
  );
};

/* -------------------- Render Component -------------------- */
const RenderResume = ({
  templateId: rawTemplateId,
  resumeData = {},
  containerWidth = 800,
  themeConfig = {},
}) => {
  // Backwards compatibility mapping
  let templateId = rawTemplateId;
  if (templateId === "01") templateId = "modern-professional";
  else if (templateId === "02") templateId = "two-column-professional";
  else if (templateId === "03") templateId = "creative";

  // Resolve active template metadata and styling variables
  const activeTemplate = resumeTemplates.find(t => t.id === templateId) || resumeTemplates[0];
  
  const primaryColor = themeConfig.primaryColor || activeTemplate.defaultTheme.primaryColor;
  const accentColor = themeConfig.accentColor || activeTemplate.defaultTheme.accentColor;
  const fontFamily = themeConfig.fontFamily || activeTemplate.defaultTheme.fontFamily;
  
  const isAtsClassic = templateId === "ats-classic";
  const isExecutive = templateId === "executive";
  const isMinimal = templateId === "minimal";
  const isSoftwareEngineer = templateId === "software-engineer";
  const isStudentFresher = templateId === "student-fresher";

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

  const globalStyle = {
    fontFamily: fontFamily || "'Inter', sans-serif",
    width: "100%",
    boxSizing: "border-box",
  };

  /* -------------------- Subcomponents -------------------- */
  const SectionHeader = ({ title, icon }) => {
    if (isAtsClassic) {
      return (
        <div className="border-b border-black pb-0.5 mb-2 mt-4">
          <h2 className="text-[11px] font-black uppercase tracking-wider text-black">{title}</h2>
        </div>
      );
    }
    if (isMinimal) {
      return (
        <div className="mb-2.5 mt-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-800" style={{ color: primaryColor }}>
            {title}
          </h2>
        </div>
      );
    }
    if (isExecutive) {
      return (
        <div className="border-y border-stone-300 py-1 mb-3 mt-4 text-center">
          <h2 className="text-xs font-black uppercase tracking-widest" style={{ color: primaryColor }}>
            {title}
          </h2>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 border-b-2 pb-1 mb-3 mt-5" style={{ borderColor: `${primaryColor}20` }}>
        {!isAtsClassic && icon && (
          <div className="p-1 rounded-md text-white" style={{ backgroundColor: primaryColor }}>
            {React.cloneElement(icon, { size: 12 })}
          </div>
        )}
        <h2 className="text-xs font-black uppercase tracking-wider" style={{ color: primaryColor }}>
          {title}
        </h2>
      </div>
    );
  };

  /* -------------------- Layouts -------------------- */

  // Layout 1: Single Column Layout
  const SingleColumnLayout = () => {
    // Determine section order
    let sections = [
      { id: "summary", title: "Summary", render: renderSummary },
      { id: "experience", title: "Professional Experience", render: renderExperience },
      { id: "projects", title: "Key Projects", render: renderProjects },
      { id: "education", title: "Education Details", render: renderEducation },
      { id: "skills", title: "Skills Matrix", render: renderSkillsSection },
      { id: "certifications", title: "Certifications", render: renderCertificationsSection },
      { id: "languages", title: "Languages", render: renderLanguages }
    ];

    if (isStudentFresher) {
      // Education and projects first
      sections = [
        { id: "summary", title: "Objective Summary", render: renderSummary },
        { id: "education", title: "Education Details", render: renderEducation },
        { id: "projects", title: "Academic & Personal Projects", render: renderProjects },
        { id: "experience", title: "Work Experience & Internships", render: renderExperience },
        { id: "skills", title: "Skills Matrix", render: renderSkillsSection },
        { id: "certifications", title: "Certifications", render: renderCertificationsSection },
        { id: "languages", title: "Languages", render: renderLanguages }
      ];
    } else if (isSoftwareEngineer) {
      // Skills right below summary, then experience and projects
      sections = [
        { id: "summary", title: "Professional Summary", render: renderSummary },
        { id: "skills", title: "Technical Skills", render: renderSkillsSection },
        { id: "experience", title: "Professional Experience", render: renderExperience },
        { id: "projects", title: "Open Source & Key Projects", render: renderProjects },
        { id: "education", title: "Education Details", render: renderEducation },
        { id: "certifications", title: "Certifications", render: renderCertificationsSection },
        { id: "languages", title: "Languages", render: renderLanguages }
      ];
    }

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className={`border-b pb-4 mb-2 ${isExecutive ? "text-center" : "text-left"}`} style={{ borderColor: isAtsClassic ? "#000" : `${accentColor}30` }}>
          <h1 className={`${isExecutive ? "text-3xl font-serif font-black" : "text-2xl font-black"} uppercase tracking-tight`} style={{ color: primaryColor }}>
            {profileInfo.fullName || "Your Name"}
          </h1>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-0.5">
            {profileInfo.designation || "Designation"}
          </p>

          {/* Contact Details row */}
          <div className={`flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] font-bold text-slate-700 mt-2.5 ${isExecutive ? "justify-center" : "justify-start"}`}>
            {contactInfo.email && (
              <a 
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-1 hover:underline text-inherit"
              >
                {!isAtsClassic && <Mail size={10} />} {contactInfo.email}
              </a>
            )}
            {contactInfo.phone && (
              <span className="flex items-center gap-1">
                {!isAtsClassic && <Phone size={10} />} {contactInfo.phone}
              </span>
            )}
            {contactInfo.location && (
              <span className="flex items-center gap-1">
                {!isAtsClassic && <MapPin size={10} />} {contactInfo.location}
              </span>
            )}
            {isValUrl(contactInfo.linkedin, "linkedin") && (
              <a 
                href={ensureHttps(contactInfo.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline text-inherit"
              >
                {!isAtsClassic && <Linkedin size={10} />} {formatUrl(contactInfo.linkedin, "linkedin")}
              </a>
            )}
            {isValUrl(contactInfo.github, "github") && (
              <a 
                href={ensureHttps(contactInfo.github)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline text-inherit"
              >
                {!isAtsClassic && <Github size={10} />} {formatUrl(contactInfo.github, "github")}
              </a>
            )}
            {isValUrl(contactInfo.leetcode, "leetcode") && (
              <a 
                href={ensureHttps(contactInfo.leetcode)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline text-inherit"
              >
                {!isAtsClassic && <Trophy size={10} />} {formatUrl(contactInfo.leetcode, "leetcode")}
              </a>
            )}
            {isValUrl(contactInfo.codechef, "codechef") && (
              <a 
                href={ensureHttps(contactInfo.codechef)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline text-inherit"
              >
                {!isAtsClassic && <Code size={10} />} {formatUrl(contactInfo.codechef, "codechef")}
              </a>
            )}
            {isValUrl(contactInfo.website, "website") && (
              <a 
                href={ensureHttps(contactInfo.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline text-inherit"
              >
                {!isAtsClassic && <Globe size={10} />} {formatUrl(contactInfo.website, "website")}
              </a>
            )}
          </div>
        </div>

        {/* Sections */}
        {sections.map((sec) => (
          <div key={sec.id}>
            {sec.render(sec.title)}
          </div>
        ))}
      </div>
    );
  };

  // Layout 2: Two Column Layout
  const TwoColumnLayout = () => {
    return (
      <div className="grid grid-cols-12 gap-5 h-full min-h-[1075px] items-stretch">
        
        {/* Left Column (Sidebar) */}
        <aside className="col-span-4 p-4 flex flex-col justify-between border-r-2" style={{ backgroundColor: `${accentColor}08`, borderColor: `${accentColor}20` }}>
          <div className="space-y-4">
            
            {/* Header info inside sidebar if creative */}
            <div className="pb-3 border-b border-slate-200">
              <h1 className="text-xl font-black uppercase tracking-tight" style={{ color: primaryColor }}>
                {profileInfo.fullName || "Your Name"}
              </h1>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mt-0.5">
                {profileInfo.designation || "Designation"}
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contact Details</h3>
              <div className="space-y-2 text-[10px] font-bold text-slate-700">
                {contactInfo.email && (
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-slate-200" style={{ color: primaryColor }}><Mail size={10} /></div>
                    <span className="truncate">{contactInfo.email}</span>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-slate-200" style={{ color: primaryColor }}><Phone size={10} /></div>
                    <span>{contactInfo.phone}</span>
                  </div>
                )}
                {contactInfo.location && (
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-slate-200" style={{ color: primaryColor }}><MapPin size={10} /></div>
                    <span>{contactInfo.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Links */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Professional Links</h3>
              <div className="space-y-1 text-[10px] font-bold text-slate-700">
                {isValUrl(contactInfo.linkedin, "linkedin") && (
                  <a href={ensureHttps(contactInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                    <Linkedin size={10} style={{ color: primaryColor }} /> <span>{formatUrl(contactInfo.linkedin, "linkedin")}</span>
                  </a>
                )}
                {isValUrl(contactInfo.github, "github") && (
                  <a href={ensureHttps(contactInfo.github)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                    <Github size={10} style={{ color: primaryColor }} /> <span>{formatUrl(contactInfo.github, "github")}</span>
                  </a>
                )}
                {isValUrl(contactInfo.leetcode, "leetcode") && (
                  <a href={ensureHttps(contactInfo.leetcode)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                    <Trophy size={10} style={{ color: primaryColor }} /> <span>{formatUrl(contactInfo.leetcode, "leetcode")}</span>
                  </a>
                )}
                {isValUrl(contactInfo.codechef, "codechef") && (
                  <a href={ensureHttps(contactInfo.codechef)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                    <Code size={10} style={{ color: primaryColor }} /> <span>{formatUrl(contactInfo.codechef, "codechef")}</span>
                  </a>
                )}
                {isValUrl(contactInfo.website, "website") && (
                  <a href={ensureHttps(contactInfo.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                    <Globe size={10} style={{ color: primaryColor }} /> <span>{formatUrl(contactInfo.website, "website")}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Skills</h3>
                <div className="space-y-2">
                  {skills.map((skill, idx) => (
                    <SkillMeter 
                      key={idx} 
                      name={skill.name} 
                      progress={skill.progress} 
                      color={primaryColor} 
                      isAtsClassic={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && languages[0]?.name && (
              <div className="space-y-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Languages</h3>
                <div className="space-y-1 text-[10px] font-bold text-slate-700">
                  {languages.map((lang, idx) => {
                    if (!lang?.name) return null;
                    return (
                      <div key={idx} className="flex justify-between items-center">
                        <span>{lang.name}</span>
                        {lang.progress > 0 && <span className="opacity-75">{Math.round(lang.progress / 20)}/5</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </aside>

        {/* Right Column (Main Content) */}
        <main className="col-span-8 p-4 space-y-4">
          {renderSummary()}
          {renderExperience("Experience")}
          {renderProjects("Key Projects")}
          {renderEducation("Education")}
          {renderCertificationsSection("Certifications & Awards")}
        </main>

      </div>
    );
  };

  /* -------------------- Sections Renderers -------------------- */
  
  function renderSummary(title) {
    if (!profileInfo.summary) return null;
    let summaryText = profileInfo.summary;
    try {
      const parsed = parseIfJson(summaryText);
      if (typeof parsed === "object" && parsed !== null) {
        summaryText = parsed.summary || parsed.raw || parsed.description || JSON.stringify(parsed);
      }
    } catch {}
    return (
      <div className="mb-2">
        <SectionHeader title={title || "Professional Summary"} icon={<BookOpen />} />
        <p className={`text-[11px] leading-relaxed text-slate-700 ${isAtsClassic ? "font-serif text-black" : ""}`}>
          {summaryText}
        </p>
      </div>
    );
  }

  function renderExperience(title) {
    if (!workExperience || workExperience.length === 0) return null;
    
    // Check if the first item represents a serialized empty entry or if list is invalid
    const firstItem = parseIfJson(workExperience[0]);
    if (!firstItem || (!firstItem.company && !firstItem.role && !firstItem.description)) return null;

    return (
      <div className="mb-2">
        <SectionHeader title={title || "Professional Experience"} icon={<Briefcase />} />
        <div className="space-y-3">
          {workExperience.map((expItem, idx) => {
            const exp = parseIfJson(expItem);
            if (!exp) return null;

            let role = exp.role || "Role";
            let company = exp.company || "Company";
            let startDate = exp.startDate;
            let endDate = exp.endDate;
            let description = exp.description || "";
            let details = [];

            // Check if description itself is a JSON string
            if (typeof description === "string" && (description.trim().startsWith("{") || description.trim().startsWith("["))) {
              try {
                const parsedDesc = JSON.parse(description.trim());
                if (typeof parsedDesc === "object" && parsedDesc !== null) {
                  if (parsedDesc.description) {
                    description = parsedDesc.description;
                  } else if (parsedDesc.experience && Array.isArray(parsedDesc.experience) && parsedDesc.experience.length > 0) {
                    const innerExp = parsedDesc.experience[0];
                    if (innerExp.details) {
                      details = Array.isArray(innerExp.details) ? innerExp.details : [innerExp.details];
                    } else if (innerExp.description) {
                      description = innerExp.description;
                    }
                    if (innerExp.role) role = innerExp.role;
                    if (innerExp.company) company = innerExp.company;
                    if (innerExp.startDate) startDate = innerExp.startDate;
                    if (innerExp.endDate) endDate = innerExp.endDate;
                  } else if (parsedDesc.details) {
                    details = Array.isArray(parsedDesc.details) ? parsedDesc.details : [parsedDesc.details];
                  }
                  if (parsedDesc.role) role = parsedDesc.role;
                  if (parsedDesc.company) company = parsedDesc.company;
                  if (parsedDesc.startDate) startDate = parsedDesc.startDate;
                  if (parsedDesc.endDate) endDate = parsedDesc.endDate;
                }
              } catch (e) {
                console.warn("Failed parsing JSON experience description", e);
              }
            } else if (Array.isArray(exp.details)) {
              details = exp.details;
            }

            return (
              <div key={idx} className={`relative pb-3 border-b border-dashed border-slate-200 last:border-b-0 last:pb-0 ${isAtsClassic ? "border-none" : ""}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-xs font-black uppercase ${isAtsClassic ? "font-serif text-[11px] text-black" : ""}`} style={{ color: isAtsClassic ? "#000" : primaryColor }}>
                      {role}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-500">
                      {company} {exp.location ? `| ${exp.location}` : ""}
                    </p>
                  </div>
                  <div className="text-right text-[10px] font-bold text-slate-400 italic">
                    {formatDate(startDate)} - {formatDate(endDate)}
                  </div>
                </div>
                {details.length > 0 ? (
                  <ul className="list-disc pl-4 mt-1 text-[10px] text-slate-650 space-y-1">
                    {details.map((bullet, bIdx) => (
                      <li key={bIdx} className={`${isAtsClassic ? "font-serif text-[11px] text-black" : ""}`}>{bullet}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={`text-[10px] leading-relaxed text-slate-600 mt-1 whitespace-pre-line ${isAtsClassic ? "font-serif text-[11px] text-black mt-0.5" : ""}`}>
                    {description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderProjects(title) {
    if (!projects || projects.length === 0) return null;
    const firstProj = parseIfJson(projects[0]);
    if (!firstProj || (!firstProj.title && !firstProj.description)) return null;

    return (
      <div className="mb-2">
        <SectionHeader title={title || "Key Projects"} icon={<FolderGit />} />
        <div className="space-y-3">
          {projects.map((projItem, idx) => {
            const proj = parseIfJson(projItem);
            if (!proj) return null;

            let projectTitle = proj.title || "Project Title";
            let projectDesc = proj.description || "";
            let projectTech = proj.technologies || [];
            let projectGithub = proj.github || "";
            let projectLive = proj.liveDemo || "";

            // Check if description itself is a JSON string
            if (typeof projectDesc === "string" && (projectDesc.trim().startsWith("{") || projectDesc.trim().startsWith("["))) {
              try {
                const parsedDesc = JSON.parse(projectDesc.trim());
                if (typeof parsedDesc === "object" && parsedDesc !== null) {
                  if (parsedDesc.title) projectTitle = parsedDesc.title;
                  if (parsedDesc.description) {
                    projectDesc = parsedDesc.description;
                  } else if (parsedDesc.projects && Array.isArray(parsedDesc.projects) && parsedDesc.projects.length > 0) {
                    const innerProj = parsedDesc.projects[0];
                    if (innerProj.description) projectDesc = innerProj.description;
                    if (innerProj.title) projectTitle = innerProj.title;
                    if (innerProj.technologies) {
                      projectTech = Array.isArray(innerProj.technologies) ? innerProj.technologies : [innerProj.technologies];
                    }
                    if (innerProj.github) projectGithub = innerProj.github;
                    if (innerProj.liveDemo) projectLive = innerProj.liveDemo;
                  }
                  if (parsedDesc.technologies) {
                    projectTech = Array.isArray(parsedDesc.technologies) ? parsedDesc.technologies : [parsedDesc.technologies];
                  }
                  if (parsedDesc.github) projectGithub = parsedDesc.github;
                  if (parsedDesc.liveDemo) projectLive = parsedDesc.liveDemo;
                }
              } catch (e) {
                console.warn("Failed parsing JSON project description", e);
              }
            }

            const techList = Array.isArray(projectTech) ? projectTech : [];

            return (
              <div key={idx} className={`relative pb-3 border-b border-dashed border-slate-200 last:border-b-0 last:pb-0 ${isAtsClassic ? "border-none" : ""}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-xs font-black uppercase ${isAtsClassic ? "font-serif text-[11px] text-black" : ""}`} style={{ color: isAtsClassic ? "#000" : primaryColor }}>
                      {projectTitle}
                    </h3>
                    {techList.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {techList.map((tech, i) => (
                          <span key={i} className="text-[8px] bg-slate-100 px-1 py-0.5 border border-slate-200 text-slate-600 font-bold">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                    {projectGithub && (
                      <a href={ensureHttps(projectGithub)} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-0.5" style={{ color: accentColor }}>
                        <Github size={10} /> GitHub
                      </a>
                    )}
                    {projectLive && (
                      <a href={ensureHttps(projectLive)} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-0.5" style={{ color: accentColor }}>
                        <Globe size={10} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
                <p className={`text-[10px] leading-relaxed text-slate-600 mt-1 ${isAtsClassic ? "font-serif text-[11px] text-black mt-0.5" : ""}`}>
                  {projectDesc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderEducation(title) {
    if (!education || education.length === 0 || !education[0]?.institution) return null;
    return (
      <div className="mb-2">
        <SectionHeader title={title || "Education Details"} icon={<GraduationCap />} />
        <div className="space-y-3">
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-start text-xs">
              <div>
                <h3 className={`text-xs font-black uppercase ${isAtsClassic ? "font-serif text-[11px] text-black" : ""}`} style={{ color: isAtsClassic ? "#000" : primaryColor }}>
                  {edu.degree || "Degree"} {edu.major ? `in ${edu.major}` : ""}
                </h3>
                <p className="text-[10px] font-bold text-slate-500">
                  {edu.institution || "Institution"} {edu.location ? `| ${edu.location}` : ""}
                </p>
              </div>
              <div className="text-right text-[10px] font-bold text-slate-400 italic">
                {edu.graduationYear || edu.endDate || ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderSkillsSection(title) {
    if (!skills || skills.length === 0 || !skills[0]?.name) return null;
    
    // In Two Column Layout, skills are already rendered in sidebar
    if (activeTemplate.layoutType === "two-column") return null;

    return (
      <div className="mb-2">
        <SectionHeader title={title || "Skills Matrix"} icon={<Code />} />
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <SkillMeter 
              key={idx} 
              name={skill.name} 
              progress={skill.progress} 
              color={primaryColor} 
              isAtsClassic={isAtsClassic}
            />
          ))}
        </div>
      </div>
    );
  }

  function renderCertificationsSection(title) {
    if (!certifications || certifications.length === 0 || !certifications[0]?.title) return null;
    return (
      <div className="mb-2">
        <SectionHeader title={title || "Certifications"} icon={<Award />} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {certifications.map((cert, idx) => (
            <div key={idx} className={`flex justify-between items-center p-2 border border-slate-200 bg-slate-50/50 ${isAtsClassic ? "bg-white p-0 border-none justify-start gap-4" : ""}`}>
              <div>
                <h4 className={`text-[10px] font-black uppercase ${isAtsClassic ? "font-serif text-[11px] text-black" : ""}`} style={{ color: isAtsClassic ? "#000" : primaryColor }}>
                  {cert.title || "Certification"}
                </h4>
                <p className="text-[9px] font-bold text-slate-500">{cert.issuer}</p>
              </div>
              {cert.year && (
                <span className={`text-[9px] font-black px-1.5 py-0.5 ${isAtsClassic ? "font-serif text-black border border-black p-0 bg-transparent" : "text-white rounded"}`} style={{ backgroundColor: isAtsClassic ? "transparent" : primaryColor }}>
                  {cert.year}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderLanguages(title) {
    if (!languages || languages.length === 0 || !languages[0]?.name) return null;
    return (
      <div className="mb-2">
        <SectionHeader title={title || "Languages"} icon={<Globe />} />
        <div className="flex flex-wrap gap-3">
          {languages.map((lang, idx) => (
            <div key={idx} className={`flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 ${isAtsClassic ? "bg-white border-none p-0 text-black font-serif text-[11px]" : ""}`}>
              <span>{lang.name}</span>
              {lang.progress > 0 && (
                <span className="text-[10px] text-slate-400">
                  ({Math.round(lang.progress / 20)}/5)
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* -------------------- Outer Wrapper -------------------- */
  return (
    <div
      style={globalStyle}
      className={`resume-container bg-white border border-slate-200 p-8 shadow-sm ${
        isAtsClassic ? "p-8 font-serif" : "p-6"
      }`}
    >
      {activeTemplate.layoutType === "two-column" ? (
        <TwoColumnLayout />
      ) : (
        <SingleColumnLayout />
      )}
    </div>
  );
};

export default RenderResume;
