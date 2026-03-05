import { DataSource } from 'typeorm';
import { Note } from '../../app/note/note.entity';

const NOTE_SEED_VALUES: Array<Pick<Note, 'title' | 'content'>> = [
  { title: 'Weekly Planning 1', content: 'Outline priorities and deadlines for this week.' },
  { title: 'Project Kickoff 2', content: 'Define scope, owners, and milestones for the new project.' },
  { title: 'API Improvements 3', content: 'Track endpoint versioning and error handling follow-ups.' },
  { title: 'Database Checklist 4', content: 'Review indexes, migrations, and seed strategy.' },
  { title: 'Meeting Notes 5', content: 'Capture decisions, blockers, and action items.' },
  { title: 'Release Tasks 6', content: 'Prepare changelog, smoke tests, and deployment steps.' },
  { title: 'Bug Triage 7', content: 'Prioritize incoming bugs by severity and impact.' },
  { title: 'Refactor Ideas 8', content: 'List modules that need simplification and cleanup.' },
  { title: 'Testing Plan 9', content: 'Define unit, integration, and API contract tests.' },
  { title: 'Monitoring Setup 10', content: 'Add metrics, alerts, and structured logging checks.' },
  { title: 'Customer Feedback 11', content: 'Summarize user pain points from recent feedback.' },
  { title: 'Security Tasks 12', content: 'Review dependency updates and hardening actions.' },
  { title: 'Performance Notes 13', content: 'Record profiling results and optimization opportunities.' },
  { title: 'Documentation 14', content: 'Update setup guides and endpoint examples.' },
  { title: 'Roadmap Draft 15', content: 'Capture next sprint goals and delivery timeline.' },
  { title: 'Backlog Grooming 16', content: 'Refine story scopes and acceptance criteria.' },
  { title: 'Infra Changes 17', content: 'Track environment and deployment configuration updates.' },
  { title: 'Code Review Log 18', content: 'List key findings and follow-up refactors.' },
  { title: 'Risk Register 19', content: 'Document technical and delivery risks.' },
  { title: 'Team Sync 20', content: 'Prepare updates for standup and weekly sync.' }
];

export async function seedNotes(dataSource: DataSource): Promise<void> {

  await dataSource
    .createQueryBuilder()
    .insert()
    .into(Note)
    .values(NOTE_SEED_VALUES)
    .execute();

  console.log(`Notes seed inserted`);
}
