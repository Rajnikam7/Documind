const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Call Groq LLM with context + question — same model as Python service
const askGroq = async (context, question) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: "Answer ONLY based on the provided context. If the answer is not in the context, say 'I don't know'.",
      },
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion:\n${question}`,
      },
    ],
  });

  return response.choices[0].message.content;
};

module.exports = { askGroq };
