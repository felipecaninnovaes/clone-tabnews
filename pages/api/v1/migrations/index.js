import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migration(request, response) {
  const defaultMigrationRunnerOptions = {
    databaseUrl: process.env.DATABASE_URL,
    dryRun: false,
    dir: join(process.cwd(), "infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationRunnerOptions,
      dryRun: true,
    });
    response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner(
      defaultMigrationRunnerOptions,
    );
    if (migratedMigrations.length === 0) {
      response.status(200).json(migratedMigrations);
    } else {
      response.status(201).json(migratedMigrations);
    }
  }

  response.status(405).json({ error: "Method not allowed" });
}
