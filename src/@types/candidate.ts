import { Area, Contact, Photo, Source } from "@prisma/client";

import { GraphQLResponse } from "./graph-ql";

export interface Candidate {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  age: number;
  birthDay: number;
  area: Area;
  source: Source;
  photos: {
    items: Photo[];
  };
  contacts: {
    items: Contact[];
  };
}

export interface CandidateListData {
  persons: {
    items: Candidate[];
    pageInfo: {
      endCursor: string;
      first?: number;
      hasNextPage: boolean;
    };
  };
}

export type CandidateListResponse = GraphQLResponse<CandidateListData>;
