import { 
  ParticipantId, 
  ParticipantType, 
  ParticipantTypeValue,
  ParticipantStatus, 
  ParticipantStatusValue,
  ConnectionLink,
  ParticipantPreferences
} from '../value-objects';

export class Participant {
  constructor(
    private readonly id: ParticipantId,
    private readonly type: ParticipantTypeValue,
    private status: ParticipantStatusValue,
    private readonly isHost: boolean,
    private connectionLink: ConnectionLink | null,
    private preferences: ParticipantPreferences
  ) {}

  static create(
    id: ParticipantId,
    type: ParticipantType,
    isHost: boolean = false,
    preferences?: ParticipantPreferences
  ): Participant {
    return new Participant(
      id,
      new ParticipantTypeValue(type),
      new ParticipantStatusValue(ParticipantStatus.INVITED),
      isHost,
      null,
      preferences || ParticipantPreferences.createDefault()
    );
  }

  getId(): ParticipantId {
    return this.id;
  }

  getType(): ParticipantTypeValue {
    return this.type;
  }

  getStatus(): ParticipantStatusValue {
    return this.status;
  }

  isHostParticipant(): boolean {
    return this.isHost;
  }

  getConnectionLink(): ConnectionLink | null {
    return this.connectionLink;
  }

  getPreferences(): ParticipantPreferences {
    return this.preferences;
  }

  connect(): void {
    if (!this.status.canTransitionTo(ParticipantStatus.CONNECTED)) {
      throw new Error(`Cannot transition from ${this.status.getValue()} to CONNECTED`);
    }
    this.status = new ParticipantStatusValue(ParticipantStatus.CONNECTED);
  }

  disconnect(): void {
    if (!this.status.canTransitionTo(ParticipantStatus.DISCONNECTED)) {
      throw new Error(`Cannot transition from ${this.status.getValue()} to DISCONNECTED`);
    }
    this.status = new ParticipantStatusValue(ParticipantStatus.DISCONNECTED);
  }

  leave(): void {
    if (!this.status.canTransitionTo(ParticipantStatus.LEFT)) {
      throw new Error(`Cannot transition from ${this.status.getValue()} to LEFT`);
    }
    this.status = new ParticipantStatusValue(ParticipantStatus.LEFT);
  }

  remove(): void {
    if (!this.status.canTransitionTo(ParticipantStatus.REMOVED)) {
      throw new Error(`Cannot transition from ${this.status.getValue()} to REMOVED`);
    }
    this.status = new ParticipantStatusValue(ParticipantStatus.REMOVED);
  }

  generateConnectionLink(validityMinutes: number = 60): void {
    this.connectionLink = ConnectionLink.generate(validityMinutes);
  }

  updatePreferences(preferences: ParticipantPreferences): void {
    this.preferences = preferences;
  }

  canConnect(): boolean {
    return this.status.getValue() === ParticipantStatus.INVITED || 
           this.status.getValue() === ParticipantStatus.DISCONNECTED;
  }

  isActive(): boolean {
    return this.status.isActive();
  }
}
