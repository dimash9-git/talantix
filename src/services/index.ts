import prisma from "../lib/prisma-client.ts";

import { VacancyServiceFactory } from "../services/vacancy/index.ts";
import { ApplicationServiceFactory } from "./application/index.ts";
import { CandidateServiceFactory } from "./candidate/index.ts";
import { HiringRequestServiceFactory } from "./hiring-request/index.ts";
import { WorkflowStatusServiceFactory } from "./workflow-status/index.ts";

export const vacancyService = VacancyServiceFactory({
  prisma,
});

export const candidateService = CandidateServiceFactory({
  prisma,
});

export const workflowStatusService = WorkflowStatusServiceFactory({
  prisma,
});

export const applicationService = ApplicationServiceFactory({
  prisma,
});

export const hiringRequestService = HiringRequestServiceFactory({
  prisma,
});
