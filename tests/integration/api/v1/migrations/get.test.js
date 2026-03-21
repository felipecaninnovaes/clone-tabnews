const migrationsUrl = "http://localhost:3000/api/v1/migrations";

test("GET to /api/v1/migrations should return 200", async () => {
  const response = await fetch(migrationsUrl);
  expect(response.status).toBe(200);
  const eresponseBody = await response.json();
  expect(Array.isArray(eresponseBody)).toBe(true);
});
  
