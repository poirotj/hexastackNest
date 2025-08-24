import { DomainEvent } from './base-event';
import { VisioId, VisioStatus, VisioConfiguration } from '../value-objects';

export class VisioCreatedEvent extends DomainEvent {
  constructor(
    public readonly visioId: VisioId,
    public readonly configuration: VisioConfiguration
  ) {
    super();
  }

  getEventName(): string {
    return 'VisioCreated';
  }

  getAggregateId(): string {
    return this.visioId.getValue();
  }
}

export class VisioStartedEvent extends DomainEvent {
  constructor(
    public readonly visioId: VisioId,
    public readonly startedAt: Date
  ) {
    super();
  }

  getEventName(): string {
    return 'VisioStarted';
  }

  getAggregateId(): string {
    return this.visioId.getValue();
  }
}

export class VisioActivatedEvent extends DomainEvent {
  constructor(
    public readonly visioId: VisioId
  ) {
    super();
  }

  getEventName(): string {
    return 'VisioActivated';
  }

  getAggregateId(): string {
    return this.visioId.getValue();
  }
}

export class VisioPausedEvent extends DomainEvent {
  constructor(
    public readonly visioId: VisioId
  ) {
    super();
  }

  getEventName(): string {
    return 'VisioPaused';
  }

  getAggregateId(): string {
    return this.visioId.getValue();
  }
}

export class VisioResumedEvent extends DomainEvent {
  constructor(
    public readonly visioId: VisioId
  ) {
    super();
  }

  getEventName(): string {
    return 'VisioResumed';
  }

  getAggregateId(): string {
    return this.visioId.getValue();
  }
}

export class VisioEndedEvent extends DomainEvent {
  constructor(
    public readonly visioId: VisioId,
    public readonly endedAt: Date
  ) {
    super();
  }

  getEventName(): string {
    return 'VisioEnded';
  }

  getAggregateId(): string {
    return this.visioId.getValue();
  }
}

export class VisioCancelledEvent extends DomainEvent {
  constructor(
    public readonly visioId: VisioId,
    public readonly cancelledAt: Date
  ) {
    super();
  }

  getEventName(): string {
    return 'VisioCancelled';
  }

  getAggregateId(): string {
    return this.visioId.getValue();
  }
}

export class VisioConfigurationUpdatedEvent extends DomainEvent {
  constructor(
    public readonly visioId: VisioId,
    public readonly oldConfiguration: VisioConfiguration,
    public readonly newConfiguration: VisioConfiguration
  ) {
    super();
  }

  getEventName(): string {
    return 'VisioConfigurationUpdated';
  }

  getAggregateId(): string {
    return this.visioId.getValue();
  }
}
