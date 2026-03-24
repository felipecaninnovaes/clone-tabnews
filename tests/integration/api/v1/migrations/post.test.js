import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

const URL = "http://localhost:3000/api/v1/migrations";

beforeAll(async () => {
  await orchestrator.waitForAllServicesToBeReady();
  await database.query("drop schema public cascade; create schema public;");
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const postResponse = await fetch(URL, { method: "POST" });
        expect(postResponse.status).toBe(201);

        const postResponseBody = await postResponse.json();

        expect(Array.isArray(postResponseBody)).toBe(true);
        expect(postResponseBody.length).toBeGreaterThan(0);
      });
      test("For the second time", async () => {
        const postResponse = await fetch(URL, { method: "POST" });
        expect(postResponse.status).toBe(200);

        const postResponseBody = await postResponse.json();

        expect(Array.isArray(postResponseBody)).toBe(true);
        expect(postResponseBody.length).toBe(0);
      });
    });
  });
});
