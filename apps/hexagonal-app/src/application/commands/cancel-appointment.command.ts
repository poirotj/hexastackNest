import { ICommand } from '../../domain/application/command-handler.interface';

export class CancelAppointmentCommand implements ICommand {
  constructor(
    public readonly appointmentId: string,
  ) {}
}
