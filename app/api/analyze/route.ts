import { OpenAI } from "openai";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; 
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions); 

  console.log("Session in analysis:", session);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { owner, repo } = await request.json();

  const [readme, commits] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/vnd.github.raw",
      },
    }).then(res => res.text()),
    fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }).then(res => res.json()),
  ]);

  const analysis = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Você é um assistente de IA útil que analisa repositórios do GitHub e fornece insights.",
      },
      {
        role: "user",
        content: `Por favor, analise este repositório e forneça insigths e melhorias sobre ele:\n\nREADME:\n${readme}\n\nCommits recentes:\n${JSON.stringify(
          commits.slice(0, 5)
        )}`,
      },
    ],
  });

  return NextResponse.json({
    summary: analysis.choices[0].message.content,
    readme,
    commits,
  });
}
