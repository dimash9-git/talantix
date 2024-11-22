import { Prisma } from "@prisma/client";

import { HiringRequestDTO } from "./types";

import {
  findOrCreateSalary,
  findOrCreateDepartment,
  findOrCreateAreas,
  findOrCreateVacancy,
} from "../../db";

export const createHiringRequest = async (
  payload: HiringRequestDTO,
  tx: Prisma.TransactionClient
) => {
  const salary = payload.salary
    ? await findOrCreateSalary(payload.salary, tx)
    : null;
  const department = payload.department
    ? await findOrCreateDepartment(payload.department, tx)
    : undefined;
  const vacancy = payload.vacancy?.id
    ? await findOrCreateVacancy(payload.vacancy, tx)
    : undefined;

  return tx.hiringRequest.create({
    data: {
      id: payload.id,
      name: payload.name,
      createdAt: new Date(payload.createdAt),
      description: payload.description,
      ...(department && { department: { connect: { id: department.id } } }),
      ...(salary && { salary: { connect: { id: salary.id } } }),
      ...(vacancy && { vacancy: { connect: { id: vacancy.id } } }),
    },
  });
};
