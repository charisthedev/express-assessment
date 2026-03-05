import { AppError } from '../errors/AppError';

export interface CursorPaginationQuery {
  cursor?: string;
  limit?: number;
}

export interface CursorPaginationMetadata {
  hasNextPage: boolean;
  nextCursor: string | null;
}

export interface CursorPaginatedResult<T> {
  data: T[];
  meta: CursorPaginationMetadata;
}

export class PaginationService {
  private static readonly DEFAULT_LIMIT = 20;
  private static readonly MAX_LIMIT = 100;
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  public async paginateByCursor<TItem extends { id: string }>(
    query: CursorPaginationQuery,
    fetchPage: (args: { limit: number; cursorId: string | null }) => Promise<TItem[]>
  ): Promise<CursorPaginatedResult<TItem>> {
    const limit = this.normalizeLimit(query.limit);
    const cursorId = this.decodeCursor(query.cursor);
    const fetchedItems = await fetchPage({ limit, cursorId });
    return this.createCursorPage(fetchedItems, limit);
  }

  private normalizeLimit(limit?: number): number {
    if (limit === undefined || Number.isNaN(limit)) {
      return PaginationService.DEFAULT_LIMIT;
    }

    if (!Number.isInteger(limit) || limit < 1) {
      throw new AppError('`limit` must be a positive integer', 400);
    }

    return Math.min(limit, PaginationService.MAX_LIMIT);
  }

  private encodeCursor(entityId: string): string {
    if (!PaginationService.UUID_REGEX.test(entityId)) {
      throw new AppError('Invalid entity id for cursor', 400);
    }

    return Buffer.from(entityId, 'utf8').toString('base64url');
  }

  private decodeCursor(cursor?: string): string | null {
    if (!cursor) {
      return null;
    }

    try {
      const entityId = Buffer.from(cursor, 'base64url').toString('utf8');

      if (!PaginationService.UUID_REGEX.test(entityId)) {
        throw new Error('Invalid cursor');
      }

      return entityId;
    } catch {
      throw new AppError('Invalid cursor', 400);
    }
  }

  private createCursorPage<TItem extends { id: string }>(
    fetchedItems: TItem[],
    limit: number
  ): CursorPaginatedResult<TItem> {
    const hasNextPage = fetchedItems.length > limit;
    const items = hasNextPage ? fetchedItems.slice(0, limit) : fetchedItems;
    const lastItem = items.at(-1);

    return {
      data: items,
      meta: {
        hasNextPage,
        nextCursor: hasNextPage && lastItem ? this.encodeCursor(lastItem.id) : null
      }
    };
  }
}
