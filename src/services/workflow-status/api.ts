import { WorkflowStatusResponse } from "../../@types";
import { TALANTIX } from "../../constants";
import { fetchAuth } from "../../lib/fetch";

const apiQueryUrl = TALANTIX.API_QUERY_URL;

export const getWorkflowStatusList = async (vacancyId: number) => {
  const variables = {
    vacancyId,
  };

  const WORKFLOW_STATUS_QUERY = `
        query VacancyWorkflowStatusIds($vacancyId: Int!) {
          vacancy(id: $vacancyId) {
            ... on VacancyItem {
              workflowStatuses {
                items {
                  id
                  name
                }
              }
            }
          }
        }
      `;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: WORKFLOW_STATUS_QUERY,
      variables,
    }),
  };
  try {
    const res = await fetchAuth(apiQueryUrl, options);

    const { data, errors } = (await res.json()) as WorkflowStatusResponse;

    if (!data) {
      throw new Error(errors[0]?.message ?? "Unknown error");
    }

    return data;
  } catch (error) {
    console.error(`getWorkflowStatusIds.error`, error);
    throw error;
  }
};
