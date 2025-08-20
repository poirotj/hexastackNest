import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AppointmentCreatedEvent } from '../../domain/events/appointment.events';
import { AppointmentProjectionService } from '../services/appointment-projection.service';

@EventsHandler(AppointmentCreatedEvent)
export class AppointmentCreatedHandler implements IEventHandler<AppointmentCreatedEvent> {
  constructor(private readonly projectionService: AppointmentProjectionService) {}

  async handle(event: AppointmentCreatedEvent) {
    console.log('AppointmentCreatedEvent handled:', event.appointmentId);
    
    // Note: Pour mettre à jour la projection, nous aurions besoin de récupérer l'agrégat complet
    // car l'événement ne contient que les données de base
    // await this.projectionService.updateReadModel(appointment);
    
    // Ici vous pouvez ajouter d'autres logiques comme :
    // - Envoyer des notifications
    // - Mettre à jour d'autres projections
    // - Déclencher des processus métier
  }
}
