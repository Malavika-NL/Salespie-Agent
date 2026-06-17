import type { Token } from "../features/Authslice/authTypes";

export const safeParseJSON = <T>(value: string | null): T | null => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const getStoredJSON = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);
  const parsedValue = safeParseJSON<T>(value);

  if (value !== null && parsedValue === null) {
    localStorage.removeItem(key);
  }

  return parsedValue;
};

export const setStoredJSON = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getStoredToken = () => getStoredJSON<Token>("jwt-token");

export const getStoredRefreshToken = () => localStorage.getItem("refresh-token");

export const clearStoredAuth = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("jwt-token");
  localStorage.removeItem("refresh-token");
};
