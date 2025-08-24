import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AddParticipantCommand } from '../commands';
import { VisioAggregate, Participant, ParticipantAddedEvent, ConnectionLinkGeneratedEvent } from '@/domain';
import { IVisioRepository } from '@/domain';

@CommandHandler(AddParticipantCommand)
export class AddParticipantHandler implements ICommandHandler<AddParticipantCommand> {
  constructor(
    @Inject('IVisioRepository')
    private readonly visioRepository: IVisioRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: AddParticipantCommand): Promise<void> {
    const { visioId, participantId, type, isHost, preferences } = command;

    // Récupérer l'agrégat
    const visio = await this.visioRepository.findById(visioId);
    if (!visio) {
      throw new Error('Visio not found');
    }

    // Créer le participant
    const participant = Participant.create(participantId, type, isHost, preferences);

    // Ajouter le participant à la visio
    visio.addParticipant(participant);

    // Générer le lien de connexion
    participant.generateConnectionLink();

    // Sauvegarder l'agrégat
    await this.visioRepository.save(visio);

    // Publier les événements
    const events = [
      new ParticipantAddedEvent(visioId, participantId, type, isHost, preferences),
      new ConnectionLinkGeneratedEvent(
        visioId, 
        participantId, 
        participant.getConnectionLink()!.getValue(),
        participant.getConnectionLink()!.getExpiredAt()
      )
    ];

    await this.visioRepository.saveEvents(visioId.getValue(), events);
    
    events.forEach(event => this.eventBus.publish(event));
  }
}
