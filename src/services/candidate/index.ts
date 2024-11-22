import { PrismaClient } from "@prisma/client";

import { Candidate, CandidateListData } from "../../@types";
import { createCandidate } from "./db";
import { getCandidateList } from "./api";

interface CandidateServiceDependencies {
  prisma: PrismaClient;
}

interface CandidateService {
  prisma: PrismaClient;
  getItems: () => Promise<CandidateListData>;
  createItems: (items: Candidate[]) => Promise<void>;
  importItems: () => Promise<void>;
}

export const CandidateServiceFactory = ({
  prisma,
}: CandidateServiceDependencies): CandidateService => {
  const label = "Candidate";
  const limit = 50;

  const getItems = async () => {
    let allItems: Candidate[] = [];
    let endCursor: string | undefined;
    let hasNextPage: boolean = true;

    while (hasNextPage) {
      const { persons } = await getCandidateList(limit, endCursor);
      console.log(`Semi ${label} items length:`, persons.items.length);
      allItems = allItems.concat(persons.items);

      endCursor = persons.pageInfo.endCursor;
      hasNextPage = persons.pageInfo.hasNextPage;
    }

    console.log(`All ${label} items length:`, allItems.length);

    return {
      persons: {
        items: allItems,
        pageInfo: {
          endCursor: endCursor || "",
          hasNextPage,
        },
      },
    };
  };

  const createItems = async (items: Candidate[]) => {
    const BATCH_SIZE = 50;

    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);
      console.log(
        `Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(
          items.length / BATCH_SIZE
        )} (${batch.length} items)`
      );

      await prisma.$transaction(async (tx) => {
        for (const item of batch) {
          const exists = await prisma.person.findUnique({
            where: { id: item.id },
          });

          if (exists) {
            console.log(
              `${label} with id ${item.id} already exists, skipping.`
            );
            continue;
          }

          try {
            const newItem = await createCandidate(item, tx);
            console.log(`${label} saved: ${newItem.id}`);
          } catch (error) {
            console.error(
              `Failed to create ${label} with id ${item.id}:`,
              error
            );
            throw error;
          }
        }
      });
    }
  };

  const importItems = async () => {
    try {
      const data = await getItems();
      const { items } = data.persons;
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
