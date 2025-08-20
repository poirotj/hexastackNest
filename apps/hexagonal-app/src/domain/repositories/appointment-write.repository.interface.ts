import { Appointment } from '../entities/appointment.entity';

export const APPOINTMENT_WRITE_REPOSITORY = 'APPOINTMENT_WRITE_REPOSITORY';

export interface IAppointmentWriteRepository {
  save(appointment: Appointment): Promise<void>;
  findById(id: string): Promise<Appointment | null>;
}
