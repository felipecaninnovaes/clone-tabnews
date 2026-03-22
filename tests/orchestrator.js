import retry from "async-retry";

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

export default {
  waitForAllServicesToBeReady,
};
