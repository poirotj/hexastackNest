import { Injectable, Inject } from '@nestjs/common';
import { 
  INotificationService, 
  ICalendarService, 
  IPatientService, 
  IDoctorService,
  NOTIFICATION_SERVICE,
  CALENDAR_SERVICE,
  PATIENT_SERVICE,
  DOCTOR_SERVICE
} from '../../domain/services/external-services.interface';

// Classe de base pour toutes les sagas
// Fournit l'accès aux services externes communs
@Injectable()
export abstract class BaseSaga {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    protected readonly notificationService: INotificationService,
    @Inject(CALENDAR_SERVICE)
    protected readonly calendarService: ICalendarService,
    @Inject(PATIENT_SERVICE)
    protected readonly patientService: IPatientService,
    @Inject(DOCTOR_SERVICE)
    protected readonly doctorService: IDoctorService,
  ) {}

  // Méthodes utilitaires communes
  protected async getPatientAndDoctor(patientId: string, doctorId: string) {
    const [patient, doctor] = await Promise.all([
      this.patientService.getPatientById(patientId),
      this.doctorService.getDoctorById(doctorId),
    ]);
    return { patient, doctor };
  }

  protected logSuccess(operation: string, appointmentId: string): void {
    console.log(`✅ Saga ${operation}: Rendez-vous ${appointmentId} traité avec succès`);
  }

  protected logError(operation: string, appointmentId: string, error: any): void {
    console.error(`❌ Saga ${operation}: Erreur pour le rendez-vous ${appointmentId}:`, error);
  }

  protected logCompensation(operation: string, appointmentId: string): void {
    console.log(`🔄 Compensation ${operation}: Tentative de nettoyage pour le rendez-vous ${appointmentId}`);
  }
}
