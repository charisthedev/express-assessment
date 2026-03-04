import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { AppDataSource } from './data-source';

const SEED_DIR = path.resolve(process.cwd(), 'src/database/seed');

async function runSeeds(): Promise<void> {
  await AppDataSource.initialize();
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    const entries = await readdir(SEED_DIR, { withFileTypes: true });
    const seedFiles = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));

    if (seedFiles.length === 0) {
      console.log(`No seed files found in ${SEED_DIR}`);
      return;
    }

    await queryRunner.connect();
    await queryRunner.startTransaction();

    for (const fileName of seedFiles) {
      const filePath = path.join(SEED_DIR, fileName);
      const sql = (await readFile(filePath, 'utf8')).trim();

      if (!sql) {
        console.log(`Skipping empty seed file: ${fileName}`);
        continue;
      }

      console.log(`Running seed: ${fileName}`);
      await queryRunner.query(sql);
    }

    await queryRunner.commitTransaction();
    console.log('Seed run completed successfully');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

runSeeds().catch((error: unknown) => {
  console.error('Seed run failed', error);
  process.exit(1);
});
