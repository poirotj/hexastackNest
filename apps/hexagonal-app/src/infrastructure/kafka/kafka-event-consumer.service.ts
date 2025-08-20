import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { KAFKA_TOPICS } from './kafka.config';

// Interfaces pour les événements des autres BCs
export interface PatientRegisteredEvent {
  patientId: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: Date;
}

export interface DoctorAvailableEvent {
  doctorId: string;
  name: string;
  specialty: string;
  availableSlots: Array<{
    startTime: Date;
    endTime: Date;
  }>;
  availableAt: Date;
}

export interface CalendarSlotFreedEvent {
  doctorId: string;
  startTime: Date;
  endTime: Date;
  freedAt: Date;
}

@Injectable()
export class KafkaEventConsumerService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    // S'abonner aux topics des autres BCs
    await this.kafkaClient.subscribeToResponseOf(KAFKA_TOPICS.PATIENT_REGISTERED);
    await this.kafkaClient.subscribeToResponseOf(KAFKA_TOPICS.DOCTOR_AVAILABLE);
    await this.kafkaClient.subscribeToResponseOf(KAFKA_TOPICS.CALENDAR_SLOT_FREED);
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }

  @MessagePattern(KAFKA_TOPICS.PATIENT_REGISTERED)
  async handlePatientRegistered(@Payload() message: any): Promise<void> {
    try {
      const event: PatientRegisteredEvent = message.value;
      console.log(`📥 Patient enregistré reçu: ${event.patientId} - ${event.name}`);
      
      // Ici on peut déclencher des processus métier
      // Par exemple : vérifier les rendez-vous existants, envoyer une notification de bienvenue, etc.
      await this.processPatientRegistered(event);
      
    } catch (error) {
      console.error(`❌ Erreur lors du traitement de PatientRegistered: ${error.message}`);
    }
  }

  @MessagePattern(KAFKA_TOPICS.DOCTOR_AVAILABLE)
  async handleDoctorAvailable(@Payload() message: any): Promise<void> {
    try {
      const event: DoctorAvailableEvent = message.value;
      console.log(`📥 Médecin disponible reçu: ${event.doctorId} - ${event.name}`);
      
      // Traitement métier : mettre à jour les créneaux disponibles, notifier les patients en attente, etc.
      await this.processDoctorAvailable(event);
      
    } catch (error) {
      console.error(`❌ Erreur lors du traitement de DoctorAvailable: ${error.message}`);
    }
  }

  @MessagePattern(KAFKA_TOPICS.CALENDAR_SLOT_FREED)
  async handleCalendarSlotFreed(@Payload() message: any): Promise<void> {
    try {
      const event: CalendarSlotFreedEvent = message.value;
      console.log(`📥 Créneau libéré reçu: Dr.${event.doctorId} - ${event.startTime.toISOString()}`);
      
      // Traitement métier : notifier les patients en liste d'attente, mettre à jour les projections, etc.
      await this.processCalendarSlotFreed(event);
      
    } catch (error) {
      console.error(`❌ Erreur lors du traitement de CalendarSlotFreed: ${error.message}`);
    }
  }

  private async processPatientRegistered(event: PatientRegisteredEvent): Promise<void> {
    // Logique métier pour un nouveau patient
    console.log(`🔄 Traitement du patient ${event.name} (${event.email})`);
    
    // Exemples d'actions possibles :
    // - Vérifier s'il a des rendez-vous existants
    // - Envoyer un email de bienvenue
    // - Créer un profil patient dans notre système
    // - Déclencher des processus de validation
  }

  private async processDoctorAvailable(event: DoctorAvailableEvent): Promise<void> {
    // Logique métier pour un médecin disponible
    console.log(`🔄 Traitement du médecin ${event.name} (${event.specialty})`);
    
    // Exemples d'actions possibles :
    // - Mettre à jour les créneaux disponibles
    // - Notifier les patients en attente
    // - Optimiser la planification des rendez-vous
    // - Déclencher des processus de réservation automatique
  }

  private async processCalendarSlotFreed(event: CalendarSlotFreedEvent): Promise<void> {
    // Logique métier pour un créneau libéré
    console.log(`🔄 Traitement du créneau libéré pour le Dr.${event.doctorId}`);
    
    // Exemples d'actions possibles :
    // - Notifier les patients en liste d'attente
    // - Mettre à jour les projections de disponibilité
    // - Déclencher des processus de réservation automatique
    // - Optimiser la planification
  }
}
