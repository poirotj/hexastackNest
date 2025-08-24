export enum ParticipantStatus {
  INVITED = 'INVITED',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  LEFT = 'LEFT',
  REMOVED = 'REMOVED'
}

export class ParticipantStatusValue {
  constructor(private readonly status: ParticipantStatus) {}

  getValue(): ParticipantStatus {
    return this.status;
  }

  canTransitionTo(newStatus: ParticipantStatus): boolean {
    const validTransitions: Record<ParticipantStatus, ParticipantStatus[]> = {
      [ParticipantStatus.INVITED]: [ParticipantStatus.CONNECTED, ParticipantStatus.REMOVED],
      [ParticipantStatus.CONNECTED]: [ParticipantStatus.DISCONNECTED, ParticipantStatus.LEFT, ParticipantStatus.REMOVED],
      [ParticipantStatus.DISCONNECTED]: [ParticipantStatus.CONNECTED, ParticipantStatus.LEFT, ParticipantStatus.REMOVED],
      [ParticipantStatus.LEFT]: [],
      [ParticipantStatus.REMOVED]: []
    };

    return validTransitions[this.status].includes(newStatus);
  }

  isActive(): boolean {
    return this.status === ParticipantStatus.CONNECTED;
  }

  isInactive(): boolean {
    return this.status === ParticipantStatus.LEFT || this.status === ParticipantStatus.REMOVED;
  }
}
