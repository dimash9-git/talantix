import { HiringRequestListResponse } from "./types";
import { fetchAuth } from "../../lib/fetch";
import { TALANTIX } from "../../constants";

const apiQueryUrl = TALANTIX.API_QUERY_URL;

export const getHiringRequestList = async (
  first: number,
  after: string | null
) => {
  const query = `
      query HiringRequest($first: Int, $after: String) {
        hiringRequests(first: $first, after: $after) {
          items {
            createdAt
            department
            description
            id
            name
            vacancy {
                ... on VacancyItem {
                    id
                }
            }
            salary {
                currency
                from
                to
            }
        }
          pageInfo {
            endCursor
            first
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
      query,
      variables,
    }),
  };

  try {
    const res = await fetchAuth(apiQueryUrl, options);

    const { data, errors } = (await res.json()) as HiringRequestListResponse;

    console.dir(data, { depth: null });

    if (!data) {
      throw new Error(errors[0]?.message ?? "GraphQL request error");
    }

    return data;
  } catch (error) {
    console.error("getHiringRequestList.error", error);
    throw error;
  }
};
