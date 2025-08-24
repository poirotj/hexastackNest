import { Injectable, Inject } from '@nestjs/common';
import { VisioAggregate, VisioEntity, ParticipantEntityDto, VisioId } from '@/domain';
import { IVisioRepository } from '@/domain';

@Injectable()
export class VisioProjectionService {
  constructor(
    @Inject('IVisioRepository')
    private readonly visioRepository: IVisioRepository
  ) {}

  // Convertir un agrégat en entité de lecture
  toVisioEntity(aggregate: VisioAggregate): VisioEntity {
    return VisioEntity.fromAggregate(aggregate);
  }

  // Récupérer une entité Visio par ID
  async getVisioEntity(visioId: string): Promise<VisioEntity | null> {
    const visioIdObj = new VisioId(visioId);
    const aggregate = await this.visioRepository.findById(visioIdObj);
    if (!aggregate) {
      return null;
    }
    
    return this.toVisioEntity(aggregate);
  }

  // Lister toutes les visios actives
  async getActiveVisios(): Promise<VisioEntity[]> {
    // Note: Cette méthode nécessitera une implémentation spécifique
    // dans le repository pour optimiser les requêtes de lecture
    throw new Error('Not implemented - requires read-optimized repository');
  }

  // Rechercher des visios par critères
  async searchVisios(criteria: {
    status?: string;
    hostId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<VisioEntity[]> {
    // Note: Cette méthode nécessitera une implémentation spécifique
    // dans le repository pour optimiser les requêtes de lecture
    throw new Error('Not implemented - requires read-optimized repository');
  }

  // Obtenir des statistiques
  async getVisioStatistics(): Promise<{
    totalVisios: number;
    activeVisios: number;
    totalParticipants: number;
    averageParticipantsPerVisio: number;
  }> {
    // Note: Cette méthode nécessitera une implémentation spécifique
    // dans le repository pour optimiser les requêtes de lecture
    throw new Error('Not implemented - requires read-optimized repository');
  }
}
