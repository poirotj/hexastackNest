export const APPOINTMENT_READ_REPOSITORY = 'APPOINTMENT_READ_REPOSITORY';

export interface AppointmentReadModel {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  patientId: string;
  doctorId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAppointmentReadRepository {
  findById(id: string): Promise<AppointmentReadModel | null>;
  findByPatientId(patientId: string): Promise<AppointmentReadModel[]>;
  findByDoctorId(doctorId: string): Promise<AppointmentReadModel[]>;
  findAll(): Promise<AppointmentReadModel[]>;
  findByStatus(status: string): Promise<AppointmentReadModel[]>;
}
