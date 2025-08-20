import { Injectable } from '@nestjs/common';
import { BaseSaga } from './base-saga';

@Injectable()
export class AppointmentReminderSaga extends BaseSaga {
  
  // Programmer un rappel 24h avant le rendez-vous
  async scheduleReminder(appointment: any, patient: any, doctor: any): Promise<void> {
    try {
      const reminderTime = new Date(appointment.startDate.getTime() - 24 * 60 * 60 * 1000);
      
      // Ici on utiliserait un service de scheduling comme Bull ou Agenda
      console.log(`📅 Rappel programmé pour ${reminderTime} pour le patient ${patient.name}`);
      
      // Exemples d'actions possibles :
      // - Programmer un email de rappel
      // - Programmer un SMS de rappel
      // - Mettre à jour le système de rappels
      
    } catch (error) {
      console.error(`❌ Erreur lors de la programmation du rappel:`, error);
    }
  }

  // Annuler les rappels programmés
  async cancelScheduledReminders(appointmentId: string): Promise<void> {
    try {
      console.log(`📅 Rappels annulés pour le rendez-vous ${appointmentId}`);
      
      // Exemples d'actions possibles :
      // - Annuler les emails programmés
      // - Annuler les SMS programmés
      // - Nettoyer le système de rappels
      
    } catch (error) {
      console.error(`❌ Erreur lors de l'annulation des rappels:`, error);
    }
  }

  // Envoyer un rappel immédiat
  async sendImmediateReminder(appointment: any, patient: any, doctor: any): Promise<void> {
    try {
      await this.notificationService.sendEmail(
        patient.email,
        'Rappel de rendez-vous',
        this.createReminderEmailContent(appointment, patient, doctor)
      );

      await this.notificationService.sendSMS(
        patient.phone,
        `Rappel: Rendez-vous "${appointment.title}" demain à ${appointment.startDate.toLocaleTimeString()}`
      );

      console.log(`📱 Rappel envoyé pour le rendez-vous ${appointment.id}`);
      
    } catch (error) {
      console.error(`❌ Erreur lors de l'envoi du rappel:`, error);
    }
  }

  private createReminderEmailContent(appointment: any, patient: any, doctor: any): string {
    return `Bonjour ${patient.name},

Ceci est un rappel pour votre rendez-vous :
- Motif: ${appointment.title}
- Date: ${appointment.startDate.toLocaleDateString()}
- Heure: ${appointment.startDate.toLocaleTimeString()}
- Médecin: Dr. ${doctor.name}

Merci de confirmer votre présence ou de nous contacter en cas d'empêchement.`;
  }
}
