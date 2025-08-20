// Interface pure pour l'agrégat - aucune dépendance infrastructure
export interface IAggregateRoot {
  getUncommittedEvents(): any[];
  commit(): void;
  markChangesAsCommitted(): void;
}

// Interface pour les événements de domaine
export interface IDomainEvent {
  readonly occurredOn: Date;
  readonly eventType: string;
}
