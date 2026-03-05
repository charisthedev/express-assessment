import { AppError } from '../../../common/errors/AppError';
import { NoteService } from '../note.service';
import { NoteRepository } from '../note.repository';
import { Note } from '../note.entity';

const makeNote = (overrides: Partial<Note> = {}): Note => ({
  id: '11111111-1111-4111-8111-111111111111',
  title: 'Test note',
  content: 'Test content',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides
});

describe('NoteService', () => {
  let noteRepository: jest.Mocked<NoteRepository>;
  let noteService: NoteService;

  beforeEach(() => {
    noteRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findManyByCursor: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as unknown as jest.Mocked<NoteRepository>;

    noteService = new NoteService(noteRepository);
  });

  it('createNote delegates to repository.create', async () => {
    const payload = { title: 'A title', content: 'A content' };
    const created = makeNote();
    noteRepository.create.mockResolvedValue(created);

    const result = await noteService.createNote(payload);

    expect(noteRepository.create).toHaveBeenCalledWith(payload);
    expect(result).toEqual(created);
  });

  it('getNotes delegates to repository.findManyByCursor', async () => {
    const query = { limit: 10 };
    const response = {
      data: [makeNote()],
      meta: {
        hasNextPage: false,
        nextCursor: null
      }
    };

    noteRepository.findManyByCursor.mockResolvedValue(response);

    const result = await noteService.getNotes(query);

    expect(noteRepository.findManyByCursor).toHaveBeenCalledWith(query);
    expect(result).toEqual(response);
  });

  it('getNoteById returns note when found', async () => {
    const note = makeNote();
    noteRepository.findById.mockResolvedValue(note);

    const result = await noteService.getNoteById(note.id);

    expect(noteRepository.findById).toHaveBeenCalledWith(note.id);
    expect(result).toEqual(note);
  });

  it('getNoteById throws 404 when note is missing', async () => {
    noteRepository.findById.mockResolvedValue(null);

    await expect(noteService.getNoteById('11111111-1111-4111-8111-111111111111')).rejects.toEqual(
      new AppError('Note not found', 404)
    );
  });

  it('updateNote updates and returns latest note', async () => {
    const existing = makeNote();
    const updated = makeNote({ title: 'Updated title' });

    noteRepository.findById.mockResolvedValueOnce(existing).mockResolvedValueOnce(updated);
    noteRepository.update.mockResolvedValue();

    const result = await noteService.updateNote(existing.id, { title: 'Updated title' });

    expect(noteRepository.update).toHaveBeenCalledWith(existing.id, { title: 'Updated title' });
    expect(result).toEqual(updated);
  });

  it('updateNote throws 404 when note does not exist before update', async () => {
    noteRepository.findById.mockResolvedValue(null);

    await expect(
      noteService.updateNote('11111111-1111-4111-8111-111111111111', { title: 'Updated title' })
    ).rejects.toEqual(new AppError('Note not found', 404));

    expect(noteRepository.update).not.toHaveBeenCalled();
  });

  it('updateNote throws 404 when note disappears after update', async () => {
    const existing = makeNote();
    noteRepository.findById.mockResolvedValueOnce(existing).mockResolvedValueOnce(null);
    noteRepository.update.mockResolvedValue();

    await expect(noteService.updateNote(existing.id, { title: 'Updated title' })).rejects.toEqual(
      new AppError('Note not found', 404)
    );
  });

  it('deleteNote deletes existing note', async () => {
    const note = makeNote();
    noteRepository.findById.mockResolvedValue(note);
    noteRepository.delete.mockResolvedValue();

    await noteService.deleteNote(note.id);

    expect(noteRepository.delete).toHaveBeenCalledWith(note.id);
  });

  it('deleteNote throws 404 when note does not exist', async () => {
    noteRepository.findById.mockResolvedValue(null);

    await expect(noteService.deleteNote('11111111-1111-4111-8111-111111111111')).rejects.toEqual(
      new AppError('Note not found', 404)
    );

    expect(noteRepository.delete).not.toHaveBeenCalled();
  });
});
