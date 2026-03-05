import supertest from 'supertest';
import { Express } from 'express';
import { Note } from '../src/app/note/note.entity';
import { MockNoteRepository } from './mock-note-repository';

jest.mock('../src/database/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn()
  }
}));

describe('API integration tests', () => {
  let request: ReturnType<typeof supertest>;
  let app: Express;
  let mockNoteRepository: MockNoteRepository;

  beforeEach(async () => {
    jest.resetModules();

    const seededNotes: Note[] = [
      {
        id: '11111111-1111-4111-8111-111111111111',
        title: 'First note',
        content: 'First content',
        createdAt: new Date('2026-01-03T10:00:00.000Z'),
        updatedAt: new Date('2026-01-03T10:00:00.000Z')
      },
      {
        id: '22222222-2222-4222-8222-222222222222',
        title: 'Second note',
        content: 'Second content',
        createdAt: new Date('2026-01-02T10:00:00.000Z'),
        updatedAt: new Date('2026-01-02T10:00:00.000Z')
      }
    ];

    mockNoteRepository = new MockNoteRepository(seededNotes);

    const { AppDataSource } = await import('../src/database/data-source');
    (AppDataSource.getRepository as unknown as jest.Mock).mockReturnValue(mockNoteRepository);

    const { App } = await import('../src/app/app');
    app = new App().create();
    request = supertest(app);
  });

  it('GET /api/health returns service status', async () => {
    const response = await request.get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.requestId).toBeDefined();
  });

  it('POST /api/notes creates a note', async () => {
    const response = await request.post('/api/notes').send({
      title: 'New note',
      content: 'New content'
    });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.title).toBe('New note');
    expect(response.body.content).toBe('New content');
  });

  it('POST /api/notes returns 400 for invalid body', async () => {
    const response = await request.post('/api/notes').send({
      content: 'Missing title'
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation error');
    expect(response.body.details).toBeDefined();
  });

  it('GET /api/notes returns paginated notes', async () => {
    const response = await request.get('/api/notes?limit=2');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.meta).toBeDefined();
    expect(response.body.data).toHaveLength(2);
  });

  it('GET /api/notes/:id returns a note', async () => {
    const response = await request.get('/api/notes/11111111-1111-4111-8111-111111111111');

    expect(response.status).toBe(200);
    expect(response.body.id).toBe('11111111-1111-4111-8111-111111111111');
  });

  it('GET /api/notes/:id returns 404 when note is missing', async () => {
    const response = await request.get('/api/notes/33333333-3333-4333-8333-333333333333');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Note not found');
  });

  it('PUT /api/notes/:id updates a note', async () => {
    const response = await request.put('/api/notes/11111111-1111-4111-8111-111111111111').send({
      title: 'Updated title'
    });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe('11111111-1111-4111-8111-111111111111');
    expect(response.body.title).toBe('Updated title');
  });

  it('PUT /api/notes/:id returns 400 for empty payload', async () => {
    const response = await request.put('/api/notes/11111111-1111-4111-8111-111111111111').send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation error');
  });

  it('PUT /api/notes/:id returns 404 when note is missing', async () => {
    const response = await request.put('/api/notes/33333333-3333-4333-8333-333333333333').send({
      title: 'Updated title'
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Note not found');
  });

  it('DELETE /api/notes/:id deletes a note', async () => {
    const response = await request.delete('/api/notes/11111111-1111-4111-8111-111111111111');

    expect(response.status).toBe(204);
  });

  it('DELETE /api/notes/:id returns 404 when note is missing', async () => {
    const response = await request.delete('/api/notes/33333333-3333-4333-8333-333333333333');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Note not found');
  });
});
