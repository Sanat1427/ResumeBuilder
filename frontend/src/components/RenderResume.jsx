import React from "react";
import TemplateOne from "./TemplateOne";
import TemplateTwo from "./TemplateTwo";
import TemplateThree from "./TemplateThree";
import { Github, Linkedin, Globe } from "lucide-react";

/* -------------------- Social Links -------------------- */
const SocialLinks = ({ contactInfo, primaryColor }) => {
  if (!contactInfo) return null;

  const links = [
    { icon: <Linkedin size={18} />, url: contactInfo.linkedin },
    { icon: <Github size={18} />, url: contactInfo.github },
    { icon: <Globe size={18} />, url: contactInfo.website },
  ];

  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
      {links.map(
        (link, idx) =>
          link.url && (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: primaryColor || "#000",
                transition: "color 0.3s ease",
              }}
            >
              {link.icon}
            </a>
          )
      )}
    </div>
  );
};

/* -------------------- Template Mapping -------------------- */
const RenderResume = ({
  templateId,
  resumeData = {},
  containerWidth,
  themeConfig = {},
}) => {
  const { primaryColor, accentColor, fontFamily, layout } = themeConfig;

  // ✅ Merge theme styles globally
  const globalStyle = {
    fontFamily: fontFamily || "'Poppins', sans-serif",
    "--primary-color": primaryColor || "#6D28D9",
    "--accent-color": accentColor || "#F472B6",
    "--layout-type": layout || "modern",
    transition: "all 0.3s ease-in-out",
  };

  // ✅ Enhanced Resume Data with Social Links
  const enhancedResumeData = {
    ...resumeData,
    ContactLinksComponent: (
      <SocialLinks
        contactInfo={resumeData?.contactInfo}
        primaryColor={primaryColor}
      />
    ),
  };

  // ✅ Render Template Based on Selected ID
  const renderTemplate = () => {
    switch (templateId) {
      case "01":
        return (
          <TemplateOne
            resumeData={enhancedResumeData}
            containerWidth={containerWidth}
            themeConfig={themeConfig}
          />
        );
      case "02":
        return (
          <TemplateTwo
            resumeData={enhancedResumeData}
            containerWidth={containerWidth}
            themeConfig={themeConfig}
          />
        );
      case "03":
        return (
          <TemplateThree
            resumeData={enhancedResumeData}
            containerWidth={containerWidth}
            themeConfig={themeConfig}
          />
        );
      default:
        return (
          <TemplateOne
            resumeData={enhancedResumeData}
            containerWidth={containerWidth}
            themeConfig={themeConfig}
          />
        );
    }
  };

  return (
    <div
      style={globalStyle}
      className="resume-container border border-gray-200 rounded-2xl shadow-sm bg-white p-6"
    >
      {renderTemplate()}
    </div>
  );
};

export default RenderResume;
