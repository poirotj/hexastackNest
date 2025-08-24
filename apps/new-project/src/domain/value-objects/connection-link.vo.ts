export class ConnectionLink {
  constructor(
    private readonly value: string,
    private readonly expiredAt: Date
  ) {
    if (!value || value.trim().length === 0) {
      throw new Error('Connection link value cannot be empty');
    }
    if (expiredAt <= new Date()) {
      throw new Error('Connection link cannot be expired at creation');
    }
  }

  getValue(): string {
    return this.value;
  }

  getExpiredAt(): Date {
    return this.expiredAt;
  }

  isExpired(): boolean {
    return new Date() >= this.expiredAt;
  }

  static generate(validityMinutes: number = 60): ConnectionLink {
    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + validityMinutes);
    
    const value = crypto.randomUUID();
    return new ConnectionLink(value, expiredAt);
  }
}
