import { fetchAuth } from "../../lib/fetch";
import { TALANTIX } from "../../constants";
import { ApplicationResponse } from "../../@types/application";

const apiQueryUrl = TALANTIX.API_QUERY_URL;

export const getApplicationList = async ({
  vacancyId,
  workflowStatusId,
  after,
}: {
  vacancyId: number;
  workflowStatusId: number;
  after?: string;
}) => {
  const APPLICATION_QUERY = `
    query VacancyWorkflowStatusResponses($vacancyId: Int!, $workflowStatusId: Int!, $after: String) {
      vacancy(id: $vacancyId) {
        ... on VacancyItem {
          workflowStatus(id: $workflowStatusId) {
            ... on WorkflowStatusItem {
              responses(after: $after) {
                items {
                  person {
                    id
                    firstName
                    lastName
                  }
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    vacancyId,
    workflowStatusId,
    after,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: APPLICATION_QUERY,
      variables,
    }),
  };

  try {
    const res = await fetchAuth(apiQueryUrl, options);

    const { data, errors } = (await res.json()) as ApplicationResponse;

    // console.log(JSON.stringify(data, null, 2));

    if (!data) {
      throw new Error(errors[0]?.message ?? "Unknown error");
    }

    return data;
  } catch (error) {
    console.error(`getApplications.error`, error);
    throw error;
  }
};
