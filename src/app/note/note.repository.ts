import { DataSource, Repository } from 'typeorm';
import {
    CursorPaginatedResult,
    CursorPaginationQuery,
    PaginationService,
} from '../../common/services/pagination.service';
import { Note } from './note.entity';

export class NoteRepository {
    private readonly repository: Repository<Note>;
    private readonly paginationService: PaginationService;

    constructor(private readonly dataSource: DataSource) {
        this.repository = this.dataSource.getRepository(Note);
        this.paginationService = new PaginationService();
    }

    async create(data: Partial<Note>): Promise<Note> {
        const note = this.repository.create(data);
        return this.repository.save(note);
    }

    async findAll(): Promise<Note[]> {
        return this.repository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findManyByCursor(query: CursorPaginationQuery): Promise<CursorPaginatedResult<Note>> {
        return this.paginationService.paginateByCursor(query, async ({ limit, cursorId }) => {
            const queryBuilder = this.repository
                .createQueryBuilder('note')
                .orderBy('note.createdAt', 'DESC')
                .addOrderBy('note.id', 'DESC')
                .take(limit + 1);

            if (cursorId) {
                const cursorNote = await this.repository.findOne({ where: { id: cursorId } });

                if (!cursorNote) {
                    return [];
                }

                queryBuilder.andWhere(
                    `(note.createdAt < :cursorCreatedAt OR (note.createdAt = :cursorCreatedAt AND note.id < :cursorId))`,
                    {
                        cursorCreatedAt: cursorNote.createdAt,
                        cursorId: cursorNote.id,
                    }
                );
            }

            return queryBuilder.getMany();
        });
    }

    async findById(id: string): Promise<Note | null> {
        return this.repository.findOne({ where: { id } });
    }

    async update(id: string, data: Partial<Note>): Promise<void> {
        await this.repository.update(id, data);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
