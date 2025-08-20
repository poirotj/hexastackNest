import { ICommand } from '../../domain/application/command-handler.interface';

export class ConfirmAppointmentCommand implements ICommand {
  constructor(
    public readonly appointmentId: string,
  ) {}
}
