const { exec } = require("node:child_process");

function checkPostgresConnection() {
  exec(
    "docker exec postgres-development pg_isready --host localhost",
    handleReturn,
  );

  // eslint-disable-next-line no-unused-vars
  function handleReturn(error, stdout, stderr) {
    if (!stdout || !stdout.includes("accepting connections")) {
      console.log("🟡 Não está aceitando conexões, tentando novamente...");
      setTimeout(checkPostgresConnection, 1000);
      return;
    }
    console.log("🟢 PostgreSQL está aceitando conexões!");
  }
}

console.log("🔴 Aguardando o PostgreSQL aceitar conexões...");

checkPostgresConnection();
