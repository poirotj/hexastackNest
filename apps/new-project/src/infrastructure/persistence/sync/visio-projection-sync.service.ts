import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { 
  VisioCreatedEvent, 
  VisioStartedEvent, 
  VisioActivatedEvent,
  VisioPausedEvent,
  VisioResumedEvent,
  VisioEndedEvent,
  VisioCancelledEvent,
  ParticipantAddedEvent,
  ParticipantConnectedEvent,
  ParticipantDisconnectedEvent,
  ParticipantLeftEvent,
  ParticipantRemovedEvent,
  VisioConfigurationUpdatedEvent,
  VisioEntity,
  VisioAggregate,
  VisioId
} from '@/domain';
import { InMemoryVisioWriteRepository } from '../in-memory/visio-write-repository';
import { InMemoryVisioReadRepository } from '../in-memory/visio-read-repository';

@Injectable()
export class VisioProjectionSyncService {
  constructor(
    private readonly writeRepository: InMemoryVisioWriteRepository,
    private readonly readRepository: InMemoryVisioReadRepository,
    private readonly eventBus: EventBus
  ) {}

  // Méthode pour synchroniser une projection spécifique
  async syncProjection(visioId: string): Promise<void> {
    const visioIdObj = new VisioId(visioId);
    const aggregate = await this.writeRepository.findById(visioIdObj);
    if (!aggregate) {
      return;
    }

    const entity = VisioEntity.fromAggregate(aggregate);
    await this.readRepository.save(entity);
  }

  // Méthode pour synchroniser toutes les projections
  async syncAllProjections(): Promise<void> {
    const aggregates = this.writeRepository.getAllAggregates();
    
    for (const aggregate of aggregates) {
      const entity = VisioEntity.fromAggregate(aggregate);
      await this.readRepository.save(entity);
    }
  }

  // Méthode pour reconstruire une projection depuis les événements
  async rebuildProjectionFromEvents(visioId: string): Promise<void> {
    const events = await this.writeRepository.getEvents(visioId);
    if (events.length === 0) {
      return;
    }

    // Pour l'exemple, on récupère l'agrégat actuel
    // En production, on reconstruirait depuis les événements
    const visioIdObj = new VisioId(visioId);
    const aggregate = await this.writeRepository.findById(visioIdObj);
    if (aggregate) {
      const entity = VisioEntity.fromAggregate(aggregate);
      await this.readRepository.save(entity);
    }
  }

  // Méthodes pour gérer les événements spécifiques
  async handleVisioCreated(event: VisioCreatedEvent): Promise<void> {
    await this.syncProjection(event.getAggregateId());
  }

  async handleVisioStarted(event: VisioStartedEvent): Promise<void> {
    await this.syncProjection(event.getAggregateId());
  }

  async handleVisioActivated(event: VisioActivatedEvent): Promise<void> {
    await this.syncProjection(event.getAggregateId());
  }

  async handleVisioEnded(event: VisioEndedEvent): Promise<void> {
    await this.syncProjection(event.getAggregateId());
  }

  async handleParticipantAdded(event: ParticipantAddedEvent): Promise<void> {
    await this.syncProjection(event.getAggregateId());
  }

  async handleParticipantConnected(event: ParticipantConnectedEvent): Promise<void> {
    await this.syncProjection(event.getAggregateId());
  }

  async handleParticipantDisconnected(event: ParticipantDisconnectedEvent): Promise<void> {
    await this.syncProjection(event.getAggregateId());
  }

  async handleParticipantLeft(event: ParticipantLeftEvent): Promise<void> {
    await this.syncProjection(event.getAggregateId());
  }

  async handleParticipantRemoved(event: ParticipantRemovedEvent): Promise<void> {
    await this.syncProjection(event.getAggregateId());
  }

  async handleVisioConfigurationUpdated(event: VisioConfigurationUpdatedEvent): Promise<void> {
    await this.syncProjection(event.getAggregateId());
  }

  async handleVisioPaused(event: VisioPausedEvent): Promise<void> {
    await this.syncProjection(event.getAggregateId());
  }

  async handleVisioResumed(event: VisioResumedEvent): Promise<void> {
    await this.syncProjection(event.getAggregateId());
  }

  async handleVisioCancelled(event: VisioCancelledEvent): Promise<void> {
    await this.syncProjection(event.getAggregateId());
  }

  // Méthode utilitaire pour obtenir des statistiques en temps réel
  async getRealTimeStatistics(): Promise<{
    totalVisios: number;
    activeVisios: number;
    totalParticipants: number;
    averageParticipantsPerVisio: number;
    recentEvents: number;
  }> {
    const stats = await this.readRepository.getStatistics();
    const recentEvents = this.writeRepository.getAllEvents().length;

    return {
      ...stats,
      recentEvents
    };
  }

  // Méthode pour nettoyer les données (utile pour les tests)
  async clearAllData(): Promise<void> {
    this.writeRepository.clear();
    this.readRepository.clear();
  }
}
