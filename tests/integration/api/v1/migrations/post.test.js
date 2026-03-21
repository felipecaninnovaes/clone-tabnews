import database from "infra/database";

const migrationsUrl = "http://localhost:3000/api/v1/migrations";

async function clearMigrations() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

beforeAll(async () => {
  await clearMigrations();
});

test("POST to /api/v1/migrations should runed successfully", async () => {
  const response = await fetch(migrationsUrl, { method: "POST" });
  expect(response.status).toBe(201);
  const eresponseBody = await response.json();
  expect(Array.isArray(eresponseBody)).toBe(true);
  expect(eresponseBody.length).toBeGreaterThan(0);
});

test("POST to /api/v1/migrations runned successfully should return empty array", async () => {
  const response = await fetch(migrationsUrl, { method: "POST" });
  expect(response.status).toBe(200);
  const eresponseBody = await response.json();
  expect(Array.isArray(eresponseBody)).toBe(true);
  expect(eresponseBody.length).toBe(0);
});
