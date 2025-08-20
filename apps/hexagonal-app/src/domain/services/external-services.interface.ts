// Interfaces pour les services externes utilisés par les sagas
// Ces interfaces sont dans le domaine car elles définissent des contrats métier

export const NOTIFICATION_SERVICE = 'NOTIFICATION_SERVICE';
export const CALENDAR_SERVICE = 'CALENDAR_SERVICE';
export const PATIENT_SERVICE = 'PATIENT_SERVICE';
export const DOCTOR_SERVICE = 'DOCTOR_SERVICE';

export interface INotificationService {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
  sendSMS(to: string, message: string): Promise<void>;
}

export interface ICalendarService {
  addEvent(doctorId: string, appointment: any): Promise<void>;
  removeEvent(doctorId: string, appointmentId: string): Promise<void>;
  updateEvent(doctorId: string, appointment: any): Promise<void>;
}

export interface IPatientService {
  getPatientById(patientId: string): Promise<{ email: string; phone: string; name: string }>;
}

export interface IDoctorService {
  getDoctorById(doctorId: string): Promise<{ email: string; phone: string; name: string }>;
}
