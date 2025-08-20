import { IQuery } from '../../domain/application/command-handler.interface';

export class GetAppointmentQuery implements IQuery {
  constructor(
    public readonly appointmentId: string,
  ) {}
}
