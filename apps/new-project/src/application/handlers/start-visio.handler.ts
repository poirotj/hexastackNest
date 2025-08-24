import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { StartVisioCommand } from '../commands';
import { VisioAggregate, VisioStartedEvent, VisioActivatedEvent } from '@/domain';
import { IVisioRepository } from '@/domain';

@CommandHandler(StartVisioCommand)
export class StartVisioHandler implements ICommandHandler<StartVisioCommand> {
  constructor(
    @Inject('IVisioRepository')
    private readonly visioRepository: IVisioRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: StartVisioCommand): Promise<void> {
    const { visioId } = command;

    // Récupérer l'agrégat
    const visio = await this.visioRepository.findById(visioId);
    if (!visio) {
      throw new Error('Visio not found');
    }

    // Démarrer la visio
    visio.start();
    visio.activate();

    // Sauvegarder l'agrégat
    await this.visioRepository.save(visio);

    // Publier les événements
    const events = [
      new VisioStartedEvent(visioId, visio.getStartedAt()!),
      new VisioActivatedEvent(visioId)
    ];

    await this.visioRepository.saveEvents(visioId.getValue(), events);
    
    events.forEach(event => this.eventBus.publish(event));
  }
}
