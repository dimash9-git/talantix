import fs from "fs";

import { FILE_LOCATION } from "../constants";

export const retrieveAccessToken = (): string => {
  const file = FILE_LOCATION.ACCESS_TOKEN;

  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  }

  return "";
};
