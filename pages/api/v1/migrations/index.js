import migrationRunner from 'node-pg-migrations';

export default async function migration(request, response) {
  // const migrations = await migrationRunner.run({});
  response.status(200).json([]);
}


