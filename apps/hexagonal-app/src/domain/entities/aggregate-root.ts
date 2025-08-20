import { IAggregateRoot, IDomainEvent } from './aggregate-root.interface';

// Implémentation pure de l'agrégat - aucune dépendance infrastructure
export abstract class AggregateRoot implements IAggregateRoot {
  private _uncommittedEvents: IDomainEvent[] = [];
  private _version: number = 0;

  protected apply(event: IDomainEvent): void {
    this._uncommittedEvents.push(event);
    this.handleEvent(event);
  }

  protected handleEvent(event: IDomainEvent): void {
    // Méthode à surcharger dans les classes enfants
    // pour gérer les événements spécifiques
  }

  getUncommittedEvents(): IDomainEvent[] {
    return [...this._uncommittedEvents];
  }

  commit(): void {
    this._uncommittedEvents = [];
  }

  markChangesAsCommitted(): void {
    this._uncommittedEvents = [];
  }

  get version(): number {
    return this._version;
  }

  public incrementVersion(): void {
    this._version++;
  }

  public handleEventPublic(event: IDomainEvent): void {
    this.handleEvent(event);
  }

  // Méthode pour reconstruire l'agrégat depuis les événements
  static fromEvents<T extends AggregateRoot>(
    this: new (...args: any[]) => T,
    events: IDomainEvent[]
  ): T {
    const aggregate = new this();
    events.forEach(event => {
      aggregate.handleEvent(event);
      aggregate.incrementVersion();
    });
    return aggregate;
  }
}
