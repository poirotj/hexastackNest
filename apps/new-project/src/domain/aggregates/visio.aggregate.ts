import { 
  VisioId, 
  VisioStatus, 
  VisioStatusValue,
  VisioConfiguration,
  ParticipantId,
  ParticipantPreferences
} from '../value-objects';
import { Participant } from '../entities';
import { DomainEvent } from '../events';

export class VisioAggregate {
  private participants: Map<string, Participant> = new Map();
  private startedAt: Date | null = null;
  private endedAt: Date | null = null;

  constructor(
    private readonly id: VisioId,
    private status: VisioStatusValue,
    private configuration: VisioConfiguration,
    private readonly createdAt: Date = new Date()
  ) {}

  static create(
    id: VisioId,
    configuration?: VisioConfiguration
  ): VisioAggregate {
    return new VisioAggregate(
      id,
      new VisioStatusValue(VisioStatus.CREATED),
      configuration || VisioConfiguration.createDefault()
    );
  }

  getId(): VisioId {
    return this.id;
  }

  getStatus(): VisioStatusValue {
    return this.status;
  }

  getConfiguration(): VisioConfiguration {
    return this.configuration;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getStartedAt(): Date | null {
    return this.startedAt;
  }

  getEndedAt(): Date | null {
    return this.endedAt;
  }

  getParticipants(): Participant[] {
    return Array.from(this.participants.values());
  }

  getParticipant(participantId: ParticipantId): Participant | undefined {
    return this.participants.get(participantId.getValue());
  }

  addParticipant(participant: Participant): void {
    if (this.status.isEnded()) {
      throw new Error('Cannot add participant to ended visio');
    }

    if (this.participants.size >= this.configuration.getMaxParticipants()) {
      throw new Error('Maximum number of participants reached');
    }

    this.participants.set(participant.getId().getValue(), participant);
  }

  removeParticipant(participantId: ParticipantId): void {
    const participant = this.participants.get(participantId.getValue());
    if (participant) {
      participant.remove();
      this.participants.delete(participantId.getValue());
    }
  }

  start(): void {
    if (!this.status.canTransitionTo(VisioStatus.STARTING)) {
      throw new Error(`Cannot transition from ${this.status.getValue()} to STARTING`);
    }

    if (this.participants.size < 2) {
      throw new Error('Cannot start visio with less than 2 participants');
    }

    this.status = new VisioStatusValue(VisioStatus.STARTING);
    this.startedAt = new Date();
  }

  activate(): void {
    if (!this.status.canTransitionTo(VisioStatus.ACTIVE)) {
      throw new Error(`Cannot transition from ${this.status.getValue()} to ACTIVE`);
    }

    this.status = new VisioStatusValue(VisioStatus.ACTIVE);
  }

  pause(): void {
    if (!this.status.canTransitionTo(VisioStatus.PAUSED)) {
      throw new Error(`Cannot transition from ${this.status.getValue()} to PAUSED`);
    }

    this.status = new VisioStatusValue(VisioStatus.PAUSED);
  }

  resume(): void {
    if (!this.status.canTransitionTo(VisioStatus.ACTIVE)) {
      throw new Error(`Cannot transition from ${this.status.getValue()} to ACTIVE`);
    }

    this.status = new VisioStatusValue(VisioStatus.ACTIVE);
  }

  end(): void {
    if (!this.status.canTransitionTo(VisioStatus.ENDED)) {
      throw new Error(`Cannot transition from ${this.status.getValue()} to ENDED`);
    }

    this.status = new VisioStatusValue(VisioStatus.ENDED);
    this.endedAt = new Date();
  }

  cancel(): void {
    if (!this.status.canTransitionTo(VisioStatus.CANCELLED)) {
      throw new Error(`Cannot transition from ${this.status.getValue()} to CANCELLED`);
    }

    this.status = new VisioStatusValue(VisioStatus.CANCELLED);
    this.endedAt = new Date();
  }

  updateConfiguration(configuration: VisioConfiguration): void {
    if (this.status.isActive()) {
      throw new Error('Cannot update configuration while visio is active');
    }

    if (this.participants.size > configuration.getMaxParticipants()) {
      throw new Error('New max participants is less than current participants count');
    }

    this.configuration = configuration;
  }

  getActiveParticipantsCount(): number {
    return this.getParticipants().filter(p => p.isActive()).length;
  }

  getHostParticipant(): Participant | undefined {
    return this.getParticipants().find(p => p.isHostParticipant());
  }

  canStart(): boolean {
    return this.status.getValue() === VisioStatus.CREATED && this.participants.size >= 2;
  }

  isActive(): boolean {
    return this.status.isActive();
  }

  isEnded(): boolean {
    return this.status.isEnded();
  }

  // Méthode pour reconstruire l'agrégat depuis les événements
  static reconstructFromEvents(
    id: VisioId,
    events: DomainEvent[]
  ): VisioAggregate {
    const aggregate = new VisioAggregate(
      id,
      new VisioStatusValue(VisioStatus.CREATED),
      VisioConfiguration.createDefault()
    );

    // Appliquer tous les événements dans l'ordre
    events.forEach(event => aggregate.applyEvent(event));

    return aggregate;
  }

  // Méthode pour appliquer un événement (utilisée pour la reconstruction)
  private applyEvent(event: DomainEvent): void {
    const eventName = event.getEventName();
    
    switch (eventName) {
      case 'VisioCreated':
        // L'agrégat est déjà créé, pas besoin de faire quoi que ce soit
        break;
        
      case 'VisioStarted':
        this.startedAt = new Date();
        this.status = new VisioStatusValue(VisioStatus.STARTING);
        break;
        
      case 'VisioActivated':
        this.status = new VisioStatusValue(VisioStatus.ACTIVE);
        break;
        
      case 'VisioPaused':
        this.status = new VisioStatusValue(VisioStatus.PAUSED);
        break;
        
      case 'VisioResumed':
        this.status = new VisioStatusValue(VisioStatus.ACTIVE);
        break;
        
      case 'VisioEnded':
        this.endedAt = new Date();
        this.status = new VisioStatusValue(VisioStatus.ENDED);
        break;
        
      case 'VisioCancelled':
        this.endedAt = new Date();
        this.status = new VisioStatusValue(VisioStatus.CANCELLED);
        break;
        
      case 'ParticipantAdded':
        // Note: Pour une reconstruction complète, on aurait besoin d'événements plus détaillés
        // contenant toutes les informations du participant
        // Pour l'exemple, on simule l'ajout d'un participant factice
        const participantId = new ParticipantId('reconstructed-participant');
        const participant = Participant.create(
          participantId,
          'INTERNAL' as any, // Type par défaut
          false, // Pas host par défaut
          ParticipantPreferences.createDefault()
        );
        this.participants.set(participantId.getValue(), participant);
        break;
        
      default:
        // Ignorer les événements non reconnus
        break;
    }
  }

  // Méthode pour obtenir tous les événements non persistés
  getUncommittedEvents(): DomainEvent[] {
    // Pour l'exemple, on retourne un tableau vide
    // En production, on garderait une liste des événements non persistés
    return [];
  }

  // Méthode pour marquer les événements comme persistés
  markEventsAsCommitted(): void {
    // En production, on viderait la liste des événements non persistés
  }
}
