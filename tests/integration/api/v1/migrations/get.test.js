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
      const getResponse = await fetch(URL, { method: "GET" });
      expect(getResponse.status).toBe(200);

      const getResponseBody = await getResponse.json();

      expect(Array.isArray(getResponseBody)).toBe(true);
      expect(getResponseBody.length).toBeGreaterThan(0);
    });
  });
});
