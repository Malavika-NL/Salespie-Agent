import axios, { type InternalAxiosRequestConfig } from "axios";
import {
  clearAuthSession,
  getAuthHeader,
  refreshAuthSession,
  shouldSkipAuthRefresh,
} from "../app/authSession";

const LEGACY_API_ORIGINS = new Set([
  "http://localhost:8000",
  "http://127.0.0.1:8000",
]);

const API_PATH_PREFIXES = [
  "/login/",
  "/logout/",
  "/register/",
  "/manager/login/",
  "/api/token/refresh/",
  "/users/",
  "/show-all-account-data/",
  "/show-account-data/",
  "/update-account/",
  "/delete-account/",
  "/account-data/",
  "/fetch-matching-opportunities/",
  "/opportunities/",
  "/opportunity-data/",
  "/target-data/",
  "/leads/",
  "/lead-data/",
  "/move-lead/",
  "/show-all-task-data/",
  "/tasks/",
  "/task/",
  "/todaystasks/",
  "/opportunity-category-total/",
  "/user-opportunity-category-total/",
  "/rank-a-sum/",
  "/user-rank-a-sum/",
  "/user/opportunities/",
  "/opportunities/stage-summary/",
  "/opportunities/vertical-summary/",
  "/admin_monthly-total-amount/",
  "/monthly-total-amount/",
  "/autofill-accounts-data/",
  "/chatbot/ask/",
];

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

function shouldProxyThroughVite(input: string): boolean {
  return import.meta.env.DEV && API_PATH_PREFIXES.some((prefix) => input.startsWith(prefix));
}

function rewriteLegacyApiUrl(input: string): string {
  for (const origin of LEGACY_API_ORIGINS) {
    if (input.startsWith(origin)) {
      const path = input.slice(origin.length);
      input = path || "/";
      break;
    }
  }

  if (shouldProxyThroughVite(input) && !input.startsWith("/api/")) {
    return `/api${input}`;
  }

  if (!import.meta.env.DEV && input.startsWith("/api/")) {
    return input.slice(4) || "/";
  }

  return input;
}

function withAuthHeaders(headers?: HeadersInit): Headers {
  const nextHeaders = new Headers(headers);
  const authHeader = getAuthHeader();

  if (authHeader && !nextHeaders.has("Authorization")) {
    nextHeaders.set("Authorization", authHeader);
  }

  return nextHeaders;
}

function buildRetryRequest(request: Request, accessToken: string): Request {
  const headers = new Headers(request.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  headers.set("x-auth-retry", "1");

  return new Request(request, { headers });
}

axios.interceptors.request.use((config) => {
  if (typeof config.url === "string") {
    config.url = rewriteLegacyApiUrl(config.url);
  }

  if (typeof config.baseURL === "string" && LEGACY_API_ORIGINS.has(config.baseURL)) {
    config.baseURL = "";
  }

  if (!shouldSkipAuthRefresh(config.url)) {
    const authHeader = getAuthHeader();
    if (authHeader) {
      config.headers.Authorization = authHeader;
    }
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkipAuthRefresh(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        const nextTokens = await refreshAuthSession();
        if (nextTokens?.access) {
          originalRequest.headers.Authorization = `Bearer ${nextTokens.access}`;
          return axios(originalRequest);
        }
      } catch {
        clearAuthSession();
      }
    }

    return Promise.reject(error);
  }
);

const originalFetch = window.fetch.bind(window);

window.fetch = async (input, init) => {
  const baseRequest = input instanceof Request ? input : new Request(input, init);
  const rewrittenUrl = rewriteLegacyApiUrl(baseRequest.url);
  const skipRefresh = shouldSkipAuthRefresh(rewrittenUrl);
  const request = new Request(rewrittenUrl, {
    method: init?.method ?? baseRequest.method,
    headers: skipRefresh ? new Headers(init?.headers ?? baseRequest.headers) : withAuthHeaders(init?.headers ?? baseRequest.headers),
    body:
      init?.body ??
      (input instanceof Request && !["GET", "HEAD"].includes(baseRequest.method)
        ? baseRequest.clone().body
        : undefined),
    credentials: init?.credentials ?? baseRequest.credentials,
    cache: init?.cache ?? baseRequest.cache,
    integrity: init?.integrity ?? baseRequest.integrity,
    keepalive: init?.keepalive ?? baseRequest.keepalive,
    mode: init?.mode ?? baseRequest.mode,
    redirect: init?.redirect ?? baseRequest.redirect,
    referrer: init?.referrer ?? baseRequest.referrer,
    referrerPolicy: init?.referrerPolicy ?? baseRequest.referrerPolicy,
    signal: init?.signal ?? baseRequest.signal,
  });

  const response = await originalFetch(request);

  if (
    response.status === 401 &&
    !skipRefresh &&
    request.headers.get("x-auth-retry") !== "1"
  ) {
    try {
      const nextTokens = await refreshAuthSession();
      if (nextTokens?.access) {
        return originalFetch(buildRetryRequest(request, nextTokens.access));
      }
    } catch {
      clearAuthSession();
    }
  }

  return response;
};
