import database from "infra/database";

const migrationsUrl = "http://localhost:3000/api/v1/migrations";

async function clearMigrations() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

beforeAll(async () => {
  await clearMigrations();
});

test("GET to /api/v1/migrations should return 200", async () => {
  const response = await fetch(migrationsUrl);
  expect(response.status).toBe(200);
  const eresponseBody = await response.json();
  expect(Array.isArray(eresponseBody)).toBe(true);
  expect(eresponseBody.length).toBeGreaterThan(0);
});
