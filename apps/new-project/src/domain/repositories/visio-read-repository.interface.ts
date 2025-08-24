import { VisioEntity } from '../entities';

export interface IVisioReadRepository {
  // Méthodes de lecture optimisées
  findById(id: string): Promise<VisioEntity | null>;
  findActive(): Promise<VisioEntity[]>;
  findByHost(hostId: string): Promise<VisioEntity[]>;
  findByStatus(status: string): Promise<VisioEntity[]>;
  findByDateRange(from: Date, to: Date): Promise<VisioEntity[]>;
  
  // Recherche avancée
  search(criteria: {
    status?: string;
    hostId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
  }): Promise<VisioEntity[]>;
  
  // Statistiques
  getStatistics(): Promise<{
    totalVisios: number;
    activeVisios: number;
    totalParticipants: number;
    averageParticipantsPerVisio: number;
  }>;
  
  // Pagination
  findWithPagination(page: number, limit: number): Promise<{
    visios: VisioEntity[];
    total: number;
    page: number;
    totalPages: number;
  }>;
}
