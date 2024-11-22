import { Prisma } from "@prisma/client";

import { WorkflowStatus } from "../../@types";

export const createWorkflowStatus = async (
  vacancyId: number,
  payload: WorkflowStatus,
  tx: Prisma.TransactionClient
) => {
  return tx.workflowStatus.create({
    data: {
      id: payload.id,
      name: payload.name,
      vacancyId: vacancyId,
    },
  });
};
