import { Injectable } from '@nestjs/common';
import { IVisioRepository } from '@/domain';
import { VisioId, VisioAggregate, DomainEvent } from '@/domain';

@Injectable()
export class InMemoryVisioWriteRepository implements IVisioRepository {
  private aggregates: Map<string, VisioAggregate> = new Map();
  private events: Map<string, DomainEvent[]> = new Map();

  async findById(id: VisioId): Promise<VisioAggregate | null> {
    const aggregateId = id.getValue();
    const storedEvents = this.events.get(aggregateId) || [];
    
    if (storedEvents.length === 0) {
      // Aucun événement, retourner l'agrégat tel quel
      return this.aggregates.get(aggregateId) || null;
    }

    // Reconstruire l'agrégat depuis les événements (comme en production)
    return VisioAggregate.reconstructFromEvents(id, storedEvents);
  }

  async save(visio: VisioAggregate): Promise<void> {
    this.aggregates.set(visio.getId().getValue(), visio);
  }

  async delete(id: VisioId): Promise<void> {
    this.aggregates.delete(id.getValue());
    this.events.delete(id.getValue());
  }

  async saveEvents(aggregateId: string, events: DomainEvent[]): Promise<void> {
    const existingEvents = this.events.get(aggregateId) || [];
    existingEvents.push(...events);
    this.events.set(aggregateId, existingEvents);
  }

  async getEvents(aggregateId: string): Promise<DomainEvent[]> {
    return this.events.get(aggregateId) || [];
  }

  // Méthodes utilitaires pour les tests et le développement
  clear(): void {
    this.aggregates.clear();
    this.events.clear();
  }

  getAllAggregates(): VisioAggregate[] {
    return Array.from(this.aggregates.values());
  }

  getAllEvents(): DomainEvent[] {
    return Array.from(this.events.values()).flat();
  }
}
