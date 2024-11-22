import { Area, Department, Salary, Vacancy } from "@prisma/client";

import { GraphQLResponse } from "../../@types";

export interface HiringRequestDTO {
  approvedAt: number | null;
  createdAt: number;
  creationReason: string;
  department: Department | null;
  description: string;
  id: number;
  name: string;
  status: string;
  // areas: {
  //   items: Area[];
  // };
  salary: Salary | null;
  vacancy: Vacancy | null;
}

export interface HiringRequestListData {
  hiringRequests: {
    items: HiringRequestDTO[];
    pageInfo: {
      endCursor: string;
      first?: number;
      hasNextPage: boolean;
    };
  };
}

export type HiringRequestListResponse = GraphQLResponse<HiringRequestListData>;
