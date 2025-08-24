import { VisioId } from '../value-objects';
import { VisioAggregate } from '../aggregates';
import { DomainEvent } from '../events';

export interface IVisioRepository {
  findById(id: VisioId): Promise<VisioAggregate | null>;
  save(visio: VisioAggregate): Promise<void>;
  delete(id: VisioId): Promise<void>;
  saveEvents(aggregateId: string, events: DomainEvent[]): Promise<void>;
  getEvents(aggregateId: string): Promise<DomainEvent[]>;
}
