import axios from "axios";
import {
  clearStoredAuth,
  getStoredRefreshToken,
  getStoredToken,
  getStoredJSON,
  setStoredJSON,
} from "./storage";

export interface AuthTokens {
  access: string;
  refresh: string;
}

let refreshRequest: Promise<AuthTokens | null> | null = null;

const isBrowser = typeof window !== "undefined";

const redirectToLogin = () => {
  if (!isBrowser) {
    return;
  }

  const { pathname } = window.location;
  if (pathname !== "/" && pathname !== "/login") {
    window.location.assign("/");
  }
};

export const clearAuthSession = () => {
  clearStoredAuth();
  redirectToLogin();
};

export const getAuthHeader = () => {
  const accessToken = getStoredToken()?.access;
  return accessToken ? `Bearer ${accessToken}` : null;
};

export const shouldSkipAuthRefresh = (url?: string) => {
  if (!url) {
    return false;
  }

  return ["/login/", "/manager/login/", "/api/token/refresh/"].some((path) =>
    url.includes(path)
  );
};

export const refreshAuthSession = async (): Promise<AuthTokens | null> => {
  if (refreshRequest) {
    return refreshRequest;
  }

  const storedTokens = getStoredToken();
  const refreshToken = getStoredRefreshToken() ?? storedTokens?.refresh ?? null;
  if (!refreshToken) {
    clearAuthSession();
    return null;
  }

  refreshRequest = axios
    .post("/api/token/refresh/", { refresh: refreshToken })
    .then((response) => {
      const nextTokens: AuthTokens = {
        access: response.data.access,
        refresh: response.data.refresh ?? refreshToken,
      };

      setStoredJSON("jwt-token", nextTokens);
      localStorage.setItem("refresh-token", nextTokens.refresh);
      const storedUser = getStoredJSON<Record<string, unknown>>("user");
      if (storedUser) {
        setStoredJSON("user", { ...storedUser, tokens: nextTokens });
      }
      return nextTokens;
    })
    .catch((error) => {
      clearAuthSession();
      throw error;
    })
    .finally(() => {
      refreshRequest = null;
    });

  return refreshRequest;
};
