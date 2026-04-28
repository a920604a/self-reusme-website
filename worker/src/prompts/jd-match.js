export const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

export function assembleJDMatchPrompt(docs, jd) {
  const context = docs.length > 0 ? docs.join('\n\n') : 'No specific profile context found.';
  return `You are a software engineer evaluating a job posting to decide whether to apply. Analyze the fit from YOUR perspective as the candidate based on the job description and your portfolio profile below.

Produce a structured analysis in Markdown with EXACTLY these four sections (use the exact headings):
## 契合度總覽
## 強項
## 落差
## 面試準備建議

Guidelines:
- 契合度總覽: Give an overall fit score (e.g. 75/100) and 2-3 sentence summary of fit
- 強項: List 3-5 specific strengths matching this role with evidence from your profile
- 落差: List 2-4 honest gaps or weaknesses for this role with realistic mitigation strategies
- 面試準備建議: Give 3-5 concrete preparation tips specific to this role and company

Be honest, specific, and reference actual projects or skills from your profile. IMPORTANT: Reply in the same language as the job description.

Job Description:
${jd}

Your Professional Profile:
${context}

Analysis:`;
}
