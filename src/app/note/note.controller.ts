import { Request, Response } from 'express';
import { CursorPaginationQuery } from '../../common/services/pagination.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteService } from './note.service';

export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  public create = async (req: Request, res: Response): Promise<void> => {
    const payload = req.body as CreateNoteDto;
    const note = await this.noteService.createNote(payload);
    res.status(201).json(note);
  };

  public findAll = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as CursorPaginationQuery;
    const notes = await this.noteService.getNotes(query);
    res.status(200).json(notes);
  };

  public findById = async (req: Request, res: Response): Promise<void> => {
    const note = await this.noteService.getNoteById(req.params.id);
    res.status(200).json(note);
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const payload = req.body as UpdateNoteDto;
    const note = await this.noteService.updateNote(req.params.id, payload);
    res.status(200).json(note);
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    await this.noteService.deleteNote(req.params.id);
    res.status(204).send();
  };
}
