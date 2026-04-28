export const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

export function assembleJobResumePrompt(jd, matchSummary, candidateProfile) {
  return `You are a professional resume writer. Generate a customized resume in Markdown for a software engineer applying to the job below.

Requirements:
- Lead with a Professional Summary (2-3 sentences) targeting this specific role
- Include: Professional Summary, Skills, Work Experience, Projects, Education
- Tailor skills and experience bullet points to match the job description
- Use strong action verbs and quantified achievements
- Highlight the most relevant projects from the candidate profile

IMPORTANT: Reply in the same language as the job description. Output Markdown only, no extra commentary.

Job Description:
${jd}

Match Analysis (use this to identify what to emphasize):
${matchSummary}

Candidate Profile:
${candidateProfile}

Output:`;
}
