import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import * as pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.mjs";

// Safe Web Worker config for serverless/Node.js environment
globalThis.pdfjsWorker = pdfjsWorker;
pdfjs.GlobalWorkerOptions.workerSrc = "";

/**
 * Truncates an extracted link match if it greedily consumed a subsequent domain name
 * (which happens when text items are joined without spaces).
 * @param {string} url 
 * @returns {string}
 */
export function truncateAtNextDomain(url) {
  if (!url) return "";
  const lower = url.toLowerCase();
  const keywords = [
    "github",
    "linkedin",
    "leetcode",
    "codechef",
    "vercel",
    "netlify",
    "render",
    "gmail",
    "yahoo",
    "outlook",
    "mailto"
  ];
  
  let earliestIndex = url.length;
  for (const kw of keywords) {
    const index = lower.lastIndexOf(kw);
    
    // Check if the keyword is at the very end of the URL
    if (index > 8 && index + kw.length === url.length) {
      // Avoid truncating if the keyword is the domain of the URL itself
      const domainPrefix = kw + ".";
      const firstDomainIndex = lower.indexOf(domainPrefix);
      const isDomainOfUrl = firstDomainIndex >= 0 && firstDomainIndex < 15;
      
      if (!isDomainOfUrl && index < earliestIndex) {
        earliestIndex = index;
      }
    }
  }
  
  let result = url.substring(0, earliestIndex);
  // Remove trailing dashes or underscores
  result = result.replace(/[-_]+$/, "");
  return result;
}

/**
 * Normalizes a URL by ensuring it contains the http/https protocol prefix.
 * @param {string} url 
 * @returns {string}
 */
export function normalizeUrl(url) {
  if (!url) return "";
  const cleaned = url.trim().replace(/\s+/g, "");
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleaned)) {
    // It's an email, don't prepend https://
    return cleaned;
  }
  if (!/^https?:\/\//i.test(cleaned)) {
    return `https://${cleaned}`;
  }
  return cleaned;
}

/**
 * Categorizes a given URL/link and returns its type.
 * @param {string} url 
 * @returns {string} One of 'email', 'linkedin', 'github', 'leetcode', 'codechef', 'portfolio', 'project_repo', or 'project_demo'
 */
export function classifyUrl(url) {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes("@") || lowerUrl.startsWith("mailto:")) {
    return "email";
  }
  
  if (lowerUrl.includes("linkedin.com/in/")) {
    return "linkedin";
  }
  
  if (lowerUrl.includes("github.com/")) {
    const githubProjectPattern = /github\.com\/[a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_]+/;
    if (githubProjectPattern.test(lowerUrl)) {
      return "project_repo";
    }
    return "github";
  }
  
  if (lowerUrl.includes("leetcode.com/")) {
    return "leetcode";
  }
  
  if (lowerUrl.includes("codechef.com/")) {
    return "codechef";
  }

  // Portfolio / Live Demo detections
  if (
    lowerUrl.includes("vercel.app") ||
    lowerUrl.includes("netlify.app") ||
    lowerUrl.includes("render.com") ||
    lowerUrl.includes("github.io") ||
    lowerUrl.includes("pages.dev")
  ) {
    return "portfolio";
  }
  
  return "portfolio"; // fallback for general custom domains
}

/**
 * Extracts links from plain text using regex.
 * @param {string} text 
 * @returns {Array<{url: string, type: string, source: string, confidence: number}>}
 */
