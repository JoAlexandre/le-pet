import fs from 'fs';
import path from 'path';

interface LgpdLogEntry {
  message: string;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  user: Record<string, unknown> | null;
  origin: Record<string, unknown>;
  data: Record<string, unknown>;
  level: string;
  timestamp: string;
}

interface ListLgpdLogsResult {
  logs: LgpdLogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface LgpdLogsFilter {
  page: number;
  limit: number;
  userId?: string;
  method?: string;
  startDate?: string;
  endDate?: string;
}

export class ListLgpdLogsUseCase {
  private readonly logFilePath = path.resolve(process.cwd(), 'logs', 'lgpd.log');

  async execute(filter: LgpdLogsFilter): Promise<ListLgpdLogsResult> {
    if (!fs.existsSync(this.logFilePath)) {
      return { logs: [], total: 0, page: filter.page, limit: filter.limit, totalPages: 0 };
    }

    const content = await fs.promises.readFile(this.logFilePath, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);

    let entries: LgpdLogEntry[] = [];
    for (const line of lines) {
      try {
        entries.push(JSON.parse(line) as LgpdLogEntry);
      } catch {
        // Ignora linhas corrompidas
      }
    }

    // Ordena do mais recente para o mais antigo
    entries.reverse();

    if (filter.userId) {
      entries = entries.filter(
        (e) => e.user && (e.user as Record<string, unknown>).sub === filter.userId,
      );
    }

    if (filter.method) {
      entries = entries.filter(
        (e) => e.method?.toUpperCase() === filter.method!.toUpperCase(),
      );
    }

    if (filter.startDate) {
      const start = new Date(filter.startDate);
      entries = entries.filter((e) => new Date(e.timestamp) >= start);
    }

    if (filter.endDate) {
      const end = new Date(filter.endDate);
      entries = entries.filter((e) => new Date(e.timestamp) <= end);
    }

    const total = entries.length;
    const totalPages = Math.ceil(total / filter.limit);
    const offset = (filter.page - 1) * filter.limit;
    const paged = entries.slice(offset, offset + filter.limit);

    return {
      logs: paged,
      total,
      page: filter.page,
      limit: filter.limit,
      totalPages,
    };
  }
}
