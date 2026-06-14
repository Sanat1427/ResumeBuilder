// Neo-Brutalist Design System Mappings for ResumeBuilder Internal Experience

export const dashboardStyles = {
  // Container
  container: "p-6 max-w-7xl mx-auto w-full",
  
  // Create Button
  createButton: "neo-btn-push bg-[#ffe17c] text-black px-6 py-3",
  createButtonOverlay: "",
  createButtonContent: "flex items-center gap-2 text-sm uppercase tracking-wide",

  // Loading
  spinnerWrapper: "flex justify-center items-center py-16",
  spinner: "animate-spin rounded-none h-12 w-12 border-4 border-black border-t-[#ffe17c]",

  // Empty State
  emptyStateWrapper: "flex flex-col items-center justify-center py-16 text-center bg-white border-3 border-black p-8 shadow-[8px_8px_0px_#000] max-w-2xl mx-auto",
  emptyIconWrapper: "bg-[#ffe17c] border-2 border-black p-4 rounded-none mb-4 text-black shadow-[4px_4px_0px_#000]",
  emptyTitle: "text-2xl font-black uppercase tracking-tight mb-2 text-black",
  emptyText: "text-slate-700 font-bold mb-6 max-w-md",

  // Grid
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",

  // New Resume Card
  newResumeCard: "flex flex-col items-center justify-center bg-white border-2 border-black rounded-none p-6 cursor-pointer shadow-[8px_8px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#000] transition-all h-full text-center group",
  newResumeIcon: "w-16 h-16 bg-[#ffe17c] border-2 border-black flex items-center justify-center mb-4 shadow-[4px_4px_0px_#000] group-hover:scale-105 transition-transform",
  newResumeTitle: "text-lg font-black uppercase tracking-tight text-black mb-1",
  newResumeText: "text-slate-600 text-xs font-bold",
};

export const cardStyles = {
  // ProfileInfoCard styles
  profileCard: "flex items-center gap-3 p-2 bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#000] transition-all",
  profileInitialsContainer: "w-8 h-8 bg-[#ffe17c] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]",
  profileInitialsText: "text-xs font-black text-black",
  profileName: "text-xs font-black text-black uppercase",
  logoutButton: "text-red-500 text-[10px] font-black uppercase tracking-wider block hover:underline text-left cursor-pointer",
};

export const authStyles = {
  container: "w-[90vw] md:w-[400px] p-8 bg-white border-3 border-black rounded-none shadow-[12px_12px_0px_#000] text-black",
  headerWrapper: "text-center mb-6",
  title: "text-2xl font-black uppercase tracking-tight text-black mb-1",
  subtitle: "text-slate-700 font-bold text-sm",
  form: "space-y-4",
  errorMessage: "text-black text-xs font-bold bg-red-150 border-2 border-black px-4 py-3 rounded-none mb-4",
  submitButton: "w-full py-3 bg-[#ffe17c] text-black border-2 border-black font-black uppercase text-sm tracking-widest shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#000] transition-all cursor-pointer",
  switchText: "text-center text-xs text-slate-700 font-bold",
  switchButton: "font-black text-black underline uppercase tracking-wider hover:text-black/80 transition-colors"
};

// Common Styles
export const commonStyles = {
  trashButton: "absolute top-3 right-3 p-1.5 text-black bg-white hover:bg-red-400 border border-black rounded-none shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer",
  addButtonBase: "flex items-center gap-2 px-4 py-2.5 text-black border-2 border-black rounded-none font-extrabold text-xs uppercase bg-white shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#000] transition-all cursor-pointer w-fit",
};

// AdditionalInfoForm Styles
export const additionalInfoStyles = {
  container: "w-full mb-4",
  heading: "text-lg font-black uppercase tracking-tight border-b border-black pb-1.5 mb-4",
  sectionHeading: "text-xs font-black text-black uppercase tracking-wider mb-3 flex items-center gap-2",
  dotViolet: "w-2 h-2 bg-black rounded-none",
  dotOrange: "w-2 h-2 bg-[#ffe17c] border border-black rounded-none",
  languageItem: "relative bg-slate-50 border border-slate-200 p-4 rounded-none mb-3",
  interestItem: "relative mb-2",
  addButtonLanguage: "bg-white",
  addButtonInterest: "bg-white",
};

