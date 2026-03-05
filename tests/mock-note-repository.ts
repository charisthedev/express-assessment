import { randomUUID } from 'node:crypto';
import { Note } from '../src/app/note/note.entity';

type FindOneOptions = {
  where: {
    id: string;
  };
};

type QueryBuilderState = {
  take: number;
  cursorCreatedAt?: Date;
  cursorId?: string;
};

export class MockNoteRepository {
  private notes: Note[];

  constructor(initialNotes: Note[] = []) {
    this.notes = [...initialNotes];
  }

  public create(data: Partial<Note>): Note {
    const now = new Date();

    return {
      id: data.id ?? randomUUID(),
      title: data.title ?? '',
      content: data.content ?? null,
      createdAt: data.createdAt ?? now,
      updatedAt: data.updatedAt ?? now
    };
  }

  public async save(noteOrNotes: Note | Note[]): Promise<Note | Note[]> {
    if (Array.isArray(noteOrNotes)) {
      const saved = noteOrNotes.map((note) => this.upsert(note));
      return saved;
    }

    return this.upsert(noteOrNotes);
  }

  public async find(): Promise<Note[]> {
    return [...this.notes].sort(this.sortNotesDesc);
  }

  public async count(): Promise<number> {
    return this.notes.length;
  }

  public async findOne(options: FindOneOptions): Promise<Note | null> {
    const note = this.notes.find((item) => item.id === options.where.id);
    return note ?? null;
  }

  public async update(id: string, data: Partial<Note>): Promise<void> {
    const note = this.notes.find((item) => item.id === id);

    if (!note) {
      return;
    }

    note.title = data.title ?? note.title;
    note.content = data.content === undefined ? note.content : data.content;
    note.updatedAt = new Date();
  }

  public async delete(id: string): Promise<void> {
    this.notes = this.notes.filter((item) => item.id !== id);
  }

  public createQueryBuilder(_alias: string) {
    const state: QueryBuilderState = {
      take: 21
    };

    const builder = {
      orderBy: () => builder,
      addOrderBy: () => builder,
      take: (value: number) => {
        state.take = value;
        return builder;
      },
      andWhere: (_query: string, params: { cursorCreatedAt: Date; cursorId: string }) => {
        state.cursorCreatedAt = params.cursorCreatedAt;
        state.cursorId = params.cursorId;
        return builder;
      },
      getMany: async (): Promise<Note[]> => {
        let items = [...this.notes].sort(this.sortNotesDesc);

        if (state.cursorCreatedAt && state.cursorId) {
          items = items.filter((note) => {
            if (note.createdAt < state.cursorCreatedAt!) {
              return true;
            }

            if (note.createdAt.getTime() === state.cursorCreatedAt!.getTime()) {
              return note.id < state.cursorId!;
            }

            return false;
          });
        }

        return items.slice(0, state.take);
      }
    };

    return builder;
  }

  private upsert(note: Note): Note {
    const existingIndex = this.notes.findIndex((item) => item.id === note.id);

    if (existingIndex >= 0) {
      this.notes[existingIndex] = note;
      return note;
    }

    this.notes.push(note);
    return note;
  }

  private readonly sortNotesDesc = (a: Note, b: Note): number => {
    if (a.createdAt.getTime() !== b.createdAt.getTime()) {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }

    return b.id.localeCompare(a.id);
  };
}
