import fetch, { RequestInit, Response } from "node-fetch";

import { refreshAccessToken, retrieveAccessToken } from "../auth";
import { HTTPError } from "../utils/error";

export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = 8000
): Promise<Response> => {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { ...options, signal });

    if (!res.ok) {
      const message = await res.text();
      throw new HTTPError(res.status, message);
    }

    return res;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    } else if (error instanceof HTTPError) {
      throw error;
    } else {
      throw new Error(error.message);
    }
  } finally {
    clearTimeout(timeoutId);
  }
};

export const fetchAuth = async (
  url: string,
  options: RequestInit,
  timeout: number = 8000
): Promise<Response> => {
  let token = retrieveAccessToken();

  try {
    const res = await fetchWithTimeout(
      url,
      {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      },
      timeout
    );

    return res;
  } catch (error) {
    console.log(options);
    console.log("fetch error", error);

    if (error instanceof HTTPError && error.status === 401) {
      console.log("Access token expired, attempting to refresh...");

      // Get new access token using refresh token
      try {
        await refreshAccessToken();

        console.log("Retrying request with new access token...");

        return await fetchAuth(url, options, timeout);
      } catch (refreshError) {
        console.error("Failed to refresh access token:", refreshError);
        throw refreshError;
      }
    } else {
      throw error;
    }
  }
};
