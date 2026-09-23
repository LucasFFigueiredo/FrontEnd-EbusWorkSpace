import { cookies } from "next/headers";
import { redirect } from "next/navigation"; // 👈 Importação adicionada

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5281";

interface ServerFetchOptions extends RequestInit { }

export async function serverFetch<T>(
  endpoint: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("ebus_token")?.value;

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Accept", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 👇 NOVA REGRA: Intercepta o 401 (Acesso Negado/Token Expirado)
  if (response.status === 401) {
    cookieStore.delete("ebus_token");
    redirect("/login");
  }

  if (response.status === 204) {
    return {} as T;
  }

  if (!response.ok) {
    let finalErrorMessage = `Erro na requisição (${response.status} ${response.statusText})`;

    try {
      const rawText = await response.text();
      if (rawText) {
        try {
          const errorObj = JSON.parse(rawText);

          finalErrorMessage =
            errorObj.result || errorObj.message || errorObj.detail || errorObj.title || rawText;
        } catch {
          finalErrorMessage = rawText;
        }
      }
    } catch (e) { }

    throw new Error(finalErrorMessage);
  }

  return (await response.json()) as T;
}