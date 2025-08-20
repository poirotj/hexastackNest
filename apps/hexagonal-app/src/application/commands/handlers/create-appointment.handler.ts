import { ICommandHandler, IEventPublisher, EVENT_PUBLISHER } from '../../../domain/application/command-handler.interface';
import { CreateAppointmentCommand } from '../create-appointment.command';
import { Appointment } from '../../../domain/entities/appointment.entity';
import { IAppointmentWriteRepository, APPOINTMENT_WRITE_REPOSITORY } from '../../../domain/repositories/appointment-write.repository.interface';

export class CreateAppointmentHandler implements ICommandHandler<CreateAppointmentCommand> {
  constructor(
    private readonly appointmentWriteRepository: IAppointmentWriteRepository,
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(command: CreateAppointmentCommand): Promise<void> {
    const appointment = Appointment.create({
      title: command.title,
      description: command.description,
      startDate: command.startDate,
      endDate: command.endDate,
      patientId: command.patientId,
      doctorId: command.doctorId,
    });

    await this.appointmentWriteRepository.save(appointment);
    
    // Publier les événements non commités
    const events = appointment.getUncommittedEvents();
    await this.eventPublisher.publishAll(events);
    appointment.commit();
  }
}
