import { CandidateListResponse } from "../../@types";
import { fetchAuth } from "../../lib/fetch";
import { TALANTIX } from "../../constants";

const apiQueryUrl = TALANTIX.API_QUERY_URL;

export const getCandidateList = async (first: number, after?: string) => {
  const CANDIDATE_QUERY = `
        query PersonsList($first: Int, $after: String) {
            persons(first: $first, after: $after) {
                items {
                    id
                    firstName
                    lastName
                    id
                    age
                    firstName
                    middleName
                    lastName
                    birthDay
                    area {
                        name
                    }
                    source {
                        name
                    }
                    photos {
                        items {
                            url
                        }
                    }
                    contacts {
                        items {
                            type
                            value
                        }
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    `;

  const variables = {
    first,
    after,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CANDIDATE_QUERY,
      variables,
    }),
  };

  try {
    const res = await fetchAuth(apiQueryUrl, options);

    const { data, errors } = (await res.json()) as CandidateListResponse;

    // console.log(JSON.stringify(data, null, 2));

    if (!data) {
      throw new Error(errors[0]?.message ?? "Unknown error");
    }

    return data;
  } catch (error) {
    console.error(`getCandidateList.error`, error);
    throw error;
  }
};
