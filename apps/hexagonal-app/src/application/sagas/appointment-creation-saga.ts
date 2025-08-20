import { Injectable } from '@nestjs/common';
import { AppointmentCreatedEvent } from '../../domain/events/appointment.events';
import { BaseSaga } from './base-saga';

@Injectable()
export class AppointmentCreationSaga extends BaseSaga {
  
  async execute(event: AppointmentCreatedEvent): Promise<void> {
    try {
      // 1. Récupérer les informations du patient et du médecin
      const { patient, doctor } = await this.getPatientAndDoctor(
        event.patientId, 
        event.doctorId
      );

      // 2. Ajouter l'événement au calendrier du médecin
      await this.calendarService.addEvent(event.doctorId, {
        id: event.appointmentId,
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        patientName: patient.name,
      });

      // 3. Envoyer une notification au patient
      await this.notificationService.sendEmail(
        patient.email,
        'Rendez-vous programmé',
        this.createPatientEmailContent(event, patient, doctor)
      );

      // 4. Envoyer une notification au médecin
      await this.notificationService.sendEmail(
        doctor.email,
        'Nouveau rendez-vous programmé',
        this.createDoctorEmailContent(event, patient, doctor)
      );

      this.logSuccess('Création', event.appointmentId);
      
    } catch (error) {
      this.logError('Création', event.appointmentId, error);
      await this.handleCreationFailure(event, error);
    }
  }

  private async handleCreationFailure(event: AppointmentCreatedEvent, error: any): Promise<void> {
    this.logCompensation('Création', event.appointmentId);
    
    try {
      // Supprimer l'événement du calendrier s'il a été créé
      await this.calendarService.removeEvent(event.doctorId, event.appointmentId);
      console.log(`✅ Compensation: Événement calendrier supprimé pour ${event.appointmentId}`);
    } catch (cleanupError) {
      console.error(`❌ Compensation: Erreur lors du nettoyage calendrier:`, cleanupError);
    }
  }

  private createPatientEmailContent(event: AppointmentCreatedEvent, patient: any, doctor: any): string {
    return `Bonjour ${patient.name},

Votre rendez-vous "${event.title}" a été programmé pour le ${event.startDate.toLocaleDateString()} à ${event.startDate.toLocaleTimeString()}.

Dr. ${doctor.name}

Merci de confirmer votre présence.`;
  }

  private createDoctorEmailContent(event: AppointmentCreatedEvent, patient: any, doctor: any): string {
    return `Bonjour Dr. ${doctor.name},

Un nouveau rendez-vous a été programmé :
- Patient: ${patient.name}
- Motif: ${event.title}
- Date: ${event.startDate.toLocaleDateString()} à ${event.startDate.toLocaleTimeString()}

Merci de confirmer votre disponibilité.`;
  }
}
