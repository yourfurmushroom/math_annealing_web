import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 300;

const DEFAULT_BACKEND_URL = "http://localhost:9999";
const BACKEND_URL = (process.env.ANNEALING_BACKEND_URL ?? DEFAULT_BACKEND_URL).replace(/\/$/, "");
const POLL_INTERVAL_MS = readTimeout("ANNEALING_BACKEND_POLL_INTERVAL_MS", 1_000);
const RESPONSE_TIMEOUT_MS = readTimeout("ANNEALING_BACKEND_RESPONSE_TIMEOUT_MS", 600_000);

type BackendMessage = Record<string, unknown> | unknown[];

function readTimeout(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new Error("Request aborted"));
      },
      { once: true },
    );
  });
}

async function requestJson(path: string, init: RequestInit, signal: AbortSignal) {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const payload: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = isRecord(payload) && payload.detail ? String(payload.detail) : response.statusText;
    throw new Error(`Annealing backend failed with ${response.status}: ${message}`);
  }

  return payload;
}

function normalizeMachine(message: Record<string, unknown>) {
  if (message.machine === "compal") {
    return { ...message, machine: "jinbo" };
  }

  if (message.machine === "da") {
    return { ...message, machine: "sa" };
  }

  return message;
}

function normalizeBackendResult(result: BackendMessage) {
  if (!isRecord(result)) {
    return result;
  }

  if (result.status === "failed") {
    throw new Error(String(result.error ?? result.message ?? "Calculation failed"));
  }

  return result;
}

async function pollJob(statusUrl: string, signal: AbortSignal) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < RESPONSE_TIMEOUT_MS) {
    const result = await requestJson(statusUrl, { method: "GET" }, signal);

    if (isRecord(result) && (result.status === "completed" || result.status === "failed")) {
      return normalizeBackendResult(result as BackendMessage);
    }

    await sleep(POLL_INTERVAL_MS, signal);
  }

  throw new Error("Annealing backend polling timeout");
}

async function calculate(message: Record<string, unknown>, signal: AbortSignal) {
  const created = await requestJson(
    "/calculate",
    {
      method: "POST",
      body: JSON.stringify(normalizeMachine(message)),
    },
    signal,
  );

  if (!isRecord(created) || typeof created.status_url !== "string") {
    throw new Error("Invalid annealing backend job response");
  }

  return pollJob(created.status_url, signal);
}

async function save(message: Record<string, unknown>, signal: AbortSignal) {
  return requestJson(
    "/save",
    {
      method: "POST",
      body: JSON.stringify(message),
    },
    signal,
  );
}

async function requestBackend(message: unknown, signal: AbortSignal) {
  if (!isRecord(message)) {
    throw new Error("Invalid request message");
  }

  if (message.action === "Calculate") {
    return calculate(message, signal);
  }

  if (message.action === "Save") {
    return save(message, signal);
  }

  return requestJson(
    "/action",
    {
      method: "POST",
      body: JSON.stringify(normalizeMachine(message)),
    },
    signal,
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const message = isRecord(body) && body.message !== undefined ? body.message : body;
    const result = await requestBackend(message, req.signal);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown backend error";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
