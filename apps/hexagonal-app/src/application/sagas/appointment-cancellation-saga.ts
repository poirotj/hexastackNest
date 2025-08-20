import { Injectable } from '@nestjs/common';
import { AppointmentCancelledEvent } from '../../domain/events/appointment.events';
import { BaseSaga } from './base-saga';

@Injectable()
export class AppointmentCancellationSaga extends BaseSaga {
  
  async execute(event: AppointmentCancelledEvent): Promise<void> {
    try {
      // Note: Pour l'annulation, nous aurions besoin de récupérer l'agrégat complet
      // car l'événement ne contient que l'ID et la date d'annulation
      
      // Ici on pourrait implémenter la logique d'annulation
      // en récupérant l'agrégat depuis le repository
      
      // Pour l'instant, on simule le processus
      await this.handleCancellationProcess(event);
      
      this.logSuccess('Annulation', event.appointmentId);
      
    } catch (error) {
      this.logError('Annulation', event.appointmentId, error);
      // Pas de compensation nécessaire pour l'annulation
    }
  }

  private async handleCancellationProcess(event: AppointmentCancelledEvent): Promise<void> {
    // Logique métier pour l'annulation
    console.log(`🔄 Traitement de l'annulation pour le rendez-vous ${event.appointmentId}`);
    
    // Exemples d'actions possibles :
    // - Envoyer une notification d'annulation
    // - Libérer le créneau dans le calendrier
    // - Annuler les rappels programmés
    // - Notifier les patients en liste d'attente
    // - Déclencher des processus de remboursement si applicable
  }
}
