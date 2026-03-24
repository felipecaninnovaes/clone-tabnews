import orchestrator from "tests/orchestrator.js";

const URL = "http://localhost:3000/api/v1/status";

beforeAll(async () => {
  await orchestrator.waitForAllServicesToBeReady();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const getResponse = await fetch(URL, { method: "GET" });
      expect(getResponse.status).toBe(200);

      const getResponseBody = await getResponse.json();

      const parsedUpdatedAt = new Date(
        getResponseBody.updated_at,
      ).toISOString();
      expect(getResponseBody.updated_at).toEqual(parsedUpdatedAt);

      expect(getResponseBody.dependencies.database.version).toEqual("16.0");
      expect(getResponseBody.dependencies.database.max_connections).toEqual(
        100,
      );
      expect(getResponseBody.dependencies.database.opened_connections).toEqual(
        1,
      );
    });
  });
});
