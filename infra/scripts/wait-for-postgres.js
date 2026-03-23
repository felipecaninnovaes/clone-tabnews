const { exec } = require("node:child_process");

function checkPostgresConnection() {
  exec(
    "docker exec postgres-development pg_isready --host localhost",
    handleReturn,
  );

  function handleReturn(stdout) {
    if (stdout.search("accepting connections") === -1) {
      console.log("🟡 Não está aceitando conexões, tentando novamente...");
      setTimeout(checkPostgresConnection, 1000);
      return;
    }
    console.log("🟢 PostgreSQL está aceitando conexões!");
  }
}

console.log("🔴 Aguardando o PostgreSQL aceitar conexões...");

checkPostgresConnection();