// CertificationInfoForm Styles
export const certificationInfoStyles = {
  container: "w-full mb-4",
  heading: "text-lg font-black uppercase tracking-tight border-b border-black pb-1.5 mb-4",
  item: "relative bg-slate-50 border border-slate-200 p-4 rounded-none mb-3",
  addButton: "bg-white",
};

// ContactInfoForm Styles
export const contactInfoStyles = {
  container: "w-full mb-4",
  heading: "text-lg font-black uppercase tracking-tight border-b border-black pb-1.5 mb-4",
};

// EducationDetailsForm Styles
export const educationDetailsStyles = {
  container: "w-full mb-4",
  heading: "text-lg font-black uppercase tracking-tight border-b border-black pb-1.5 mb-4",
  item: "relative bg-slate-50 border border-slate-200 p-4 rounded-none mb-3",
  addButton: "bg-white",
};

// ProfileInfoForm Styles
export const profileInfoStyles = {
  container: "w-full mb-4",
  heading: "text-lg font-black uppercase tracking-tight border-b border-black pb-1.5 mb-4",
  textarea: "w-full p-2.5 bg-white border-2 border-black rounded-none text-black outline-none font-bold text-sm placeholder-gray-500 focus:bg-[#ffe17c]/5",
};

// ProjectDetailForm Styles
export const projectDetailStyles = {
  container: "w-full mb-4",
  heading: "text-lg font-black uppercase tracking-tight border-b border-black pb-1.5 mb-4",
  item: "relative bg-slate-50 border border-slate-200 p-4 rounded-none mb-3",
  textarea: "w-full p-2.5 bg-white border-2 border-black rounded-none text-black outline-none font-bold text-sm placeholder-gray-500 focus:bg-[#ffe17c]/5",
  addButton: "bg-white",
};

// SkillsInfoForm Styles
export const skillsInfoStyles = {
  container: "w-full mb-4",
  heading: "text-lg font-black uppercase tracking-tight border-b border-black pb-1.5 mb-4",
  item: "relative bg-slate-50 border border-slate-200 p-4 rounded-none mb-3",
  addButton: "bg-white",
};

// WorkExperienceForm Styles
export const workExperienceStyles = {
  container: "w-full mb-4",
  heading: "text-lg font-black uppercase tracking-tight border-b border-black pb-1.5 mb-4",
  item: "relative bg-slate-50 border border-slate-200 p-4 rounded-none mb-3",
  textarea: "w-full p-2.5 bg-white border-2 border-black rounded-none text-black outline-none font-bold text-sm placeholder-gray-500 focus:bg-[#ffe17c]/5",
  addButton: "bg-white",
};

export const inputStyles = {
  wrapper: "mb-3 group",
  label: "block text-[11px] font-black text-black uppercase tracking-wider mb-1 group-focus-within:text-black transition-colors",
  inputContainer: focused => `relative flex items-center bg-white border-2 border-black px-3 py-2 rounded-none transition-all duration-100 ${focused ? 'shadow-[2px_2px_0px_#000] bg-[#ffe17c]/5' : ''}`,
  inputField: "w-full bg-transparent outline-none text-black placeholder-gray-500 font-bold text-sm",
  toggleButton: "text-black hover:text-black/75 p-1 border border-black rounded-none bg-white",
};

export const photoSelectorStyles = {
  container: "flex justify-center mb-8",
  hiddenInput: "hidden",
  placeholder: hovered => `relative w-32 h-32 flex items-center justify-center bg-white border-2 border-black rounded-none cursor-pointer transition-all duration-200 ${hovered ? 'bg-[#ffe17c]/10' : ''}`,
  cameraButton: "absolute -bottom-1 -right-1 w-10 h-10 flex items-center justify-center bg-[#ffe17c] hover:bg-yellow-400 text-black border-2 border-black transition-all shadow-[2px_2px_0px_#000]",
  previewWrapper: "relative group",
  previewImageContainer: hovered => `w-32 h-32 rounded-none overflow-hidden border-2 border-black shadow-[4px_4px_0px_#000]`,
  previewImage: "w-full h-full object-cover cursor-pointer",
  overlay: "absolute inset-0 bg-black/40 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2",
  actionButton: (bg, hoverBg, textColor) => `w-8 h-8 flex items-center justify-center bg-white text-black border border-black rounded-none hover:bg-[#ffe17c] transition-all`,
};

