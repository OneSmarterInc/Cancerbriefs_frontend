/**
 * Cleans, validates, and filters article summaries.
 * - Removes repeating date loops and repetitive phrases.
 * - Prevents any string/number from repeating consecutively more than 2 times.
 * - Aggressively strips ALL AI-generated markdown (*, #) and inline list numbers (1., 2.).
 * - Enforces a minimum length of 50 words.
 */
export function cleanSummary(text) {
  const fallbackMessage = "No summary is available for this article at this time. Click the original article link below to read the full coverage.";

  if (!text || typeof text !== "string") {
    return fallbackMessage;
  }

  let cleaned = text;

  // 1. Aggressively strip ALL markdown asterisks and hash symbols
  cleaned = cleaned.replace(/[*#]/g, "");

  // 2. Aggressively strip inline list numbers (e.g., "1. ", " 2. ", "3) ")
  // This matches a space (or start of text), digits, a dot or parenthesis, and space(s)
  cleaned = cleaned.replace(/(?:^|\s)\d+[\.\)]\s+/g, " ");

  // 3. Remove repeating date patterns like "2021 07 09. 2021 07 09..."
  const dateLoopRegex = /(\b(?:\d{4}[-/]\d{2}[-/]\d{2}|\d{2}[-/]\d{2}[-/]\d{4}|\d{4}\s\d{2}\s\d{2})\b\.?\s*){3,}/g;
  cleaned = cleaned.replace(dateLoopRegex, "");

  // 4. Prevent any word or number phrase from repeating consecutively more than 2 times
  const consecutiveRepeatRegex = /(\b[\w\s.-]+?\b)(?:\s+\1){2,}/gi;
  cleaned = cleaned.replace(consecutiveRepeatRegex, "$1");

  // 5. Remove general repeating sentences
  const repetitiveSentenceRegex = /([^.!?]+[.!?])\s*(?:\1\s*){2,}/gi;
  cleaned = cleaned.replace(repetitiveSentenceRegex, "$1");

  // 6. Clean up trailing fragments and normalize spacing
  cleaned = cleaned.replace(/(?:\b\d{4}\s\d{2}\s\d{2}\.?\s*)+$/g, "");
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // 7. VALIDATION: Check minimum word count (must be at least 50 words)
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length < 50) {
    return fallbackMessage;
  }

  return cleaned;
}

/**
 * Returns true only if the summary is valid, clean, and meets the 50-word minimum requirement.
 * Use this to filter out invalid articles entirely from feeds.
 */
export function isValidArticle(article) {
  if (!article || !article.summary) return false;
  const result = cleanSummary(article.summary);
  // If it returned the fallback message, it means it failed the 50-word validation check
  return !result.includes("No summary is available for this article");
}