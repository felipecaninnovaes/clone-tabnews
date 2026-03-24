import retry from "async-retry";
import database from "infra/database.js";

async function waitForAllServicesToBeReady() {
  await waitForWebServiceToBeReady("http://localhost:3000/api/v1/status");

  async function waitForWebServiceToBeReady(url) {
    return retry(fetchStatusPage, {
      retries: 50,
      minTimeout: 500,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch(url);
      if (response.status !== 200) {
        throw new Error(
          `Service is not ready. Status code: ${response.status}`,
        );
      }
    }
  }
}

async function cleanDatabaseSchema() {
  await database.query("drop schema public cascade; create schema public;");
}

const orchestrator = {
  waitForAllServicesToBeReady,
  cleanDatabaseSchema,
};

export default orchestrator;
