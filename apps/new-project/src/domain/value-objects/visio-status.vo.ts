export enum VisioStatus {
  CREATED = 'CREATED',
  STARTING = 'STARTING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED'
}

export class VisioStatusValue {
  constructor(private readonly status: VisioStatus) {}

  getValue(): VisioStatus {
    return this.status;
  }

  canTransitionTo(newStatus: VisioStatus): boolean {
    const validTransitions: Record<VisioStatus, VisioStatus[]> = {
      [VisioStatus.CREATED]: [VisioStatus.STARTING, VisioStatus.CANCELLED],
      [VisioStatus.STARTING]: [VisioStatus.ACTIVE, VisioStatus.CANCELLED],
      [VisioStatus.ACTIVE]: [VisioStatus.PAUSED, VisioStatus.ENDED],
      [VisioStatus.PAUSED]: [VisioStatus.ACTIVE, VisioStatus.ENDED],
      [VisioStatus.ENDED]: [],
      [VisioStatus.CANCELLED]: []
    };

    return validTransitions[this.status].includes(newStatus);
  }

  isActive(): boolean {
    return this.status === VisioStatus.ACTIVE;
  }

  isEnded(): boolean {
    return this.status === VisioStatus.ENDED || this.status === VisioStatus.CANCELLED;
  }
}
