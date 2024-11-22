import dotenv from "dotenv";
dotenv.config();

import delay from "./utils/delay.ts";

import {
  applicationService,
  candidateService,
  hiringRequestService,
  vacancyService,
  workflowStatusService,
} from "./services/index.ts";

async function main() {
  // 1. Получаем вакансии.
  // await vacancyService.importItems();
  // await delay(5000);

  // 2. Получаем кандидатов.
  // await candidateService.importItems();
  // await delay(5000);

  // 3. Получаем этапы кандидатов
  // await workflowStatusService.importItems();
  // await delay(5000);

  // 4. Заполняем заявки кандидатов по вакансии и этапам
  // await applicationService.importItems();
  // await delay(5000);

  // 5. Импортируем заявки на вакансии
  await hiringRequestService.importItems();
}

main();
