import * as pdfParseModule from "pdf-parse";
import mammoth from "mammoth";
import { routeRequest } from "./AIRouterService.js";
import { cleanJsonResponse } from "./ProviderService.js";
import ResumeImport from "../models/resumeImportModel.js";
import { extractResumeLinks, extractLinksFromText, normalizeUrl } from "./extractResumeLinks.js";

// Support both CommonJS and ES Module export styles safely
const pdfParse = pdfParseModule.default || pdfParseModule;

// Startup diagnostic logging
console.log("pdfParse:", pdfParse);
console.log("typeof pdfParse:", typeof pdfParse);

const PROGRAMMING_LANGUAGES_AND_TECH = new Set([
  "javascript", "typescript", "python", "java", "c++", "c#", "c", "ruby", "go", "golang", "rust",
  "kotlin", "swift", "php", "sql", "html", "css", "bash", "shell", "r", "dart", "scala",
  "perl", "haskell", "clojure", "elixir", "node", "nodejs", "react", "vue", "angular",
  "mongodb", "mysql", "postgresql", "docker", "kubernetes", "aws", "gcp", "azure",
  "django", "flask", "spring", "laravel", "express", "next.js", "nextjs", "nuxt", "svelte",
  "git", "redis", "elasticsearch", "graphql", "rest api", "restful api", "nosql", "sass", "less",
  "jquery", "cplusplus"
]);

