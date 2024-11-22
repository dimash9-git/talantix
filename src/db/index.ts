import {
  Area,
  Department,
  Prisma,
  PrismaClient,
  Salary,
  Vacancy,
} from "@prisma/client";

export const retrieveVacancies = async (prisma: PrismaClient) => {
  try {
    const vacancies = await prisma.vacancy.findMany();
    return vacancies;
  } catch (error) {
    console.error(`retrieveVacancies.error`, error);
    throw error;
  }
};

export const retrieveWorkflowStatuses = async (prisma: PrismaClient) => {
  try {
    const workflowStatuses = await prisma.workflowStatus.findMany();
    return workflowStatuses;
  } catch (error) {
    console.error(`retrieveWorkflowStatuses.error`, error);
    throw error;
  }
};

export const findOrCreateSalary = async (
  payload: Salary,
  tx: Prisma.TransactionClient
): Promise<Salary> => {
  let salaryRecord = await tx.salary.findFirst({
    where: {
      currency: payload.currency,
      from: payload.from ?? null,
      to: payload.to ?? null,
    },
  });

  if (!salaryRecord) {
    salaryRecord = await tx.salary.create({
      data: {
        currency: payload.currency,
        from: payload.from ?? null,
        to: payload.to ?? null,
      },
    });
  }

  return salaryRecord;
};

export const findOrCreateDepartment = async (
  department: Department,
  tx: Prisma.TransactionClient
) => {
  return tx.department.upsert({
    where: { name: department.name },
    update: {},
    create: { name: department.name },
  });
};

export const findOrCreateAreas = async (
  areas: Area[],
  tx: Prisma.TransactionClient
) => {
  await tx.area.createMany({
    data: areas.map((area) => ({
      name: area.name,
    })),
    skipDuplicates: true,
  });

  return await tx.area.findMany({
    where: {
      name: {
        in: areas.map((area) => area.name),
      },
    },
  });
};

export const findOrCreateVacancy = async (
  vacancy: Vacancy,
  tx: Prisma.TransactionClient
) => {
  return tx.vacancy.upsert({
    where: { id: vacancy.id },
    update: {},
    create: vacancy,
  });
};
