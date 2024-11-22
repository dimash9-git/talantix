import { Department, Salary } from "@prisma/client";

import { GraphQLResponse } from "./graph-ql";

export interface Vacancy {
  id: number;
  title: string;
  department: Department | null;
  createdAt: number;
  status: "active" | "archive";
  salary: Salary | null;
}

export interface VacancyListData {
  vacancies: {
    items: Vacancy[];
    pageInfo: {
      endCursor: string;
      first?: number;
      hasNextPage: boolean;
    };
  };
}

export type VacancyListResponse = GraphQLResponse<VacancyListData>;

export interface WorkflowStatus {
  name: string;
  id: number;
}

export interface WorkflowStatusData {
  vacancy: {
    workflowStatuses: {
      items: WorkflowStatus[];
    };
  };
}

export type WorkflowStatusResponse = GraphQLResponse<WorkflowStatusData>;
