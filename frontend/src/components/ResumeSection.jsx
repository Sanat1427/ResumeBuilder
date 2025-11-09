import React from "react";
import { ExternalLink, Github } from "lucide-react";
import { infoStyles as styles } from "../assets/dummystyle";

/* 🌈 Gradient Progress Bar with Animation */
export const Progress = ({ progress, color, accentColor }) => (
  <div className={styles.progressWrapper}>
    <div
      className={styles.progressBar(color)}
      style={{
        width: `${progress * 20}%`,
        background: `linear-gradient(90deg, ${color}, ${accentColor || "#A855F7"})`,
        borderRadius: "999px",
        transition: "width 0.4s ease, background 0.4s ease",
      }}
    />
  </div>
);

/* 🔗 Icon + Link Block */
export const ActionLink = ({ icon, link, bgColor }) => (
  <div
    className={`${styles.actionWrapper} transition-all duration-200 hover:scale-[1.02]`}
  >
    <div
      className={styles.actionIconWrapper}
      style={{ backgroundColor: bgColor }}
    >
      {icon}
    </div>
    <p className={styles.actionLink}>{link}</p>
  </div>
);

/* 🎓 Certification with Chip Style */
export const CertificationInfo = ({ title, issuer, year, bgColor }) => (
  <div
    className={`${styles.certContainer} flex items-center justify-between gap-3 bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl hover:shadow-sm transition`}
  >
    <div>
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <p className="text-xs text-gray-600">{issuer}</p>
    </div>
    {year && (
      <span
        className="text-xs font-bold text-white px-2 py-1 rounded-lg"
        style={{ backgroundColor: bgColor }}
      >
        {year}
      </span>
    )}
  </div>
);

/* 📞 Contact Info Row */
export const ContactInfo = ({ icon, iconBG, value }) => (
  <div className={styles.contactRow}>
    <div
      className={styles.contactIconWrapper}
      style={{
        backgroundColor: iconBG,
        color: "#fff",
        boxShadow: `0 0 5px ${iconBG}`,
      }}
    >
      {icon}
    </div>
    <p className={styles.contactText}>{value}</p>
  </div>
);

/* 🎓 Education Info Block */
export const EducationInfo = ({ degree, institution, duration }) => (
  <div
    className={`${styles.eduContainer} border-l-4 border-violet-400 pl-3 hover:bg-violet-50 transition-all rounded-md`}
  >
    <h3 className={styles.eduDegree}>{degree}</h3>
    <p className={styles.eduInstitution}>{institution}</p>
    <p className={styles.eduDuration}>{duration}</p>
  </div>
);

/* 📊 Skill or Language Info Block */
const InfoBlock = ({ label, progress, accentColor }) => (
  <div className={styles.infoRow}>
    <p className={styles.infoLabel}>{label}</p>
    {progress > 0 && (
      <Progress progress={(progress / 100) * 5} color={accentColor} />
    )}
  </div>
);

/* 🌍 Languages */
export const LanguageSection = ({ languages, accentColor }) => (
  <div className="space-y-1">
    {languages.map((lang, idx) => (
      <InfoBlock
        key={idx}
        label={lang.name}
        progress={lang.progress}
        accentColor={accentColor}
      />
    ))}
  </div>
);

/* ⚙️ Skills */
export const SkillSection = ({ skills, accentColor }) => (
  <div className={`${styles.skillGrid} grid grid-cols-2 gap-2`}>
    {skills.map((skill, idx) => (
      <InfoBlock
        key={idx}
        label={skill.name}
        progress={skill.progress}
        accentColor={accentColor}
      />
    ))}
  </div>
);

/* 💼 Project Info with Hover Effects */
export const ProjectInfo = ({
  title,
  description,
  githubLink,
  liveDemoUrl,
  isPreview,
}) => (
  <div
    className={`${styles.projectContainer} transition-transform transform hover:scale-[1.02] hover:shadow-lg border border-gray-200 p-4 rounded-xl`}
  >
    <h3 className={styles.projectTitle(isPreview)}>{title}</h3>
    <p className={`${styles.projectDesc} text-sm text-gray-600 mt-1`}>
      {description}
    </p>
    <div className={`${styles.projectLinks} flex gap-3 mt-3`}>
      {githubLink && (
        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.linkRow} flex items-center gap-1 text-gray-700 hover:text-blue-600`}
        >
          <Github size={16} />
          <span>GitHub</span>
        </a>
      )}
      {liveDemoUrl && (
        <a
          href={liveDemoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.linkRow} flex items-center gap-1 text-gray-700 hover:text-green-600`}
        >
          <ExternalLink size={16} />
          <span>Live Demo</span>
        </a>
      )}
    </div>
  </div>
);

/* ⭐ Interactive Rating Input (animated dots) */
export const RatingInput = ({
  value = 0,
  total = 5,
  onChange = () => {},
  color = "#10b981",
  bgColor = "#e5e7eb",
}) => {
  const displayValue = Math.round((value / 100) * total);
  return (
    <div className={`${styles.ratingWrapper} flex gap-1`}>
      {[...Array(total)].map((_, idx) => (
        <div
          key={idx}
          onClick={() =>
            onChange(Math.round(((idx + 1) / total) * 100))
          }
          className={`${styles.ratingDot} w-3 h-3 rounded-full transition-all duration-300 cursor-pointer`}
          style={{
            backgroundColor: idx < displayValue ? color : bgColor,
            transform: idx < displayValue ? "scale(1.2)" : "scale(1)",
            boxShadow:
              idx < displayValue
                ? `0 0 5px ${color}`
                : "inset 0 0 2px rgba(0,0,0,0.1)",
          }}
        />
      ))}
    </div>
  );
};

/* 🧾 Work Experience with Elegant Layout */
export const WorkExperience = ({
  company,
  role,
  duration,
  durationColor,
  description,
}) => (
  <div
    className={`${styles.workContainer} border-l-4 border-violet-400 pl-3 hover:bg-violet-50 rounded-md transition-all mb-3`}
  >
    <div className={`${styles.workHeader} flex justify-between`}>
      <div>
        <h3 className={styles.workCompany}>{company}</h3>
        <p className={styles.workRole}>{role}</p>
      </div>
      <p
        className={styles.workDuration(durationColor)}
        style={{ color: durationColor }}
      >
        {duration}
      </p>
    </div>
    <p className={`${styles.workDesc} text-gray-600 text-sm mt-1`}>
      {description}
    </p>
  </div>
);
