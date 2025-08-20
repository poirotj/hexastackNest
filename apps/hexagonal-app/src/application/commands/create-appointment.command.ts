import { ICommand } from '../../domain/application/command-handler.interface';

export class CreateAppointmentCommand implements ICommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly patientId: string,
    public readonly doctorId: string,
  ) {}
}
