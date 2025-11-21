import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  const { statement, date } = await request.json();

  if (!process.env.OPENROUTER_API_KEY) {
    console.warn("No OpenRouter API Key found. Returning mock response.");
    return NextResponse.json({
      outcome: Math.random() > 0.5 ? "Correct" : "Incorrect",
      confidence: 85,
      reasoning: "This is a simulated AI response because no OpenRouter API key was configured."
    });
  }

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:3000", // Optional, for including your app on openrouter.ai rankings.
      "X-Title": "PunditTracker", // Optional. Shows in rankings on openrouter.ai.
    },
  });

  try {
    const prompt = `
      You are a fact-checking assistant.
      Prediction: "${statement}"
      Date made: ${date}
      Current date: ${new Date().toISOString().split('T')[0]}

      Has this prediction come true?
      Return a JSON object with:
      - outcome: "Correct" | "Incorrect" | "Pending"
      - confidence: number (0-100)
      - reasoning: string (brief explanation)
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001',
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Grading Error:', error);
    return NextResponse.json(
      { error: 'Failed to grade prediction' },
      { status: 500 }
    );
  }
}
