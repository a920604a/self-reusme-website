export const MODEL = '@cf/meta/llama-3.1-8b-instruct';

export function assembleResumeEvalJDPrompt(candidateData, jd) {
  return `You are a technical recruiter evaluating a software engineer's resume against a specific job description.

CRITICAL RULES:
- Output ONLY a valid JSON object. No markdown fences, no explanation, no preamble, no text after the closing brace.
- Scores are integers 0–10 (10 = exceptional).

Dimensions to evaluate:
- ats_compatibility: How well the resume passes ATS keyword filtering for this role (0–10)
- job_relevance: How relevant the candidate's experience is to this specific role (0–10)
- differentiation: How much the candidate stands out vs typical applicants for this role (0–10)
- missing_keywords: Array of important keywords/skills from the JD absent or underrepresented in the resume (be specific)
- hiring_recommendation: One of exactly: "Strong Yes", "Yes", "Maybe", "No"

Required output format (output exactly this structure):
{"ats_compatibility":{"score":0,"reason":""},"job_relevance":{"score":0,"reason":""},"differentiation":{"score":0,"reason":""},"missing_keywords":[],"hiring_recommendation":""}

Replace values with your actual evaluation. Each reason must be ONE sentence only. missing_keywords should be 3–8 items max.

Job Description:
${jd}

Candidate Profile:
${candidateData}

JSON output:`;
}
