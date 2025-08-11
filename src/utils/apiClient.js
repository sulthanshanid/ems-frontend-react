// src/utils/apiClient.js
export async function apiRequest(
  url,
  method = "GET",
  body = null,
  token = null
) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
   console.log(`API Request: ${method} ${url}`, body);
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "API request failed");
  }
  
  return response.json();
}
