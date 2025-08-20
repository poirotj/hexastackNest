import { IQueryHandler } from '../../../domain/application/command-handler.interface';
import { GetAppointmentsQuery } from '../get-appointments.query';
import { IAppointmentReadRepository } from '../../../domain/repositories/appointment-read.repository.interface';

export class GetAppointmentsHandler implements IQueryHandler<GetAppointmentsQuery> {
  constructor(
    private readonly appointmentReadRepository: IAppointmentReadRepository,
  ) {}

  async execute(query: GetAppointmentsQuery) {
    if (query.patientId) {
      return await this.appointmentReadRepository.findByPatientId(query.patientId);
    }
    
    if (query.doctorId) {
      return await this.appointmentReadRepository.findByDoctorId(query.doctorId);
    }
    
    return await this.appointmentReadRepository.findAll();
  }
}
