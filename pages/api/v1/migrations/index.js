import migrationRunner from 'node-pg-migrate';
import {join} from 'node:path';


export default async function migration(request, response) {
  const migrations = await migrationRunner({
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: join(process.cwd(), 'infra', 'migrations'),
    direction: 'up',
    verbose: true,
    migrationsTable: 'pgmigrations',
  });
  response.status(200).json(migrations);
}


