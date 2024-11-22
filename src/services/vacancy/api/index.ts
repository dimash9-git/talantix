import { VacancyListResponse } from "../../../@types";
import { fetchAuth } from "../../../lib/fetch";
import { TALANTIX } from "../../../constants";

const apiQueryUrl = TALANTIX.API_QUERY_URL;

export const getVacancyList = async (first: number, after?: string) => {
  const VACANCY_QUERY = `
      query VacancyList($first: Int, $after: String) {
        vacancies(first: $first, after: $after) {
          items {
            id
            title
            department
            createdAt
            status
            salary {
              currency
              from
              to
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
      query: VACANCY_QUERY,
      variables,
    }),
  };

  try {
    const res = await fetchAuth(apiQueryUrl, options);

    const { data, errors } = (await res.json()) as VacancyListResponse;

    // console.log(JSON.stringify(data, null, 2));

    if (!data) {
      throw new Error(errors[0]?.message ?? "Unknown error");
    }

    return data;
  } catch (error) {
    console.error(`getVacancyList.error`, error);
    throw error;
  }
};
