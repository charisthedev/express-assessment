import { AppDataSource } from './data-source';
import { seedNotes } from './seed/note.seed';

type Seeder = {
  name: string;
  run: (dataSource: typeof AppDataSource) => Promise<void>;
};

const SEEDERS: Seeder[] = [
  {
    name: 'notes',
    run: seedNotes
  }
];

async function runSeeds(): Promise<void> {
  await AppDataSource.initialize();

  try {
    for (const seeder of SEEDERS) {
      console.log(`Running seeder: ${seeder.name}`);
      await seeder.run(AppDataSource);
    }
    console.log('Seed run completed successfully');
  } catch (error) {
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

runSeeds().catch((error: unknown) => {
  console.error('Seed run failed', error);
  process.exit(1);
});
