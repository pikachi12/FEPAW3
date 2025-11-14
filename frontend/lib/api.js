export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiPost(url, data) {
  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // penting untuk cookie token
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Request failed");
  return result;
}
