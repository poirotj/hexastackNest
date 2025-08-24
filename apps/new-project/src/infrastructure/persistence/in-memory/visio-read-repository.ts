import { Injectable } from '@nestjs/common';
import { IVisioReadRepository, VisioEntity } from '@/domain';

@Injectable()
export class InMemoryVisioReadRepository implements IVisioReadRepository {
  private entities: Map<string, VisioEntity> = new Map();

  async findById(id: string): Promise<VisioEntity | null> {
    return this.entities.get(id) || null;
  }

  async findActive(): Promise<VisioEntity[]> {
    return Array.from(this.entities.values()).filter(entity => entity.isActive());
  }

  async findByHost(hostId: string): Promise<VisioEntity[]> {
    return Array.from(this.entities.values()).filter(entity => {
      const host = entity.getHostParticipant();
      return host && host.id === hostId;
    });
  }

  async findByStatus(status: string): Promise<VisioEntity[]> {
    return Array.from(this.entities.values()).filter(entity => entity.status === status);
  }

  async findByDateRange(from: Date, to: Date): Promise<VisioEntity[]> {
    return Array.from(this.entities.values()).filter(entity => {
      const createdAt = entity.createdAt;
      return createdAt >= from && createdAt <= to;
    });
  }

  async search(criteria: {
    status?: string;
    hostId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
  }): Promise<VisioEntity[]> {
    let results = Array.from(this.entities.values());

    // Filtrage par statut
    if (criteria.status) {
      results = results.filter(entity => entity.status === criteria.status);
    }

    // Filtrage par host
    if (criteria.hostId) {
      results = results.filter(entity => {
        const host = entity.getHostParticipant();
        return host && host.id === criteria.hostId;
      });
    }

    // Filtrage par date
    if (criteria.dateFrom) {
      results = results.filter(entity => entity.createdAt >= criteria.dateFrom!);
    }
    if (criteria.dateTo) {
      results = results.filter(entity => entity.createdAt <= criteria.dateTo!);
    }

    // Pagination
    if (criteria.offset) {
      results = results.slice(criteria.offset);
    }
    if (criteria.limit) {
      results = results.slice(0, criteria.limit);
    }

    return results;
  }

  async getStatistics(): Promise<{
    totalVisios: number;
    activeVisios: number;
    totalParticipants: number;
    averageParticipantsPerVisio: number;
  }> {
    const totalVisios = this.entities.size;
    const activeVisios = Array.from(this.entities.values()).filter(entity => entity.isActive()).length;
    
    const totalParticipants = Array.from(this.entities.values())
      .reduce((total, entity) => total + entity.participants.length, 0);
    
    const averageParticipantsPerVisio = totalVisios > 0 ? totalParticipants / totalVisios : 0;

    return {
      totalVisios,
      activeVisios,
      totalParticipants,
      averageParticipantsPerVisio
    };
  }

  async findWithPagination(page: number, limit: number): Promise<{
    visios: VisioEntity[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const total = this.entities.size;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    
    const visios = Array.from(this.entities.values())
      .slice(offset, offset + limit);

    return {
      visios,
      total,
      page,
      totalPages
    };
  }

  // Méthodes utilitaires pour la synchronisation
  async save(entity: VisioEntity): Promise<void> {
    this.entities.set(entity.id.getValue(), entity);
  }

  async update(entity: VisioEntity): Promise<void> {
    this.entities.set(entity.id.getValue(), entity);
  }

  async delete(id: string): Promise<void> {
    this.entities.delete(id);
  }

  // Méthodes utilitaires pour les tests et le développement
  clear(): void {
    this.entities.clear();
  }

  getAllEntities(): VisioEntity[] {
    return Array.from(this.entities.values());
  }
}
