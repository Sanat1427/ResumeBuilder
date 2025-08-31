import React from "react";
import TemplateOne from "./TemplateOne";
import TemplateTwo from "./TemplateTwo";
import TemplateThree from "./TemplateThree";
import { Github, Linkedin, Globe } from "lucide-react"; // fix: Github instead of GitHub

// Component to render clickable social icons
const SocialLinks = ({ contactInfo }) => {
  if (!contactInfo) return null;

  const links = [
    { icon: <Linkedin size={18} />, url: contactInfo.linkedin },
    { icon: <Github size={18} />, url: contactInfo.github }, // fixed
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
              style={{ color: "#000" }}
            >
              {link.icon}
            </a>
          )
      )}
    </div>
  );
};

const RenderResume = ({ templateId, resumeData, containerWidth }) => {
  // Enhance resumeData with clickable social icons
  const enhancedResumeData = {
    ...resumeData,
    ContactLinksComponent: <SocialLinks contactInfo={resumeData.contactInfo} />,
  };

  // Render template based on templateId
  switch (templateId) {
    case "01":
      return <TemplateOne resumeData={enhancedResumeData} containerWidth={containerWidth} />;
    case "02":
      return <TemplateTwo resumeData={enhancedResumeData} containerWidth={containerWidth} />;
    case "03":
      return <TemplateThree resumeData={enhancedResumeData} containerWidth={containerWidth} />;
    default:
      return <TemplateOne resumeData={enhancedResumeData} containerWidth={containerWidth} />;
  }
};

export default RenderResume;
