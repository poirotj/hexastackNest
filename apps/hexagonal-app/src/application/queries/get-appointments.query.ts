import { IQuery } from '../../domain/application/command-handler.interface';

export class GetAppointmentsQuery implements IQuery {
  constructor(
    public readonly patientId?: string,
    public readonly doctorId?: string,
  ) {}
}
