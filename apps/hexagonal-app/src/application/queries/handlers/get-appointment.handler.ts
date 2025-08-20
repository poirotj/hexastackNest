import { IQueryHandler } from '../../../domain/application/command-handler.interface';
import { GetAppointmentQuery } from '../get-appointment.query';
import { IAppointmentReadRepository } from '../../../domain/repositories/appointment-read.repository.interface';

export class GetAppointmentHandler implements IQueryHandler<GetAppointmentQuery> {
  constructor(
    private readonly appointmentReadRepository: IAppointmentReadRepository,
  ) {}

  async execute(query: GetAppointmentQuery) {
    return await this.appointmentReadRepository.findById(query.appointmentId);
  }
}