export const titleInputStyles = {
  container: "flex items-center gap-2",
  titleText: "text-lg font-black text-black uppercase tracking-tight",
  editButton: "p-1.5 border-2 border-black bg-white text-black rounded-none neo-btn-push-sm shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000]",
  editIcon: "w-4 h-4 text-black",
  inputField: focused => `text-lg font-black bg-white border-2 border-black px-2 py-1 outline-none text-black rounded-none ${focused ? 'bg-[#ffe17c]/10' : ''}`,
  confirmButton: "p-1.5 border-2 border-black bg-[#ffe17c] text-black rounded-none neo-btn-push-sm font-black",
};

export const modalStyles = {
  overlay: "fixed inset-0 flex items-center justify-center w-full h-full bg-[#171e19]/60 backdrop-blur-xs z-50 p-4",
  container: "relative flex flex-col bg-white border-3 border-black rounded-none overflow-hidden w-full max-h-[90vh] shadow-[12px_12px_0px_#000] max-w-lg",
  header: "flex items-center justify-between p-5 border-b-2 border-black bg-[#ffe17c] text-black",
  title: "text-lg font-extrabold uppercase tracking-tight text-black",
  actionButton: "flex items-center gap-2 px-5 py-2.5 bg-[#b7c6c2] text-black border-2 border-black rounded-none shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] transition-all font-black text-xs uppercase",
  closeButton: "absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white hover:bg-[#ffe17c] text-black rounded-none border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all z-10",
  body: "flex-1 overflow-y-auto"
};

export const infoStyles = {
  // Progress
  progressWrapper: "w-16 h-2 bg-white border border-black rounded-none overflow-hidden",
  progressBar: color => `h-full rounded-none transition-all`,

  // ActionLink
  actionWrapper: "flex items-center gap-2",
  actionIconWrapper: "w-5 h-5 flex items-center justify-center rounded-none border border-black bg-white text-black",
  actionLink: "text-xs font-bold underline cursor-pointer break-all text-black hover:text-black/80 transition-colors",

  // CertificationInfo
  certContainer: "mb-3 p-2 bg-[#b7c6c2]/10 border border-black",
  certTitle: "text-xs font-black text-black uppercase",
  certRow: "flex items-center gap-2 mt-0.5",
  certYear: bgColor => `text-[9px] font-black text-black px-1.5 py-0.5 border border-black bg-[#ffe17c] rounded-none`,
  certIssuer: "text-[11px] text-slate-700 font-bold",

  // ContactInfo
  contactRow: "flex items-center gap-2 mb-2",
  contactIconWrapper: "w-6 h-6 flex items-center justify-center rounded-none border border-black bg-[#ffe17c] text-black",
  contactText: "flex-1 text-xs font-bold break-all text-slate-800",

  // EducationInfo
  eduContainer: "mb-4 border-l-2 border-black pl-3",
  eduDegree: "text-xs font-extrabold text-black uppercase pb-0.5",
  eduInstitution: "text-xs text-slate-700 font-bold",
  eduDuration: "text-[10px] text-slate-500 font-bold italic mt-0.5",

  // Language/Skill Info
  infoRow: "flex items-center justify-between mb-2",
  infoLabel: "text-xs font-bold text-black uppercase",

  // Links
  linkRow: "flex items-center space-x-1 hover:underline text-black font-bold text-xs",

  // ProjectInfo
  projectContainer: "mb-4 border border-black p-3 bg-white",
  projectTitle: isPreview => `${isPreview ? 'text-xs' : 'text-sm'} font-black text-black uppercase`,
  projectDesc: "text-xs text-slate-700 mt-1 font-bold leading-normal",
  projectLinks: "flex items-center gap-3 font-bold mt-2",

  // RatingInput
  ratingWrapper: "flex gap-1 cursor-pointer",
  ratingDot: "w-2.5 h-2.5 border border-black rounded-none transition-all hover:scale-110",

  // SkillSection
  skillGrid: "grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4",

  // WorkExperience
  workContainer: "mb-4 border-l-2 border-black pl-3",
  workHeader: "flex items-start justify-between mb-1",
  workCompany: "text-xs font-extrabold text-black uppercase pb-0.5",
  workRole: "text-xs font-bold text-slate-700",
  workDuration: color => `text-xs font-bold italic`,
  workDesc: "text-xs text-slate-600 font-bold leading-normal"
};

export const shimmerStyle = ""; // Removed to prevent any Rollup build issues if unused