export function extractLinksFromText(text) {
  if (!text) return [];
  const allLinks = [];

  const joinedText = text;

  // Define regex patterns that tolerate whitespace inside domain name
  const emailRegex = /[a-zA-Z0-9._%+-]+\s*@\s*[a-zA-Z0-9.-]+\s*\.\s*[a-zA-Z]{2,}/gi;
  const linkedinRegex = /linkedin\s*\.?\s*com\s*\/\s*in\s*\/\s*[a-zA-Z0-9\-_%]+/gi;
  const githubRegex = /github\s*\.?\s*com\s*\/\s*[a-zA-Z0-9\-_]+(?:\/[a-zA-Z0-9\-_]+)*/gi;
  const leetcodeRegex = /leetcode\s*\.?\s*com\s*\/\s*[a-zA-Z0-9\-_]+/gi;
  const codechefRegex = /codechef\s*\.?\s*com\s*\/\s*[a-zA-Z0-9\-_]+/gi;
  const generalUrlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9\-]+\s*\.\s*[a-zA-Z]{2,}(?:\/[^\s]*)?/gi;

  // Process Emails
  const emailMatches = joinedText.match(emailRegex);
  if (emailMatches) {
    for (const match of emailMatches) {
      const truncated = truncateAtNextDomain(match);
      const normalized = normalizeUrl(truncated);
      allLinks.push({
        url: normalized,
        type: "email",
        source: "text",
        confidence: 0.85
      });
    }
  }

  // Process LinkedIn
  const linkedinMatches = joinedText.match(linkedinRegex);
  if (linkedinMatches) {
    for (const match of linkedinMatches) {
      const truncated = truncateAtNextDomain(match);
      const normalized = normalizeUrl(truncated);
      allLinks.push({
        url: normalized,
        type: "linkedin",
        source: "text",
        confidence: 0.85
      });
    }
  }

  // Process GitHub
  const githubMatches = joinedText.match(githubRegex);
  if (githubMatches) {
    for (const match of githubMatches) {
      const truncated = truncateAtNextDomain(match);
      const normalized = normalizeUrl(truncated);
      const type = classifyUrl(normalized);
      allLinks.push({
        url: normalized,
        type: type,
        source: "text",
        confidence: 0.85
      });
    }
  }

  // Process LeetCode
  const leetcodeMatches = joinedText.match(leetcodeRegex);
  if (leetcodeMatches) {
    for (const match of leetcodeMatches) {
      const truncated = truncateAtNextDomain(match);
      const normalized = normalizeUrl(truncated);
      allLinks.push({
        url: normalized,
        type: "leetcode",
        source: "text",
        confidence: 0.85
      });
    }
  }

  // Process CodeChef
  const codechefMatches = joinedText.match(codechefRegex);
  if (codechefMatches) {
    for (const match of codechefMatches) {
      const truncated = truncateAtNextDomain(match);
      const normalized = normalizeUrl(truncated);
      allLinks.push({
        url: normalized,
        type: "codechef",
        source: "text",
        confidence: 0.85
      });
    }
  }

  // Process General Websites
  const webMatches = joinedText.match(generalUrlRegex);
  if (webMatches) {
    for (const match of webMatches) {
      const truncated = truncateAtNextDomain(match);
      const normalized = normalizeUrl(truncated);
      const lowerNorm = normalized.toLowerCase();
      
      if (
        !lowerNorm.includes("@") &&
        !lowerNorm.includes("linkedin.com") &&
        !lowerNorm.includes("github.com") &&
        !lowerNorm.includes("leetcode.com") &&
        !lowerNorm.includes("codechef.com")
      ) {
        allLinks.push({
          url: normalized,
          type: "portfolio",
          source: "text",
          confidence: 0.85
        });
      }
    }
  }

  return allLinks;
}

export let getDocumentOverride = null;
export function setGetDocumentOverride(fn) {
  getDocumentOverride = fn;
}

/**
 * Extracts links and contact info from PDF using annotations and text parsing
 * @param {Buffer} buffer 
 * @returns {Promise<{ linkedin: string|null, github: string|null, portfolio: string|null, leetcode: string|null, codechef: string|null, email: string|null, all: Array<{url: string, type: string, source: string, confidence: number}> }>}
 */
export async function extractResumeLinks(buffer) {
  const allLinks = [];

  try {
    const loadingTask = getDocumentOverride
      ? getDocumentOverride(buffer)
      : pdfjs.getDocument({
          data: new Uint8Array(buffer),
          verbosity: 0
        });
    const doc = await loadingTask.promise;

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);

      // --- Stage 1: Annotation Hyperlinks ---
      const annotations = await page.getAnnotations();
      if (Array.isArray(annotations)) {
        for (const annot of annotations) {
          if (annot.subtype === "Link" && annot.url) {
            const rawUrl = annot.url.trim();
            const normalized = normalizeUrl(rawUrl);
            const type = classifyUrl(normalized);
            allLinks.push({
              url: normalized,
              type: type,
              source: "annotation",
              confidence: 1.0
            });
          }
        }
      }

      // --- Stage 2: Plain Text Fallback (Joined without spaces) ---
      const textContent = await page.getTextContent();
      if (textContent && Array.isArray(textContent.items)) {
        const joinedText = textContent.items.map(item => item.str).join("");
        const textExtracted = extractLinksFromText(joinedText);
        allLinks.push(...textExtracted);
      }
    }
  } catch (error) {
    console.error("extractResumeLinks helper error:", error);
  }

  // --- Stage 3: Deduplication and Selection ---
  const result = {
    linkedin: null,
    github: null,
    leetcode: null,
    codechef: null,
    portfolio: null,
    email: null,
    all: []
  };

  const uniqueUrlMap = new Map();
  for (const item of allLinks) {
    const key = item.url.toLowerCase();
    const existing = uniqueUrlMap.get(key);
    if (!existing || item.confidence > existing.confidence) {
      uniqueUrlMap.set(key, item);
    }
  }

  const dedupedLinks = Array.from(uniqueUrlMap.values());
  result.all = dedupedLinks;

  const getBestLink = (type) => {
    const matches = dedupedLinks.filter(item => item.type === type);
    if (matches.length === 0) return null;
    matches.sort((a, b) => b.confidence - a.confidence);
    return matches[0].url;
  };

  result.linkedin = getBestLink("linkedin");
  result.github = getBestLink("github");
  result.leetcode = getBestLink("leetcode");
  result.codechef = getBestLink("codechef");
  result.portfolio = getBestLink("portfolio");
  result.email = getBestLink("email");

  return result;
}
