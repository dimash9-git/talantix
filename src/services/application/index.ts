import { PrismaClient, Application } from "@prisma/client";
import { getApplicationList } from "./api";
import { createApplications } from "./db";
import { retrieveVacancies } from "../../db"; // Assuming this function retrieves all vacancies
import { ApplicationPerson } from "../../@types/application";

interface ApplicationServiceDependencies {
  prisma: PrismaClient;
}

interface ApplicationService {
  prisma: PrismaClient;
  getItems: (vacancyId: number, workflowStatusId: number, after?: string) => {};
  createItems: (
    vacancyId: number,
    workflowStatusId: number,
    items: ApplicationPerson[]
  ) => Promise<void>;
  importItems: () => Promise<void>;
}

export const ApplicationServiceFactory = ({
  prisma,
}: ApplicationServiceDependencies): ApplicationService => {
  const label = "Application";

  const getItems = async (vacancyId: number, workflowStatusId: number) => {
    let allItems: ApplicationPerson[] = [];
    let hasNextPage = true;
    let endCursor: string | undefined = undefined;

    while (hasNextPage) {
      const data = await getApplicationList({
        vacancyId,
        workflowStatusId,
        after: endCursor,
      });

      const {
        vacancy: {
          workflowStatus: { responses },
        },
      } = data;

      if (!responses.items.length) {
        console.log(
          `No candidates found for vacancyId ${vacancyId} and workflowStatusId ${workflowStatusId}.`
        );
        return [];
      }

      allItems = allItems.concat(responses.items);

      hasNextPage = responses.pageInfo.hasNextPage;
      endCursor = responses.pageInfo.endCursor;
    }

    return allItems;
  };

  const createItems = async (
    vacancyId: number,
    workflowStatusId: number,
    items: ApplicationPerson[]
  ) => {
    const BATCH_SIZE = 50;

    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);

      await prisma.$transaction(async (tx) => {
        const personIds = batch.map((item) => item.person.id);

        const existingApplications = await tx.application.findMany({
          where: {
            personId: { in: personIds },
            workflowStatusId: workflowStatusId,
            vacancyId: vacancyId,
          },
          select: { personId: true },
        });

        const existingPersonIds = new Set(
          existingApplications.map((app) => app.personId)
        );

        // Filter out existing applications
        const newItems = batch.filter(
          (item) => !existingPersonIds.has(item.person.id)
        );

        if (newItems.length === 0) {
          console.log(
            `No new applications to create in this batch ${batch.length}`
          );
          return;
        }
        const result = await createApplications(
          vacancyId,
          workflowStatusId,
          newItems,
          tx
        );
        console.log(`Created ${result.count} new applications at ${i} batch`);
      });
    }
  };

  const importItems = async () => {
    try {
      const vacancies = await retrieveVacancies(prisma);

      for (const vacancy of vacancies) {
        const workflowStatuses = await prisma.workflowStatus.findMany({
          where: { vacancyId: vacancy.id },
          select: { id: true },
        });

        for (const wf of workflowStatuses) {
          const applications = await getItems(vacancy.id, wf.id);
          await createItems(vacancy.id, wf.id, applications);
        }
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
