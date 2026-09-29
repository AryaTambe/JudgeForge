import { apiUrl } from "@/lib/api/config";

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export interface ApiRequestOptions extends RequestInit {
  token?: string | null;
}

function messageFromPayload(payload: unknown, status: number): string {
  if (typeof payload === "string" && payload.trim()) return payload;
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (typeof record.detail === "string") return record.detail;
    if (typeof record.message === "string") return record.message;
    if (Array.isArray(record.detail)) {
      const messages = record.detail.map((item) => {
        if (item && typeof item === "object" && "msg" in item) return String((item as { msg: unknown }).msg);
        return "Invalid request";
      });
      return messages.join(" ");
    }
  }
  return status ? `The API request failed (${status}).` : "The backend could not be reached.";
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { token, headers: suppliedHeaders, ...init } = options;
  const headers = new Headers(suppliedHeaders);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const hasBody = init.body !== undefined && init.body !== null;
  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;
  if (hasBody && !isFormData && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  headers.set("Accept", headers.get("Accept") ?? "application/json");

  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      ...init,
      headers,
      cache: "no-store",
      credentials: "omit",
    });
  } catch {
    throw new ApiError("Could not reach JudgeForge. Check the API URL, that the backend is running, and its CORS settings.", 0);
  }

  if (response.status === 204) {
    if (!response.ok) throw new ApiError(`The API request failed (${response.status}).`, response.status);
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  let payload: unknown;
  try {
    payload = contentType.includes("json") ? await response.json() : await response.text();
  } catch {
    payload = null;
  }
  if (!response.ok) throw new ApiError(messageFromPayload(payload, response.status), response.status, payload);
  return payload as T;
}
