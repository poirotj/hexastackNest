import { 
  VisioId, 
  VisioStatus, 
  VisioConfiguration,
  ParticipantId
} from '../value-objects';

// DTO pour les participants en lecture
export interface ParticipantEntityDto {
  id: string;
  type: string;
  status: string;
  isHost: boolean;
  preferences: any;
  hasConnectionLink: boolean;
  connectionLinkExpiredAt: Date | null;
}

// Entité Visio pour la lecture et les projections
export class VisioEntity {
  constructor(
    public readonly id: VisioId,
    public readonly status: VisioStatus,
    public readonly participants: ParticipantEntityDto[],
    public readonly configuration: VisioConfiguration,
    public readonly createdAt: Date,
    public readonly startedAt: Date | null,
    public readonly endedAt: Date | null
  ) {}

  // Méthodes de lecture et de calcul
  getActiveParticipantsCount(): number {
    return this.participants.filter(p => p.status === 'CONNECTED').length;
  }

  getTotalParticipantsCount(): number {
    return this.participants.length;
  }

  isActive(): boolean {
    return this.status === VisioStatus.ACTIVE;
  }

  isEnded(): boolean {
    return this.status === VisioStatus.ENDED || this.status === VisioStatus.CANCELLED;
  }

  canStart(): boolean {
    return this.status === VisioStatus.CREATED && this.participants.length >= 2;
  }

  getHostParticipant(): ParticipantEntityDto | undefined {
    return this.participants.find(p => p.isHost);
  }

  getParticipantById(participantId: ParticipantId): ParticipantEntityDto | undefined {
    return this.participants.find(p => p.id === participantId.getValue());
  }

  // Conversion vers DTO pour l'API
  toDto(): any {
    return {
      id: this.id.getValue(),
      status: this.status,
      participants: this.participants,
      configuration: this.configuration.toData(),
      createdAt: this.createdAt,
      startedAt: this.startedAt,
      endedAt: this.endedAt,
      activeParticipantsCount: this.getActiveParticipantsCount(),
      totalParticipantsCount: this.getTotalParticipantsCount(),
      canStart: this.canStart(),
      isActive: this.isActive(),
      isEnded: this.isEnded()
    };
  }

  // Factory method pour créer depuis l'agrégat
  static fromAggregate(aggregate: any): VisioEntity {
    const participants = aggregate.getParticipants().map(p => ({
      id: p.getId().getValue(),
      type: p.getType().getValue(),
      status: p.getStatus().getValue(),
      isHost: p.isHostParticipant(),
      preferences: p.getPreferences().toData(),
      hasConnectionLink: p.getConnectionLink() !== null,
      connectionLinkExpiredAt: p.getConnectionLink()?.getExpiredAt() || null
    }));

    return new VisioEntity(
      aggregate.getId(),
      aggregate.getStatus().getValue(),
      participants,
      aggregate.getConfiguration(),
      aggregate.getCreatedAt(),
      aggregate.getStartedAt(),
      aggregate.getEndedAt()
    );
  }
}
