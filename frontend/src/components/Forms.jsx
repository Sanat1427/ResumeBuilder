"use client";

import Input from "./Input";
import { RatingInput } from "./ResumeSection";
import { Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import {
  commonStyles,
  additionalInfoStyles,
  certificationInfoStyles,
  contactInfoStyles,
  educationDetailsStyles,
  profileInfoStyles,
  projectDetailStyles,
  skillsInfoStyles,
  workExperienceStyles
} from "../assets/dummystyle";

/* ----------------------------- Additional Info ----------------------------- */
export const AdditionalInfoForm = ({
  languages = [],
  interests = [],
  updateArrayItem = () => {},
  addArrayItem = () => {},
  removeArrayItem = () => {}
}) => {
  return (
    <div className={additionalInfoStyles.container}>
      <h2 className={additionalInfoStyles.heading}>Additional Information</h2>

      {/* Languages Section */}
      <div className="mb-10">
        <h3 className={additionalInfoStyles.sectionHeading}>
          <div className={additionalInfoStyles.dotViolet}></div>
          Languages
        </h3>
        <div className="space-y-6">
          {languages?.map((lang, index) => (
            <div key={index} className={additionalInfoStyles.languageItem}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <Input
                  label="Language"
                  placeholder="e.g. English"
                  value={lang?.name || ""}
                  onChange={({ target }) =>
                    updateArrayItem("languages", index, "name", target.value)
                  }
                />
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-4">Proficiency</label>
                  <RatingInput
                    value={lang?.progress || 0}
                    total={5}
                    color="#8b5cf6"
                    bgColor="#e2e8f0"
                    onChange={(value) =>
                      updateArrayItem("languages", index, "progress", value)
                    }
                  />
                </div>
              </div>
              {languages.length > 1 && (
                <button
                  type="button"
                  className={commonStyles.trashButton}
                  onClick={() => removeArrayItem("languages", index)}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className={`${commonStyles.addButtonBase} ${additionalInfoStyles.addButtonLanguage}`}
            onClick={() => addArrayItem("languages", { name: "", progress: 0 })}
          >
            <Plus size={16} /> Add Language
          </button>
        </div>
      </div>

      {/* Interests Section */}
      <div className="mb-6">
        <h3 className={additionalInfoStyles.sectionHeading}>
          <div className={additionalInfoStyles.dotOrange}></div>
          Interests
        </h3>
        <div className="space-y-4">
          {interests?.map((interest, index) => (
            <div key={index} className={additionalInfoStyles.interestItem}>
              <Input
                placeholder="e.g. Reading, Photography"
                value={interest || ""}
                onChange={({ target }) =>
                  updateArrayItem("interests", index, null, target.value)
                }
              />
              {interests.length > 1 && (
                <button
                  type="button"
                  className={commonStyles.trashButton}
                  onClick={() => removeArrayItem("interests", index)}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className={`${commonStyles.addButtonBase} ${additionalInfoStyles.addButtonInterest}`}
            onClick={() => addArrayItem("interests", "")}
          >
            <Plus size={16} /> Add Interest
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------- Certifications ----------------------------- */
export const CertificationInfoForm = ({
  certifications = [],
  updateArrayItem = () => {},
  addArrayItem = () => {},
  removeArrayItem = () => {}
}) => {
  return (
    <div className={certificationInfoStyles.container}>
      <h2 className={certificationInfoStyles.heading}>Certifications</h2>
      <div className="space-y-6 mb-6">
        {certifications?.map((cert, index) => (
          <div key={index} className={certificationInfoStyles.item}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Certificate Title"
                placeholder="Full Stack Web Developer"
                value={cert?.title || ""}
                onChange={({ target }) => updateArrayItem(index, "title", target.value)}
              />

              <Input
                label="Issuer"
                placeholder="Coursera / Google / etc."
                value={cert?.issuer || ""}
                onChange={({ target }) => updateArrayItem(index, "issuer", target.value)}
              />

              <Input
                label="Year"
                placeholder="2024"
                value={cert?.year || ""}
                onChange={({ target }) => updateArrayItem(index, "year", target.value)}
              />
            </div>

            {certifications.length > 1 && (
              <button
                type="button"
                className={commonStyles.trashButton}
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className={`${commonStyles.addButtonBase} ${certificationInfoStyles.addButton}`}
          onClick={() =>
            addArrayItem({
              title: "",
              issuer: "",
              year: ""
            })
          }
        >
          <Plus size={16} /> Add Certification
        </button>
      </div>
    </div>
  );
};

/* ----------------------------- Contact Info ----------------------------- */
export const ContactInfoForm = ({ contactInfo = {}, updateSection = () => {} }) => {
  return (
    <div className={contactInfoStyles.container}>
      <h2 className={contactInfoStyles.heading}>Contact Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Address"
            placeholder="Short Address"
            value={contactInfo?.location || ""}
            onChange={({ target }) => updateSection("location", target.value)}
          />
        </div>

        <Input
          label="Email"
          placeholder="john@example.com"
          type="email"
          value={contactInfo?.email || ""}
          onChange={({ target }) => updateSection("email", target.value)}
        />

        <Input
          label="Phone Number"
          placeholder="1234567890"
          value={contactInfo?.phone || ""}
          onChange={({ target }) => updateSection("phone", target.value)}
        />

        <Input
          label="LinkedIn"
          placeholder="https://linkedin.com/in/username"
          value={contactInfo?.linkedin || ""}
          onChange={({ target }) => updateSection("linkedin", target.value)}
        />

        <Input
          label="GitHub"
          placeholder="https://github.com/username"
          value={contactInfo?.github || ""}
          onChange={({ target }) => updateSection("github", target.value)}
        />

        <Input
          label="LeetCode"
          placeholder="https://leetcode.com/username"
          value={contactInfo?.leetcode || ""}
          onChange={({ target }) => updateSection("leetcode", target.value)}
        />

        <Input
          label="CodeChef"
          placeholder="https://codechef.com/users/username"
          value={contactInfo?.codechef || ""}
          onChange={({ target }) => updateSection("codechef", target.value)}
        />

        <div className="md:col-span-2">
          <Input
            label="Portfolio / Website"
            placeholder="https://yourwebsite.com"
            value={contactInfo?.portfolio || contactInfo?.website || ""}
            onChange={({ target }) => {
              updateSection("portfolio", target.value);
              updateSection("website", target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

/* ----------------------------- Education ----------------------------- */
export const EducationDetailsForm = ({
  educationInfo = [],
  updateArrayItem = () => {},
  addArrayItem = () => {},
  removeArrayItem = () => {}
}) => {
  return (
    <div className={educationDetailsStyles.container}>
      <h2 className={educationDetailsStyles.heading}>Education</h2>
      <div className="space-y-6 mb-6">
        {educationInfo?.map((education, index) => (
          <div key={index} className={educationDetailsStyles.item}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Degree"
                placeholder="BTech in Computer Science"
                value={education?.degree || ""}
                onChange={({ target }) => updateArrayItem(index, "degree", target.value)}
              />

              <Input
                label="Institution"
                placeholder="XYZ University"
                value={education?.institution || ""}
                onChange={({ target }) => updateArrayItem(index, "institution", target.value)}
              />

              <Input
                label="Start Date"
                type="month"
                value={education?.startDate || ""}
                onChange={({ target }) => updateArrayItem(index, "startDate", target.value)}
              />

              <Input
                label="End Date"
                type="month"
                value={education?.endDate || ""}
                onChange={({ target }) => updateArrayItem(index, "endDate", target.value)}
              />
            </div>
            {educationInfo.length > 1 && (
              <button
                type="button"
                className={commonStyles.trashButton}
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className={`${commonStyles.addButtonBase} ${educationDetailsStyles.addButton}`}
          onClick={() =>
            addArrayItem({
              degree: "",
              institution: "",
              startDate: "",
              endDate: ""
            })
          }
        >
          <Plus size={16} /> Add Education
        </button>
      </div>
    </div>
  );
};

export const ProfileInfoForm = ({
  profileData = {},
  updateSection = () => {},
  activeInlineAI = {},
  triggerInlineAI = () => {},
  acceptInlineAI = () => {},
  regenerateInlineAI = () => {},
  cancelInlineAI = () => {}
}) => {
  return (
    <div className={profileInfoStyles.container}>
      <h2 className={profileInfoStyles.heading}>Personal Information</h2>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={profileData?.fullName || ""}
            onChange={({ target }) => updateSection("fullName", target.value)}
          />

          <Input
            label="Designation"
            placeholder="Full Stack Developer"
            value={profileData?.designation || ""}
            onChange={({ target }) => updateSection("designation", target.value)}
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-3">Summary</label>
            <textarea
              className={profileInfoStyles.textarea}
              rows={4}
              placeholder="Short introduction about yourself"
              value={profileData?.summary || ""}
              onChange={({ target }) => updateSection("summary", target.value)}
            />

            {/* AI Suggestion Box */}
            {activeInlineAI.section === "summary" && (
              <div className="mt-3 p-4 border-2 border-black bg-[#ffe17c]/5 shadow-[4px_4px_0px_#000] flex flex-col gap-3">
                {activeInlineAI.loading ? (
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Loader2 className="animate-spin text-black" size={16} />
                    Generating summary...
                  </div>
                ) : (
                  <>
                    <div className="font-semibold text-xs text-slate-800 bg-white border border-black p-3 whitespace-pre-wrap leading-relaxed shadow-[2px_2px_0px_#000]">
                      {activeInlineAI.suggestion}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={acceptInlineAI}
                        className="px-3 py-1.5 bg-black text-white hover:bg-neutral-800 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#ffe17c]"
                      >
                        Use This Summary
                      </button>
                      <button
                        type="button"
                        onClick={regenerateInlineAI}
                        className="px-3 py-1.5 bg-white text-black hover:bg-slate-100 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000]"
                      >
                        Regenerate
                      </button>
                      <button
                        type="button"
                        onClick={cancelInlineAI}
                        className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000]"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeInlineAI.section !== "summary" && (
              <button
                type="button"
                onClick={() => triggerInlineAI("summary", null, profileData?.summary || "")}
                className="flex items-center gap-1.5 mt-2 text-xs font-black bg-[#ffe17c] text-black border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
              >
                <Sparkles size={14} /> Generate Summary
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------- Projects ----------------------------- */
export const ProjectDetailForm = ({
  projectInfo = [],
  updateArrayItem = () => {},
  addArrayItem = () => {},
  removeArrayItem = () => {},
  activeInlineAI = {},
  triggerInlineAI = () => {},
  acceptInlineAI = () => {},
  regenerateInlineAI = () => {},
  cancelInlineAI = () => {}
}) => {
  return (
    <div className={projectDetailStyles.container}>
      <h2 className={projectDetailStyles.heading}>Projects</h2>
      <div className="space-y-6 mb-6">
        {projectInfo?.map((project, index) => (
          <div key={index} className={projectDetailStyles.item}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Project Title"
                  placeholder="Portfolio Website"
                  value={project?.title || ""}
                  onChange={({ target }) => updateArrayItem(index, "title", target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-3">Description</label>
                <textarea
                  placeholder="Short description about the project"
                  className={projectDetailStyles.textarea}
                  rows={3}
                  value={project?.description || ""}
                  onChange={({ target }) => updateArrayItem(index, "description", target.value)}
                />

                {/* AI Suggestion Box */}
                {activeInlineAI.section === "project" && activeInlineAI.index === index && (
                  <div className="mt-3 p-4 border-2 border-black bg-[#ffe17c]/5 shadow-[4px_4px_0px_#000] flex flex-col gap-3">
                    {activeInlineAI.loading ? (
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <Loader2 className="animate-spin text-black" size={16} />
                        Generating project description...
                      </div>
                    ) : (
                      <>
                        <div className="font-semibold text-xs text-slate-800 bg-white border border-black p-3 whitespace-pre-wrap leading-relaxed shadow-[2px_2px_0px_#000]">
                          {activeInlineAI.suggestion}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={acceptInlineAI}
                            className="px-3 py-1.5 bg-black text-white hover:bg-neutral-800 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#ffe17c]"
                          >
                            Add to Resume
                          </button>
                          <button
                            type="button"
                            onClick={regenerateInlineAI}
                            className="px-3 py-1.5 bg-white text-black hover:bg-slate-100 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000]"
                          >
                            Regenerate
                          </button>
                          <button
                            type="button"
                            onClick={cancelInlineAI}
                            className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000]"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {!(activeInlineAI.section === "project" && activeInlineAI.index === index) && (
                  <button
                    type="button"
                    onClick={() =>
                      triggerInlineAI("project", index, project?.description || "", {
                        title: project?.title || "",
                        technologies: ""
                      })
                    }
                    className="flex items-center gap-1.5 mt-2 text-xs font-black bg-[#ffe17c] text-black border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
                  >
                    <Sparkles size={14} /> Generate Description
                  </button>
                )}
              </div>

              <Input
                label="GitHub Link"
                placeholder="https://github.com/username/project"
                value={project?.github || ""}
                onChange={({ target }) => updateArrayItem(index, "github", target.value)}
              />

              <Input
                label="Live Demo URL"
                placeholder="https://yourproject.live"
                value={project?.liveDemo || ""}
                onChange={({ target }) => updateArrayItem(index, "liveDemo", target.value)}
              />
            </div>

            {projectInfo.length > 1 && (
              <button
                type="button"
                className={commonStyles.trashButton}
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className={`${commonStyles.addButtonBase} ${projectDetailStyles.addButton}`}
          onClick={() =>
            addArrayItem({
              title: "",
              description: "",
              github: "",
              liveDemo: ""
            })
          }
        >
          <Plus size={16} /> Add Project
        </button>
      </div>
    </div>
  );
};

export const SkillsInfoForm = ({
  skillsInfo = [],
  updateArrayItem = () => {},
  addArrayItem = () => {},
  removeArrayItem = () => {},
  activeInlineAI = {},
  triggerInlineAI = () => {},
  acceptInlineAI = () => {},
  regenerateInlineAI = () => {},
  cancelInlineAI = () => {},
  toggleSkillSelect = () => {}
}) => {
  return (
    <div className={skillsInfoStyles.container}>
      <h2 className={skillsInfoStyles.heading}>Skills</h2>
      <div className="space-y-6 mb-6">
        {skillsInfo?.map((skill, index) => (
          <div key={index} className={skillsInfoStyles.item}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Skill Name"
                placeholder="JavaScript"
                value={skill?.name || ""}
                onChange={({ target }) => updateArrayItem(index, "name", target.value)}
              />

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Proficiency ({skill?.progress ? Math.round(skill.progress / 20) : 0}/5)
                </label>
                <div className="mt-2">
                  <RatingInput
                    value={skill?.progress || 0}
                    total={5}
                    color="#f59e0b"
                    bgColor="#e2e8f0"
                    onChange={(newValue) =>
                      updateArrayItem(index, "progress", newValue)
                    }
                  />
                </div>
              </div>
            </div>

            {skillsInfo.length > 1 && (
              <button
                type="button"
                className={commonStyles.trashButton}
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <div className="flex flex-wrap gap-4 items-center">
          <button
            type="button"
            className={`${commonStyles.addButtonBase} ${skillsInfoStyles.addButton}`}
            onClick={() =>
              addArrayItem({
                name: "",
                progress: 0
              })
            }
          >
            <Plus size={16} /> Add Skill
          </button>

          {activeInlineAI.section !== "skills" && (
            <button
              type="button"
              onClick={() => triggerInlineAI("skills", null, "")}
              className="flex items-center gap-1.5 text-xs font-black bg-[#ffe17c] text-black border-2 border-black px-4 py-2.5 shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all cursor-pointer w-fit"
            >
              <Sparkles size={14} /> Suggest Skills
            </button>
          )}
        </div>

        {/* AI Skill Suggestion Box */}
        {activeInlineAI.section === "skills" && (
          <div className="mt-4 p-4 border-2 border-black bg-[#ffe17c]/5 shadow-[4px_4px_0px_#000] flex flex-col gap-3">
            {activeInlineAI.loading ? (
              <div className="flex items-center gap-2 font-bold text-xs">
                <Loader2 className="animate-spin text-black" size={16} />
                Suggesting skills and keywords...
              </div>
            ) : (
              <>
                <label className="block text-xs font-black uppercase text-black">
                  Recommended Skills (Select to add):
                </label>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(activeInlineAI.suggestion) && activeInlineAI.suggestion.map((skillName, i) => {
                    const isSelected = activeInlineAI.selectedSkills.includes(skillName);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleSkillSelect(skillName)}
                        className={`px-2.5 py-1 text-xs font-extrabold border-2 border-black transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#ffe17c] text-black shadow-[2px_2px_0px_#000]"
                            : "bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {skillName}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    type="button"
                    onClick={acceptInlineAI}
                    className="px-3 py-1.5 bg-black text-white hover:bg-neutral-800 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#ffe17c]"
                  >
                    Add Selected Skills
                  </button>
                  <button
                    type="button"
                    onClick={regenerateInlineAI}
                    className="px-3 py-1.5 bg-white text-black hover:bg-slate-100 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000]"
                  >
                    Regenerate
                  </button>
                  <button
                    type="button"
                    onClick={cancelInlineAI}
                    className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000]"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const WorkExperienceForm = ({
  workExperience = [],
  updateArrayItem = () => {},
  addArrayItem = () => {},
  removeArrayItem = () => {},
  activeInlineAI = {},
  triggerInlineAI = () => {},
  acceptInlineAI = () => {},
  regenerateInlineAI = () => {},
  cancelInlineAI = () => {}
}) => {
  return (
    <div className={workExperienceStyles.container}>
      <h2 className={workExperienceStyles.heading}>Work Experience</h2>
      <div className="space-y-6 mb-6">
        {workExperience?.map((experience, index) => (
          <div key={index} className={workExperienceStyles.item}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Company"
                placeholder="ABC Corp"
                value={experience?.company || ""}
                onChange={({ target }) => updateArrayItem(index, "company", target.value)}
              />

              <Input
                label="Role"
                placeholder="Frontend Developer"
                value={experience?.role || ""}
                onChange={({ target }) => updateArrayItem(index, "role", target.value)}
              />

              <Input
                label="Start Date"
                type="month"
                value={experience?.startDate || ""}
                onChange={({ target }) => updateArrayItem(index, "startDate", target.value)}
              />

              <Input
                label="End Date"
                type="month"
                value={experience?.endDate || ""}
                onChange={({ target }) => updateArrayItem(index, "endDate", target.value)}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-bold text-slate-700 mb-3">Description</label>
              <textarea
                placeholder="What did you do in this role?"
                className={workExperienceStyles.textarea}
                rows={3}
                value={experience?.description || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "description", target.value)
                }
              />

              {/* AI Suggestion Box */}
              {activeInlineAI.section === "experience" && activeInlineAI.index === index && (
                <div className="mt-3 p-4 border-2 border-black bg-[#ffe17c]/5 shadow-[4px_4px_0px_#000] flex flex-col gap-3">
                  {activeInlineAI.loading ? (
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Loader2 className="animate-spin text-black" size={16} />
                      Improving work description...
                    </div>
                  ) : (
                    <>
                      <div className="font-semibold text-xs text-slate-800 bg-white border border-black p-3 whitespace-pre-wrap leading-relaxed shadow-[2px_2px_0px_#000]">
                        {activeInlineAI.suggestion}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={acceptInlineAI}
                          className="px-3 py-1.5 bg-black text-white hover:bg-neutral-800 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#ffe17c]"
                        >
                          Apply to Resume
                        </button>
                        <button
                          type="button"
                          onClick={regenerateInlineAI}
                          className="px-3 py-1.5 bg-white text-black hover:bg-slate-100 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000]"
                        >
                          Regenerate
                        </button>
                        <button
                          type="button"
                          onClick={cancelInlineAI}
                          className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000]"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {!(activeInlineAI.section === "experience" && activeInlineAI.index === index) && (
                <button
                  type="button"
                  onClick={() =>
                    triggerInlineAI("experience", index, experience?.description || "", {
                      role: experience?.role,
                      company: experience?.company
                    })
                  }
                  className="flex items-center gap-1.5 mt-2 text-xs font-black bg-[#ffe17c] text-black border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
                >
                  <Sparkles size={14} /> Improve with AI
                </button>
              )}
            </div>

            {workExperience.length > 1 && (
              <button
                type="button"
                className={commonStyles.trashButton}
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className={`${commonStyles.addButtonBase} ${workExperienceStyles.addButton}`}
          onClick={() =>
            addArrayItem({
              company: "",
              role: "",
              startDate: "",
              endDate: "",
              description: ""
            })
          }
        >
          <Plus size={16} /> Add Work Experience
        </button>
      </div>
    </div>
  );
};
