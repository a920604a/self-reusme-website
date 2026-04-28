export const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

export function assembleJobCoverPrompt(jd, matchSummary, candidateProfile) {
  return `You are a professional cover letter writer. Generate a cover letter in Markdown for a software engineer applying to the job below.

Requirements:
- 3-4 paragraphs, professional tone
- Paragraph 1: Express interest and hook with your strongest qualification
- Paragraph 2: Match your top 2-3 experiences to key job requirements
- Paragraph 3: Highlight a relevant project or achievement
- Paragraph 4: Call to action

IMPORTANT: Reply in the same language as the job description. Output Markdown only, no extra commentary.

Job Description:
${jd}

Match Analysis (use this to identify what to emphasize):
${matchSummary}

Candidate Profile:
${candidateProfile}

Output:`;
}
