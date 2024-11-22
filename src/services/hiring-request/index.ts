import { PrismaClient } from "@prisma/client";

import { getHiringRequestList } from "./api";
import { createHiringRequest } from "./db";
import { HiringRequestDTO } from "./types";

interface ServiceDependencies {
  prisma: PrismaClient;
}

type Items = HiringRequestDTO[];

interface Service {
  prisma: PrismaClient;
  getItems: () => Promise<Items>;
  createItems: (items: Items) => Promise<void>;
  importItems: () => Promise<void>;
}

const LABEL = "HiringRequest";
const LIMIT = 50;

export const HiringRequestServiceFactory = ({
  prisma,
}: ServiceDependencies): Service => {
  const getItems = async (): Promise<Items> => {
    let allItems: Items = [];
    let endCursor: string | null = null;
    let hasNextPage: boolean = true;

    while (hasNextPage) {
      const { hiringRequests: currentItems } = await getHiringRequestList(
        LIMIT,
        endCursor
      );
      allItems = allItems.concat(currentItems.items);

      endCursor = currentItems.pageInfo.endCursor;
      hasNextPage = currentItems.pageInfo.hasNextPage;
    }

    console.log(`All ${LABEL} items length`, allItems.length);

    return allItems;
  };

  const createItems = async (items: Items): Promise<void> => {
    await prisma.$transaction(async (tx) => {
      for (const [_, item] of items.entries()) {
        const doesExist = await tx.hiringRequest.findUnique({
          where: { id: item.id },
        });

        if (doesExist) {
          console.log(`${LABEL} with id ${item.id} already exists, skipping.`);
          continue;
        }

        try {
          const newItem = await createHiringRequest(item, tx);
          console.log(`${LABEL} saved: ${newItem.id}`);
        } catch (error) {
          console.error(`Failed to create ${LABEL} with id ${item.id}:`, error);
          throw error;
        }
      }
    });
  };

  const importItems = async () => {
    try {
      const fetchedItems = await getItems();
      await createItems(fetchedItems);

      console.log(`${LABEL}.importItems.success`);
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
