import { ICommandHandler, IEventPublisher } from '../../../domain/application/command-handler.interface';
import { CancelAppointmentCommand } from '../cancel-appointment.command';
import { IAppointmentWriteRepository } from '../../../domain/repositories/appointment-write.repository.interface';

export class CancelAppointmentHandler implements ICommandHandler<CancelAppointmentCommand> {
  constructor(
    private readonly appointmentWriteRepository: IAppointmentWriteRepository,
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(command: CancelAppointmentCommand): Promise<void> {
    const appointment = await this.appointmentWriteRepository.findById(command.appointmentId);
    
    if (!appointment) {
      throw new Error('Rendez-vous non trouvé');
    }

    appointment.cancel();
    await this.appointmentWriteRepository.save(appointment);
    
    // Publier les événements non commités
    const events = appointment.getUncommittedEvents();
    await this.eventPublisher.publishAll(events);
    appointment.commit();
  }
}
