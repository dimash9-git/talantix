for "fs":
npm install --save-dev @types/node

for running:
npm i -D tsx
npm prisma generate
npm prisma migrate dev --name init
npx tsx src/index.ts

if prisma-client gives error on type safety even though schema correct,
(@unique field etc.), just make new migration
