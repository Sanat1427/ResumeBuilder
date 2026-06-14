import Resume1 from "../assets/Resume1.png"
import Resume2 from "../assets/Resume2.png"
import Resume3 from "../assets/Resume3.png"

export const resumeTemplates = [
  {
    id: "ats-classic",
    name: "ATS Classic",
    description: "Single column ultra-clean layout designed for maximum parsing accuracy with applicant tracking systems.",
    thumbnailImg: Resume1,
    category: "ATS Friendly",
    atsScore: 98,
    badge: "ATS SAFE",
    recommendedFor: ["Software Engineers", "Accountants", "Financial Analysts", "Data Scientists"],
    isPopular: false,
    layoutType: "single",
    defaultTheme: {
      primaryColor: "#000000",
      accentColor: "#4b5563",
      fontFamily: "'Inter', sans-serif",
      layout: "classic"
    }
  },
  {
    id: "modern-professional",
    name: "Modern Professional",
    description: "Balanced single column layout with clean dividers and balanced spacing, perfect for most job seekers.",
    thumbnailImg: Resume2,
    category: "Professional",
    atsScore: 95,
    badge: "MOST POPULAR",
    recommendedFor: ["Project Managers", "Product Managers", "Operations Directors", "Consultants"],
    isPopular: true,
    layoutType: "single",
    defaultTheme: {
      primaryColor: "#1e3a8a",
      accentColor: "#3b82f6",
      fontFamily: "'Poppins', sans-serif",
      layout: "modern"
    }
  },
  {
    id: "software-engineer",
    name: "Software Engineer",
    description: "Technical layout prioritizing developer projects, programming skills, and Github contributions near the top.",
    thumbnailImg: Resume3,
    category: "Developer",
    atsScore: 96,
    badge: "DEVELOPER FAVORITE",
    recommendedFor: ["Full Stack Engineers", "DevOps Engineers", "Mobile Developers", "Systems Architects"],
    isPopular: false,
    layoutType: "single",
    defaultTheme: {
      primaryColor: "#0f172a",
      accentColor: "#10b981",
      fontFamily: "'Roboto Mono', monospace",
      layout: "modern"
    }
  },
  {
    id: "student-fresher",
    name: "Student / Fresher",
    description: "Highlights education, university projects, and internships to showcase potential for entry-level positions.",
    thumbnailImg: Resume1,
    category: "Student",
    atsScore: 94,
    badge: "BEST FOR FRESHERS",
    recommendedFor: ["Recent College Graduates", "Summer Interns", "Entry-level candidates"],
    isPopular: false,
    layoutType: "single",
    defaultTheme: {
      primaryColor: "#4f46e5",
      accentColor: "#818cf8",
      fontFamily: "'Poppins', sans-serif",
      layout: "modern"
    }
  },
  {
    id: "executive",
    name: "Executive",
    description: "Elegant layout with high-impact leadership summary, professional typography, and achievements highlighted.",
    thumbnailImg: Resume2,
    category: "Executive",
    atsScore: 93,
    badge: "EXECUTIVE",
    recommendedFor: ["Directors", "VPs", "C-Level Officers", "Senior Product Managers"],
    isPopular: false,
    layoutType: "single",
    defaultTheme: {
      primaryColor: "#451a03",
      accentColor: "#d97706",
      fontFamily: "'Playfair Display', serif",
      layout: "classic"
    }
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Spacious layout with modern sans-serif typography, large margins, and zero visual clutter.",
    thumbnailImg: Resume3,
    category: "Creative",
    atsScore: 91,
    badge: "MINIMAL",
    recommendedFor: ["Consultants", "Product Designers", "Architects", "UX Researchers"],
    isPopular: false,
    layoutType: "single",
    defaultTheme: {
      primaryColor: "#1f2937",
      accentColor: "#6b7280",
      fontFamily: "'Inter', sans-serif",
      layout: "compact"
    }
  },
  {
    id: "two-column-professional",
    name: "Two Column Professional",
    description: "Splits info into a technical details sidebar and professional work experience main body.",
    thumbnailImg: Resume2,
    category: "Professional",
    atsScore: 92,
    badge: "TRENDING",
    recommendedFor: ["Sales Representatives", "Marketing Managers", "HR Professionals"],
    isPopular: false,
    layoutType: "two-column",
    defaultTheme: {
      primaryColor: "#0f172a",
      accentColor: "#0284c7",
      fontFamily: "'Inter', sans-serif",
      layout: "modern"
    }
  },
  {
    id: "creative",
    name: "Creative",
    description: "Design-centric two-column layout with expressive accents, rounded progress scales, and modern details.",
    thumbnailImg: Resume3,
    category: "Creative",
    atsScore: 88,
    badge: "CREATIVE",
    recommendedFor: ["Graphic Designers", "Art Directors", "Copywriters", "UX/UI Designers"],
    isPopular: false,
    layoutType: "two-column",
    defaultTheme: {
      primaryColor: "#db2777",
      accentColor: "#f59e0b",
      fontFamily: "'Poppins', sans-serif",
      layout: "creative"
    }
  }
];

