import { ICommandHandler, IEventPublisher } from '../../../domain/application/command-handler.interface';
import { ConfirmAppointmentCommand } from '../confirm-appointment.command';
import { IAppointmentWriteRepository } from '../../../domain/repositories/appointment-write.repository.interface';

export class ConfirmAppointmentHandler implements ICommandHandler<ConfirmAppointmentCommand> {
  constructor(
    private readonly appointmentWriteRepository: IAppointmentWriteRepository,
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(command: ConfirmAppointmentCommand): Promise<void> {
    const appointment = await this.appointmentWriteRepository.findById(command.appointmentId);
    
    if (!appointment) {
      throw new Error('Rendez-vous non trouvé');
    }

    appointment.confirm();
    await this.appointmentWriteRepository.save(appointment);
    
    // Publier les événements non commités
    const events = appointment.getUncommittedEvents();
    await this.eventPublisher.publishAll(events);
    appointment.commit();
  }
}
