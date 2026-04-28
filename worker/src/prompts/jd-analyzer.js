export const MODEL = '@cf/meta/llama-3.1-8b-instruct';

export function assembleJDAnalyzerPrompt(docs, jdText) {
  const profile = docs.length > 0 ? docs.join('\n\n') : 'No specific context found.';
  return `You are analyzing job fit for a software engineer's portfolio. Given the job description and candidate profile below, produce a structured fit analysis in Markdown with exactly these four sections:
## Key Requirements Match
## Relevant Projects
## Candidate Strengths for This Role
## Potential Gaps

Be specific, concise, and reference actual projects or skills from the candidate profile. Reply in the same language as the job description.

Job Description:
${jdText}

Candidate Profile:
${profile}

Analysis:`;
}
