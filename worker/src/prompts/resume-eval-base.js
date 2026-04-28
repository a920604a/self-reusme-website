export const MODEL = '@cf/meta/llama-3.1-8b-instruct';

export function assembleResumeEvalBasePrompt(candidateData) {
  return `You are an expert resume evaluator for software engineers. Evaluate the candidate profile across 5 dimensions.

CRITICAL RULES:
- Output ONLY a valid JSON object. No markdown fences, no explanation, no preamble, no text after the closing brace.
- Scores are integers 0–10 (10 = exceptional).

Dimensions to evaluate:
- impact: Quantified achievements and measurable business outcomes
- technical_depth: Depth and complexity of technical work and skills
- readability: Clarity, structure, strong action verbs, conciseness
- ownership: Evidence of leadership, initiative, end-to-end ownership
- career_progression: Clear upward trajectory and increasing responsibility

Required output format (output exactly this structure):
{"impact":{"score":0,"reason":""},"technical_depth":{"score":0,"reason":""},"readability":{"score":0,"reason":""},"ownership":{"score":0,"reason":""},"career_progression":{"score":0,"reason":""}}

Replace the 0s and empty strings with your actual evaluation. Each reason must be ONE sentence only.

Candidate Profile:
${candidateData}

JSON output:`;
}
