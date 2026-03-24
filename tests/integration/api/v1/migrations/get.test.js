import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

const URL = "http://localhost:3000/api/v1/migrations";

beforeAll(async () => {
  await orchestrator.waitForAllServicesToBeReady();
  await database.query("drop schema public cascade; create schema public;");
});

describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Retrieving pending migrations", async () => {
      const response = await fetch(URL, { method: "GET" });
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});
