export const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

export function assembleJobApplyPrompt(jd, matchSummary, candidateProfile) {
  return `You are a professional resume writer. Generate a customized resume AND a cover letter for a software engineer applying to the job below.

IMPORTANT FORMAT RULES:
1. Start the resume with exactly: <!-- RESUME_START -->
2. Start the cover letter with exactly: <!-- COVER_START -->
3. Use Markdown formatting throughout
4. Do NOT add any text before <!-- RESUME_START -->

Resume requirements:
- Tailor skills and experience bullet points to match the job description
- Lead with a Professional Summary (2-3 sentences) targeting this specific role
- Include: Professional Summary, Skills, Work Experience, Projects, Education
- For each work experience: use strong action verbs and quantified achievements
- Highlight the most relevant projects from the candidate profile

Cover letter requirements:
- 3-4 paragraphs, professional tone
- Paragraph 1: Express interest and hook with your strongest qualification
- Paragraph 2: Match your top 2-3 experiences to key job requirements
- Paragraph 3: Highlight a relevant project or achievement
- Paragraph 4: Call to action

IMPORTANT: Reply in the same language as the job description.

Job Description:
${jd}

Match Analysis (use this to identify what to emphasize):
${matchSummary}

Candidate Profile:
${candidateProfile}

Output:`;
}