export const DUMMY_RESUME_DATA = {
    profileInfo: {
        previewUrl: "",
        fullName: "Alex Johnson",
        designation: "Senior Software Developer",
        summary: "Full-stack developer with 5+ years of experience building scalable web applications using modern JavaScript frameworks. Specialized in React, Node.js, and cloud technologies with a strong focus on clean code architecture and performance optimization. Passionate about mentoring junior developers and implementing agile best practices.",
    },
    contactInfo: {
        email: "alex.johnson.dev@gmail.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "https://linkedin.com/in/alexjohnson-dev",
        github: "https://github.com/alexjohnson-code",
        website: "https://alexjohnson.dev",
    },
    education: [
        {
            institution: "Stanford University",
            degree: "Master of Science",
            major: "Computer Science",
            minors: "Data Science",
            location: "Stanford, CA",
            graduationYear: "2018"
        },
        {
            institution: "University of California",
            degree: "Bachelor of Science",
            major: "Software Engineering",
            minors: "Mathematics",
            location: "Berkeley, CA",
            graduationYear: "2016"
        }
    ],
    workExperience: [
        {
            role: "Senior Software Engineer",
            company: "TechSolutions Inc.",
            location: "San Francisco, CA",
            startDate: "2020-06-01",
            endDate: "2023-12-31",
            description: "Led a team of 5 developers in building a SaaS platform serving 50,000+ users.\nArchitected microservices using Node.js and React that improved system performance by 40%.\nImplemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes.\nMentored junior developers through code reviews and pair programming sessions."
        },
        {
            role: "Software Developer",
            company: "InnovateSoft",
            location: "San Jose, CA",
            startDate: "2018-07-01",
            endDate: "2020-05-31",
            description: "Developed RESTful APIs handling 10,000+ requests per minute with 99.9% uptime.\nRedesigned legacy frontend using React, improving page load speed by 60%.\nCollaborated with UX team to implement responsive designs for mobile users.\nAutomated testing processes increasing test coverage from 65% to 95%."
        }
    ],
    projects: [
        {
            title: "E-commerce Analytics Dashboard",
            startDate: "2022-03-01",
            endDate: "2022-08-31",
            description: "Built a real-time analytics dashboard for e-commerce clients to track sales, inventory, and customer behavior.",
            technologies: ["React", "D3.js", "Node.js", "MongoDB"],
            github: "https://github.com/alexjohnson-code/ecommerce-analytics",
            liveDemo: "https://demo.alexjohnson.dev/analytics"
        },
        {
            title: "AI-Powered Code Review Tool",
            startDate: "2021-01-01",
            endDate: "2021-06-30",
            description: "Developed a machine learning tool that analyzes pull requests and suggests code improvements.",
            technologies: ["Python", "TensorFlow", "Flask", "GitHub API"],
            github: "https://github.com/alexjohnson-code/ai-code-review"
        }
    ],
    skills: [
        { name: "JavaScript" },
        { name: "TypeScript" },
        { name: "React" },
        { name: "Node.js" },
        { name: "Python" },
        { name: "AWS" },
        { name: "Docker" },
        { name: "Kubernetes" },
        { name: "GraphQL" },
        { name: "MongoDB" },
        { name: "PostgreSQL" },
        { name: "Git" },
        { name: "Agile" },
        { name: "Scrum" },
        { name: "JIRA" }
    ],
    certifications: [
        {
            title: "AWS Certified Solutions Architect",
            year: "2022"
        },
        {
            title: "Google Professional Cloud Architect",
            year: "2021"
        },
        {
            title: "Certified Scrum Master",
            year: "2020"
        }
    ],
    interests: [
        "Open Source Contributions",
        "Machine Learning",
        "Blockchain Technology",
        "Hiking",
        "Photography"
    ]
};