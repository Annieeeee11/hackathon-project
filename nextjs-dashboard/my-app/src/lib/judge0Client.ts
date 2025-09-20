const JUDGE0_URL = process.env.JUDGE0_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE0_KEY = process.env.JUDGE0_KEY; // optional if using RapidAPI

export async function runCode(source_code: string, language_id: number) {
  const response = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(JUDGE0_KEY ? { "X-RapidAPI-Key": JUDGE0_KEY } : {}),
    },
    body: JSON.stringify({
      source_code,
      language_id,
      stdin: "",
    }),
  });

  if (!response.ok) {
    throw new Error("Judge0 request failed");
  }

  return response.json();
}
