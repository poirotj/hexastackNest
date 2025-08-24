export class VisioId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('VisioId cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: VisioId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static generate(): VisioId {
    return new VisioId(crypto.randomUUID());
  }
}
