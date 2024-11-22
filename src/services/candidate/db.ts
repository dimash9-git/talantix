import { Prisma } from "@prisma/client";

import { Candidate } from "../../@types";

export const createCandidate = async (
  payload: Candidate,
  tx: Prisma.TransactionClient
) => {
  return tx.person.create({
    data: {
      id: payload.id,
      firstName: payload.firstName,
      middleName: payload.middleName,
      lastName: payload.lastName,
      age: payload.age,
      birthDay: new Date(payload.birthDay),
      area: payload.area
        ? {
            connectOrCreate: {
              where: { name: payload.area.name },
              create: { name: payload.area.name },
            },
          }
        : {},
      source: payload.source
        ? {
            connectOrCreate: {
              where: { name: payload.source.name },
              create: { name: payload.source.name },
            },
          }
        : {},

      photos:
        payload.photos && payload.photos.items.length > 0
          ? {
              create: payload.photos.items.map((photo) => ({
                url: photo.url,
              })),
            }
          : {},
      contacts:
        payload.contacts && payload.contacts.items.length > 0
          ? {
              create: payload.contacts.items.map((contact) => ({
                type: contact.type,
                value: contact.value,
              })),
            }
          : {},
    },
  });
};
