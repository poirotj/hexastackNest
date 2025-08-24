export class ParticipantId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ParticipantId cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ParticipantId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static generate(): ParticipantId {
    return new ParticipantId(crypto.randomUUID());
  }
}
