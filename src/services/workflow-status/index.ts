import { PrismaClient } from "@prisma/client";

import { WorkflowStatus } from "../../@types";
import { getWorkflowStatusList } from "./api";
import { createWorkflowStatus } from "./db";
import { retrieveVacancies } from "../../db";

interface WorkflowStatusServiceDependencies {
  prisma: PrismaClient;
}

interface WorkflowStatusService {
  prisma: PrismaClient;
  getItems: (vacancyId: number) => Promise<WorkflowStatus[]>;
  createItems: (vacancyId: number, items: WorkflowStatus[]) => Promise<void>;
  importItems: () => Promise<void>;
}

export const WorkflowStatusServiceFactory = ({
  prisma,
}: WorkflowStatusServiceDependencies): WorkflowStatusService => {
  const label = "WorkflowStatus";

  const getItems = async (vacancyId: number) => {
    const {
      vacancy: {
        workflowStatuses: { items },
      },
    } = await getWorkflowStatusList(vacancyId);

    return items;
  };

  const createItems = async (
    vacancyId: number,
    items: WorkflowStatus[]
  ): Promise<void> => {
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const exists = await tx.workflowStatus.findUnique({
          where: { id: item.id },
        });

        if (exists) {
          console.log(`${label} with id ${item.id} already exists, skipping.`);
          continue;
        }

        try {
          const newItem = await createWorkflowStatus(vacancyId, item, tx);
          console.log(`${label} saved: ${newItem.id}`);
        } catch (error) {
          console.error(`Failed to create ${label} with id ${item.id}:`, error);
          throw error;
        }
      }
    });
  };

  const importItems = async () => {
    try {
      /* 1. Retrive workflow statuses. 
        - If 0 -> Retrieve vacancies, (only ids) -> Fetch workflow statuses and save it.
        - If > 0 -> Retrieve vacancies, (only ids, and related workflowstatus ids) -> Fetch candidates associated with that vacancy + workflow status
      */

      const vacancies = await retrieveVacancies(prisma);

      for (const vacancy of vacancies) {
        const items = await getItems(vacancy.id);
        await createItems(vacancy.id, items);
      }

      console.log(`${label}.importItems.success`);
    } catch (error) {
      console.error("importItems.error", error);
    } finally {
      await prisma.$disconnect();
    }
  };

  return {
    prisma,
    getItems,
    createItems,
    importItems,
  };
};
