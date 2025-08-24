export enum ParticipantType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL'
}

export class ParticipantTypeValue {
  constructor(private readonly type: ParticipantType) {}

  getValue(): ParticipantType {
    return this.type;
  }

  isInternal(): boolean {
    return this.type === ParticipantType.INTERNAL;
  }

  isExternal(): boolean {
    return this.type === ParticipantType.EXTERNAL;
  }
}
