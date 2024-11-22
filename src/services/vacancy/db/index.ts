import { Prisma } from "@prisma/client";
import { Vacancy } from "../../../@types";

import { findOrCreateSalary, findOrCreateDepartment } from "../../../db";

export const createVacancy = async (
  payload: Vacancy,
  tx: Prisma.TransactionClient
) => {
  const salary = payload.salary
    ? await findOrCreateSalary(payload.salary, tx)
    : null;
  const department = payload.department
    ? await findOrCreateDepartment(payload.department, tx)
    : undefined;

  return tx.vacancy.create({
    data: {
      id: payload.id,
      title: payload.title,
      createdAt: new Date(payload.createdAt),
      department: department
        ? {
            connect: { id: department.id },
          }
        : undefined,
      status: payload.status,
      salary: salary
        ? {
            connect: { id: salary.id },
          }
        : undefined,
    },
  });
};
