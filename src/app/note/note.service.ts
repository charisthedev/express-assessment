import { AppError } from '../../common/errors/AppError';
import {
    CursorPaginatedResult,
    CursorPaginationQuery,
} from '../../common/services/pagination.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './note.entity';
import { NoteRepository } from './note.repository';

export class NoteService {
    constructor(private readonly noteRepository: NoteRepository) { }

    public async createNote(payload: CreateNoteDto): Promise<Note> {
        return this.noteRepository.create(payload);
    }

    public async getNotes(query: CursorPaginationQuery): Promise<CursorPaginatedResult<Note>> {
        return this.noteRepository.findManyByCursor(query);
    }

    public async getNoteById(id: string): Promise<Note> {
        const note = await this.noteRepository.findById(id);

        if (!note) {
            throw new AppError('Note not found', 404);
        }

        return note;
    }

    public async updateNote(id: string, payload: UpdateNoteDto): Promise<Note> {
        const note = await this.noteRepository.findById(id);

        if (!note) {
            throw new AppError('Note not found', 404);
        }

        await this.noteRepository.update(id, payload);
        const updatedNote = await this.noteRepository.findById(id);

        if (!updatedNote) {
            throw new AppError('Note not found', 404);
        }

        return updatedNote;
    }

    public async deleteNote(id: string): Promise<void> {
        const note = await this.noteRepository.findById(id);

        if (!note) {
            throw new AppError('Note not found', 404);
        }

        await this.noteRepository.delete(id);
    }
}
