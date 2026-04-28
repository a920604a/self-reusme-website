export const MODEL = '@cf/meta/llama-3.2-3b-instruct';

export function assembleQueryPrompt(docs, query) {
  const context = docs.length > 0 ? docs.join('\n\n') : 'No specific context found.';
  return `You are an AI assistant for a software engineer's personal portfolio website. Answer questions about the engineer's projects, work experience, and skills based on the context below. Be concise, helpful, and professional. If the context doesn't cover the question, answer based on general knowledge. Keep your answer under 400 words. IMPORTANT: Always reply in the same language the user used.

Context:
${context}

User: ${query}

Answer:`;
}
