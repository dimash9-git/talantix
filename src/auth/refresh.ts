import fetch from "node-fetch";
import fs from "fs";

import { HTTPError } from "../utils/error";
import { FILE_LOCATION, TALANTIX } from "../constants";

async function getNewAccessToken(token: string) {
  const endpoint = TALANTIX.API_REFRESH_URL;

  const formData = {
    grant_type: "refresh_token",
    refresh_token: token,
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData).toString(),
    });

    if (!res.ok) {
      const message = await res.text();
      throw new HTTPError(res.status, message);
    }

    const data = (await res.json()) as {
      access_token: string;
    };

    return data.access_token;
  } catch (error) {
    console.error("Failed to fetch refresh token.");
    throw new Error(error);
  }
}

function storeAccessToken(token: string) {
  const file = FILE_LOCATION.ACCESS_TOKEN;

  fs.writeFileSync(file, JSON.stringify(token));
}

export async function refreshAccessToken() {
  const refreshToken = process.env.REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error("No refresh token available. Please authenticate first.");
  }

  const newToken = await getNewAccessToken(refreshToken);

  storeAccessToken(newToken);

  return newToken;
}
