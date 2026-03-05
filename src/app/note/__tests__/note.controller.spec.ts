import { Request, Response } from 'express';
import { CursorPaginatedResult } from '../../../common/services/pagination.service';
import { NoteController } from '../note.controller';
import { NoteService } from '../note.service';
import { Note } from '../note.entity';

const makeNote = (overrides: Partial<Note> = {}): Note => ({
  id: '11111111-1111-4111-8111-111111111111',
  title: 'Test note',
  content: 'Test content',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides
});

const createResponse = (): Response => {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  };

  return response as unknown as Response;
};

describe('NoteController', () => {
  let noteService: jest.Mocked<NoteService>;
  let noteController: NoteController;

  beforeEach(() => {
    noteService = {
      createNote: jest.fn(),
      getNotes: jest.fn(),
      getNoteById: jest.fn(),
      updateNote: jest.fn(),
      deleteNote: jest.fn()
    } as unknown as jest.Mocked<NoteService>;

    noteController = new NoteController(noteService);
  });

  it('create returns 201 and created note', async () => {
    const req = { body: { title: 'A title', content: 'A content' } } as Request;
    const res = createResponse();
    const note = makeNote();

    noteService.createNote.mockResolvedValue(note);

    await noteController.create(req, res);

    expect(noteService.createNote).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(note);
  });

  it('findAll returns 200 and paginated notes', async () => {
    const req = { query: { limit: 10 } } as unknown as Request;
    const res = createResponse();
    const response: CursorPaginatedResult<Note> = {
      data: [makeNote()],
      meta: {
        hasNextPage: false,
        nextCursor: null
      }
    };

    noteService.getNotes.mockResolvedValue(response);

    await noteController.findAll(req, res);

    expect(noteService.getNotes).toHaveBeenCalledWith(req.query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(response);
  });

  it('findById returns 200 and note', async () => {
    const req = { params: { id: '11111111-1111-4111-8111-111111111111' } } as unknown as Request;
    const res = createResponse();
    const note = makeNote();

    noteService.getNoteById.mockResolvedValue(note);

    await noteController.findById(req, res);

    expect(noteService.getNoteById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(note);
  });

  it('update returns 200 and updated note', async () => {
    const req = {
      params: { id: '11111111-1111-4111-8111-111111111111' },
      body: { title: 'Updated title' }
    } as unknown as Request;
    const res = createResponse();
    const updated = makeNote({ title: 'Updated title' });

    noteService.updateNote.mockResolvedValue(updated);

    await noteController.update(req, res);

    expect(noteService.updateNote).toHaveBeenCalledWith(req.params.id, req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('delete returns 204 and empty body', async () => {
    const req = { params: { id: '11111111-1111-4111-8111-111111111111' } } as unknown as Request;
    const res = createResponse();

    noteService.deleteNote.mockResolvedValue();

    await noteController.delete(req, res);

    expect(noteService.deleteNote).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
