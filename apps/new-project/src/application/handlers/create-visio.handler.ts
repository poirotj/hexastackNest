import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateVisioCommand } from '../commands';
import { VisioAggregate, VisioCreatedEvent } from '@/domain';
import { IVisioRepository } from '@/domain';

@CommandHandler(CreateVisioCommand)
export class CreateVisioHandler implements ICommandHandler<CreateVisioCommand> {
  constructor(
    @Inject('IVisioRepository')
    private readonly visioRepository: IVisioRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: CreateVisioCommand): Promise<void> {
    const { visioId, configuration } = command;

    // Vérifier si la visio existe déjà
    const existingVisio = await this.visioRepository.findById(visioId);
    if (existingVisio) {
      throw new Error('Visio already exists');
    }

    // Créer l'agrégat
    const visio = VisioAggregate.create(visioId, configuration);

    // Sauvegarder l'agrégat
    await this.visioRepository.save(visio);

    // Publier l'événement
    const event = new VisioCreatedEvent(visioId, configuration);
    await this.visioRepository.saveEvents(visioId.getValue(), [event]);
    
    this.eventBus.publish(event);
  }
}
