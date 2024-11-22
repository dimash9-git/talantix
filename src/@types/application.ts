import { GraphQLResponse } from "./graph-ql";

export interface ApplicationPerson {
  person: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export interface ApplicationData {
  vacancy: {
    workflowStatus: {
      responses: {
        items: ApplicationPerson[];
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string;
        };
      };
    };
  };
}

export type ApplicationResponse = GraphQLResponse<ApplicationData>;