class ResumeParserService {
  /**
   * Parse uploaded file buffer based on MIME type and convert to structured JSON via AI
   */
  async parseResumeFile(userId, fileBuffer, mimeType, originalName) {
    let extractedText = "";
    let linkExtraction = { linkedin: null, github: null, leetcode: null, codechef: null, portfolio: null, email: null, all: [] };
    
    const isPDF = (mimeType === "application/pdf" || (originalName && originalName.toLowerCase().endsWith(".pdf")));
    const isDOCX = (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || (originalName && originalName.toLowerCase().endsWith(".docx")));
    const isTXT = (mimeType === "text/plain" || (originalName && originalName.toLowerCase().endsWith(".txt")));

    try {
      if (isPDF) {
        console.log("PDF Parsing Started");
        
        // Extract embedded hyperlinks using hybrid extractor
        linkExtraction = await extractResumeLinks(fileBuffer);
        
        // Extract text with markdown links enabled
        const p = new pdfParseModule.PDFParse({ data: fileBuffer });
        const textResult = await p.getText({ parseHyperlinks: true });
        extractedText = textResult.text;
        
        console.log("PDF Parsing Completed");
      } else if (isDOCX) {
        console.log("DOCX Parsing Started");
        const docxData = await mammoth.extractRawText({ buffer: fileBuffer });
        extractedText = docxData.value;
        
        // Extract links from plain text using regex
        const textExtracted = extractLinksFromText(extractedText);
        
        // Populate linkExtraction structure
        linkExtraction.all = textExtracted;
        const getBestLink = (type) => {
          const matches = textExtracted.filter(item => item.type === type);
          if (matches.length === 0) return null;
          matches.sort((a, b) => b.confidence - a.confidence);
          return matches[0].url;
        };
        linkExtraction.linkedin = getBestLink("linkedin");
        linkExtraction.github = getBestLink("github");
        linkExtraction.leetcode = getBestLink("leetcode");
        linkExtraction.codechef = getBestLink("codechef");
        linkExtraction.portfolio = getBestLink("portfolio");
        linkExtraction.email = getBestLink("email");
        
        console.log("DOCX Parsing Completed");
      } else {
        // Fallback or explicit TXT parsing
        console.log("TXT Parsing Started");
        extractedText = fileBuffer.toString("utf-8");
        
        // Extract links from plain text using regex
        const textExtracted = extractLinksFromText(extractedText);
        
        // Populate linkExtraction structure
        linkExtraction.all = textExtracted;
        const getBestLink = (type) => {
          const matches = textExtracted.filter(item => item.type === type);
          if (matches.length === 0) return null;
          matches.sort((a, b) => b.confidence - a.confidence);
          return matches[0].url;
        };
        linkExtraction.linkedin = getBestLink("linkedin");
        linkExtraction.github = getBestLink("github");
        linkExtraction.leetcode = getBestLink("leetcode");
        linkExtraction.codechef = getBestLink("codechef");
        linkExtraction.portfolio = getBestLink("portfolio");
        linkExtraction.email = getBestLink("email");
        
        console.log("TXT Parsing Completed");
      }
    } catch (err) {
      const stage = isPDF ? "pdf_parsing" : (isDOCX ? "docx_parsing" : "txt_parsing");
      console.error(`${stage.toUpperCase()} failed:`, err);
      
      // Log failure in MongoDB
      await ResumeImport.create({
        userId,
        fileName: originalName,
        fileType: mimeType || "unknown",
        status: "failed"
      });

      return {
        success: false,
        stage: stage,
        error: err.message,
        message: err.message
      };
    }

    // Clean and validate extracted text
    extractedText = extractedText ? extractedText.replace(/\u0000/g, "").trim() : "";

    if (!extractedText || extractedText.length === 0) {
      const stage = isPDF ? "pdf_parsing" : (isDOCX ? "docx_parsing" : "txt_parsing");
      console.error(`${stage.toUpperCase()} failed: No text content extracted.`);
      await ResumeImport.create({
        userId,
        fileName: originalName,
        fileType: mimeType || "unknown",
        status: "failed"
      });
      return {
        success: false,
        stage: stage,
        error: "No text content could be extracted from this document.",
        message: "No text content could be extracted from this document."
      };
    }

    // Call the AI Router with a parsing prompt
    const prompt = `
      You are an advanced AI resume parser. Parse the following raw text extracted from a resume and convert it into a structured, valid JSON object matching the requested schema.
      
      Return ONLY a JSON object. Do not include markdown wraps or code fences.
      Schema:
      {
        "parsedData": {
          "title": "Imported Resume",
          "profileInfo": {
            "fullName": "Full Name",
            "designation": "Current Title / Profession",
            "summary": "Professional summary paragraph"
          },
          "contactInfo": {
            "email": "Email Address",
            "phone": "Phone Number",
            "location": "Location (City, State, or Country)",
            "linkedin": "LinkedIn profile URL",
            "github": "GitHub profile URL",
            "website": "Personal portfolio or website URL",
            "leetcode": "LeetCode profile URL",
            "codechef": "CodeChef profile URL",
            "portfolio": "Portfolio URL"
          },
          "workExperience": [
            {
              "company": "Company Name",
              "role": "Job Title / Role",
              "startDate": "Start Date (e.g. YYYY-MM or Month YYYY)",
              "endDate": "End Date (e.g. YYYY-MM or Present)",
              "description": "Detailed bullet points or paragraph of achievements and tech stack used"
            }
          ],
          "education": [
            {
              "degree": "Degree or Course name",
              "institution": "University / Institution name",
              "startDate": "Start Date",
              "endDate": "Graduation Date"
            }
          ],
          "skills": [
            { "name": "Skill Name", "progress": 85 }
          ],
          "projects": [
            {
              "title": "Project Title",
              "description": "Short project summary and details",
              "github": "GitHub repo URL",
              "liveDemo": "Live demo URL",
              "githubUrl": "GitHub repo URL",
              "liveUrl": "Live URL",
              "demoUrl": "Demo URL"
            }
          ],
          "certifications": [
            { "title": "Certification Title", "issuer": "Issuer Organization", "year": "Year Issued" }
          ],
          "languages": [
            { "name": "Language Name", "progress": 80 }
          ],
          "interests": ["Interest 1", "Interest 2"]
        },
        "confidenceScores": {
          "profileInfo": 95,
          "contactInfo": 98,
          "education": 90,
          "workExperience": 85,
          "skills": 99,
          "projects": 88,
          "certifications": 90,
          "languages": 95
        }
      }

      CRITICAL INSTRUCTIONS:
      - The raw text contains inline markdown links (e.g. [GitHub](https://github.com/user) or [Live Demo](https://myproject.vercel.app)). Extract these exact URLs into contactInfo (linkedin, github, website, leetcode, codechef, portfolio) and projects.github / projects.liveDemo / projects.githubUrl / projects.liveUrl where appropriate.
      - NEVER guess, construct, or fabricate URLs from names/initials. If a URL is unavailable in the text (either as a plain URL or inside a markdown link), set the field value to null.
      - The "languages" section should contain ONLY spoken/human languages (e.g. English, Hindi, Spanish, French, German, Chinese, Japanese, etc.).
      - Programming languages (e.g. Java, Python, C++, JavaScript, TypeScript, Go, Rust, Kotlin, etc.) belong to the "skills" section. NEVER place programming languages, markup languages, or software frameworks in the "languages" section.

      Assign realistic confidence scores (from 0 to 100) reflecting how complete and clearly identified each parsed section was in the original text.

      Raw Text to Parse:
      ---
      ${extractedText}
      ---
    `;

    try {
      console.log("AI Parsing Started");
      const { text } = await routeRequest("resume_summary", prompt);
      const cleaned = cleanJsonResponse(text);
      const result = JSON.parse(cleaned);

      if (!result.parsedData || !result.confidenceScores) {
        throw new Error("Invalid output format returned by parsing model");
      }

      console.log("AI Parsing Completed");

      // Merge hybrid link extraction details into parsedData (directly overwrite or fill)
      if (!result.parsedData.contactInfo) {
        result.parsedData.contactInfo = {};
      }
      
      const cInfo = result.parsedData.contactInfo;
      cInfo.email = linkExtraction.email || cInfo.email || null;
      cInfo.phone = cInfo.phone || null;
      cInfo.linkedin = linkExtraction.linkedin || cInfo.linkedin || null;
      cInfo.github = linkExtraction.github || cInfo.github || null;
      cInfo.leetcode = linkExtraction.leetcode || cInfo.leetcode || null;
      cInfo.codechef = linkExtraction.codechef || cInfo.codechef || null;
      
      const parsedPortfolio = cInfo.portfolio || cInfo.website || null;
      cInfo.portfolio = linkExtraction.portfolio || parsedPortfolio || null;
      cInfo.website = cInfo.portfolio; // synchronize them

      // Normalize contact urls
      if (cInfo.linkedin) cInfo.linkedin = normalizeUrl(cInfo.linkedin);
      if (cInfo.github) cInfo.github = normalizeUrl(cInfo.github);
      if (cInfo.leetcode) cInfo.leetcode = normalizeUrl(cInfo.leetcode);
      if (cInfo.codechef) cInfo.codechef = normalizeUrl(cInfo.codechef);
      if (cInfo.portfolio) cInfo.portfolio = normalizeUrl(cInfo.portfolio);
      if (cInfo.website) cInfo.website = normalizeUrl(cInfo.website);

      // Clean template placeholders (like linkedin.com/in/LinkedIn or github.com/GitHub)
      const placeholderRegexes = [
        /linkedin\.com\/in\/linkedin$/i,
        /github\.com\/github$/i,
        /linkedin\.com\/in\/username$/i,
        /github\.com\/username$/i
      ];
      for (const field of ["linkedin", "github", "leetcode", "codechef", "portfolio", "website"]) {
        if (cInfo[field]) {
          const lowerVal = cInfo[field].toLowerCase();
          if (placeholderRegexes.some(rx => rx.test(lowerVal)) || lowerVal.endsWith("/placeholder")) {
            cInfo[field] = null;
          }
        }
      }

      // Handle Project Links classification and merging
      if (Array.isArray(result.parsedData.projects)) {
        for (const project of result.parsedData.projects) {
          const titleWords = (project.title || "").toLowerCase().split(/\s+/).filter(w => w.length > 2);
          
          // Heuristic fallback matching for project repository URLs if AI missed it
          if (!project.github) {
            const bestGithubMatch = linkExtraction.all.find(item => {
              if (item.type !== "project_repo") return false;
              const lowerUrl = item.url.toLowerCase();
              return titleWords.some(word => lowerUrl.includes(word));
            });
            if (bestGithubMatch) {
              project.github = bestGithubMatch.url;
            }
          }

          // Heuristic fallback matching for project live demo URLs if AI missed it
          if (!project.liveDemo) {
            const bestDemoMatch = linkExtraction.all.find(item => {
              if (item.type !== "portfolio") return false;
              const lowerUrl = item.url.toLowerCase();
              // Don't match the main portfolio URL
              if (cInfo.portfolio && lowerUrl === cInfo.portfolio.toLowerCase()) return false;
              return titleWords.some(word => lowerUrl.includes(word));
            });
            if (bestDemoMatch) {
              project.liveDemo = bestDemoMatch.url;
            }
          }

          // Normalize project URLs and set standard aliased fields
          const finalGithub = project.github ? normalizeUrl(project.github) : null;
          const finalDemo = project.liveDemo ? normalizeUrl(project.liveDemo) : (project.liveUrl ? normalizeUrl(project.liveUrl) : (project.demoUrl ? normalizeUrl(project.demoUrl) : null));
          
          project.github = finalGithub;
          project.liveDemo = finalDemo;
          project.githubUrl = finalGithub;
          project.liveUrl = finalDemo;
          project.demoUrl = finalDemo;
        }
      }

      // Calculate the specific confidence scores
      result.confidenceScores = {
        ...result.confidenceScores,
        email: cInfo.email ? 100 : 0,
        phone: cInfo.phone ? 100 : 0,
        githubUrl: cInfo.github ? 100 : 0,
        linkedinUrl: cInfo.linkedin ? 100 : 0,
        leetcodeUrl: cInfo.leetcode ? 100 : 0,
        codechefUrl: cInfo.codechef ? 100 : 0,
        portfolioUrl: cInfo.portfolio ? 100 : 0,
        githubLabel: (!cInfo.github && /\bgithub\b/i.test(extractedText)) ? 25 : 0,
        linkedinLabel: (!cInfo.linkedin && /\blinkedin\b/i.test(extractedText)) ? 25 : 0,
        leetcodeLabel: (!cInfo.leetcode && /\bleetcode\b/i.test(extractedText)) ? 25 : 0,
        codechefLabel: (!cInfo.codechef && /\bcodechef\b/i.test(extractedText)) ? 25 : 0,
        portfolioLabel: (!cInfo.portfolio && /\b(portfolio|website|homepage)\b/i.test(extractedText)) ? 25 : 0
      };

      // Post-process to ensure programming languages are categorized as Skills
      if (result.parsedData && Array.isArray(result.parsedData.languages)) {
        if (!result.parsedData.skills) {
          result.parsedData.skills = [];
        }
        
        const humanLanguages = [];
        for (const lang of result.parsedData.languages) {
          if (lang && lang.name) {
            const lowerName = lang.name.toLowerCase().trim();
            if (PROGRAMMING_LANGUAGES_AND_TECH.has(lowerName)) {
              // Move to skills if not already present
              const skillExists = result.parsedData.skills.some(
                s => s && s.name && s.name.toLowerCase().trim() === lowerName
              );
              if (!skillExists) {
                result.parsedData.skills.push({
                  name: lang.name,
                  progress: lang.progress || 80
                });
              }
            } else {
              humanLanguages.push(lang);
            }
          }
        }
        result.parsedData.languages = humanLanguages;
      }

      // Log success in DB
      await ResumeImport.create({
        userId,
        fileName: originalName,
        fileType: mimeType || "unknown",
        status: "success",
        confidenceScores: {
          profileInfo: result.confidenceScores.profileInfo || 0,
          contactInfo: result.confidenceScores.contactInfo || 0,
          education: result.confidenceScores.education || 0,
          workExperience: result.confidenceScores.workExperience || 0,
          skills: result.confidenceScores.skills || 0,
          projects: result.confidenceScores.projects || 0,
          certifications: result.confidenceScores.certifications || 0,
          languages: result.confidenceScores.languages || 0
        }
      });

      return {
        success: true,
        parsedData: result.parsedData,
        confidenceScores: result.confidenceScores
      };
    } catch (err) {
      console.error("AI Parsing process failed:", err);
      await ResumeImport.create({
        userId,
        fileName: originalName,
        fileType: mimeType || "unknown",
        status: "failed"
      });
      return {
        success: false,
        stage: "ai_parsing",
        error: err.message,
        message: err.message
      };
    }
  }
}

export default new ResumeParserService();
