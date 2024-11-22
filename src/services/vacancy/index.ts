import { PrismaClient } from "@prisma/client";

import { Vacancy } from "../../@types";
import { createVacancy } from "./db";
import { getVacancyList } from "./api"; 

interface VacancyServiceDependencies {
  prisma: PrismaClient;
}

interface VacancyService {
  prisma: PrismaClient;
  getItems: () => Promise<Vacancy[]>;
  createItems: (items: Vacancy[]) => Promise<void>;
  importItems: () => Promise<void>;
}

export const VacancyServiceFactory = ({
  prisma,
}: VacancyServiceDependencies): VacancyService => {
  const label = "Vacancy";
  const limit = 200;

  const getItems = async () => {
    let allItems: Vacancy[] = [];
    let endCursor: string | undefined;
    let hasNextPage: boolean = true;

    while (hasNextPage) {
      const { vacancies } = await getVacancyList(limit, endCursor);
      allItems = allItems.concat(vacancies.items);

      endCursor = vacancies.pageInfo.endCursor;
      hasNextPage = vacancies.pageInfo.hasNextPage;
    }

    console.log(`All ${label} items length`, allItems.length);

    return allItems;
  };

  const createItems = async (items: Vacancy[]): Promise<void> => {
    await prisma.$transaction(async (tx) => {
    
      for (const [idx, item] of items.entries()) {
      
        const exists = await tx.vacancy.findUnique({
          where: { id: item.id },
        });

        if (exists) {
          console.log(`${label} with id ${item.id} already exists, skipping.`);
          continue
        }

        try {
          const newItem = await createVacancy(item, tx);
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
      const items = await getItems();
      await createItems(items);

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
