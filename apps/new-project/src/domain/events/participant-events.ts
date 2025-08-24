import { DomainEvent } from './base-event';
import { VisioId, ParticipantId, ParticipantType, ParticipantStatus, ParticipantPreferences } from '../value-objects';

export class ParticipantAddedEvent extends DomainEvent {
  constructor(
    public readonly visioId: VisioId,
    public readonly participantId: ParticipantId,
    public readonly type: ParticipantType,
    public readonly isHost: boolean,
    public readonly preferences: ParticipantPreferences
  ) {
    super();
  }

  getEventName(): string {
    return 'ParticipantAdded';
  }

  getAggregateId(): string {
    return this.visioId.getValue();
  }
}

export class ParticipantConnectedEvent extends DomainEvent {
  constructor(
    public readonly visioId: VisioId,
    public readonly participantId: ParticipantId,
    public readonly connectedAt: Date
  ) {
    super();
  }

  getEventName(): string {
    return 'ParticipantConnected';
  }

  getAggregateId(): string {
    return this.visioId.getValue();
  }
}

export class ParticipantDisconnectedEvent extends DomainEvent {
  constructor(
    public readonly visioId: VisioId,
    public readonly participantId: ParticipantId,
    public readonly disconnectedAt: Date
  ) {
    super();
  }

  getEventName(): string {
    return 'ParticipantDisconnected';
  }

  getAggregateId(): string {
    return this.visioId.getValue();
  }
}

export class ParticipantLeftEvent extends DomainEvent {
  constructor(
    public readonly visioId: VisioId,
    public readonly participantId: ParticipantId,
    public readonly leftAt: Date
  ) {
    super();
  }

  getEventName(): string {
    return 'ParticipantLeft';
  }

  getAggregateId(): string {
    return this.visioId.getValue();
  }
}

export class ParticipantRemovedEvent extends DomainEvent {
  constructor(
    public readonly visioId: VisioId,
    public readonly participantId: ParticipantId,
    public readonly removedAt: Date
  ) {
    super();
  }

  getEventName(): string {
    return 'ParticipantRemoved';
  }

  getAggregateId(): string {
    return this.visioId.getValue();
  }
}

export class ParticipantPreferencesUpdatedEvent extends DomainEvent {
  constructor(
    public readonly visioId: VisioId,
    public readonly participantId: ParticipantId,
    public readonly oldPreferences: ParticipantPreferences,
    public readonly newPreferences: ParticipantPreferences
  ) {
    super();
  }

  getEventName(): string {
    return 'ParticipantPreferencesUpdated';
  }

  getAggregateId(): string {
    return this.visioId.getValue();
  }
}

export class ConnectionLinkGeneratedEvent extends DomainEvent {
  constructor(
    public readonly visioId: VisioId,
    public readonly participantId: ParticipantId,
    public readonly connectionLink: string,
    public readonly expiredAt: Date
  ) {
    super();
  }

  getEventName(): string {
    return 'ConnectionLinkGenerated';
  }

  getAggregateId(): string {
    return this.visioId.getValue();
  }
}
