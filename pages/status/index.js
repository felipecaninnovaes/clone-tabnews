import useSWR from "swr";

const URL = "/api/v1/status";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function Status() {
  return (
    <>
      <h1>Status</h1>
      <DatabaseConnectionInfo />
    </>
  );
}

function DatabaseConnectionInfo() {
  const { data } = useSWR(URL, fetchAPI, {
    refreshInterval: 5000,
  });

  return (
    <>
      <span style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
        Atualizado em:{" "}
        {new Date(data?.updated_at).toLocaleString() || "Loading..."}
        {"\n"}
        Versão do Banco de Dados:{" "}
        {data?.dependencies?.database?.version || "Loading..."}
        {"\n"}
        Conexões Abertas:{" "}
        {data?.dependencies?.database?.opened_connections || "Loading..."}
        {"\n"}
        Conexões Máximas:{" "}
        {data?.dependencies?.database?.max_connections || "Loading..."}
      </span>
    </>
  );
}
