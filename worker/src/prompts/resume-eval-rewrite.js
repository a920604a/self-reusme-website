export const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

export function assembleResumeEvalRewritePrompt(scoresJson, candidateData) {
  return `You are a senior tech career coach. Based on the resume evaluation scores below, provide specific and actionable improvement suggestions.

Focus only on dimensions with score below 7. For each weak dimension:
1. Explain in one sentence what is lacking
2. Provide a concrete rewrite example using content from the candidate's actual profile

Format in Markdown with one ## section per weak dimension. Be direct — no generic advice.
IMPORTANT: Reply in the same language as the job description if present in the scores, otherwise use English.

Evaluation Scores:
${scoresJson}

Candidate Profile:
${candidateData}

Improvement Suggestions:`;
}
