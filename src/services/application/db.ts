import { Prisma } from "@prisma/client";

import { ApplicationPerson } from "../../@types/application";

export const createApplications = async (
  vacancyId: number,
  workflowStatusId: number,
  data: ApplicationPerson[],
  tx: Prisma.TransactionClient
) => {
  try {
    const upsertData = data.map((payload) => ({
      where: {
        unique_application: {
          personId: payload.person.id,
          vacancyId: vacancyId,
          workflowStatusId: workflowStatusId,
        },
      },
      create: {
        personId: payload.person.id,
        workflowStatusId,
        vacancyId,
      },
      update: {},
    }));

    const result = await tx.application.createMany({
      data: upsertData.map((d) => d.create),
      skipDuplicates: true, // This will skip any duplicates instead of erroring
    });

    return result;
  } catch (error) {
    console.error(
      `createApplications.error for vacancyId ${vacancyId}, workflowStatusId ${workflowStatusId}, count ${data.length}:`,
      error
    );
    throw error;
  }
};
