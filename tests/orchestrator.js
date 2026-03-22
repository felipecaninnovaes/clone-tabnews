import retry from "async-retry";

async function waitForAllServicesToBeReady() {
  await waitForWebServiceToBeReady("http://localhost:3000/api/v1/status");

  async function waitForWebServiceToBeReady(url) {
    return retry(fetchStatusPage, {
      retries: 100,
      minTimeout: 1000,
      maxTimeout: 60000,
    });

    async function fetchStatusPage() {
      const response = await fetch(url);
      await response.json();
    }
  }
}

export default {
  waitForAllServicesToBeReady,
};
