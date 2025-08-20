import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { IEventPublisher } from '../../domain/application/command-handler.interface';
import { KAFKA_TOPICS } from './kafka.config';
import { IDomainEvent } from '../../domain/entities/aggregate-root.interface';

@Injectable()
export class KafkaEventPublisherService implements IEventPublisher, OnModuleInit, OnModuleDestroy {
  constructor(private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }

  async publish(event: IDomainEvent): Promise<void> {
    const topic = this.getTopicForEvent(event);
    if (!topic) {
      console.warn(`Aucun topic trouvé pour l'événement: ${event.eventType}`);
      return;
    }

    try {
      await this.kafkaClient.emit(topic, {
        key: this.getEventKey(event),
        value: {
          eventType: event.eventType,
          occurredOn: event.occurredOn,
          data: event,
          metadata: {
            source: 'appointment-service',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
          },
        },
      }).toPromise();

      console.log(`✅ Événement publié sur Kafka: ${event.eventType} -> ${topic}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la publication sur Kafka: ${error.message}`);
      throw new Error(`Impossible de publier l'événement ${event.eventType} sur Kafka: ${error.message}`);
    }
  }

  async publishAll(events: IDomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  private getTopicForEvent(event: IDomainEvent): string | null {
    switch (event.eventType) {
      case 'AppointmentCreatedEvent':
        return KAFKA_TOPICS.APPOINTMENT_CREATED;
      case 'AppointmentConfirmedEvent':
        return KAFKA_TOPICS.APPOINTMENT_CONFIRMED;
      case 'AppointmentCancelledEvent':
        return KAFKA_TOPICS.APPOINTMENT_CANCELLED;
      case 'AppointmentCompletedEvent':
        return KAFKA_TOPICS.APPOINTMENT_COMPLETED;
      default:
        return null;
    }
  }

  private getEventKey(event: IDomainEvent): string {
    // Utiliser l'ID de l'agrégat comme clé pour garantir l'ordre des événements
    if ('appointmentId' in event) {
      return (event as any).appointmentId;
    }
    // Fallback sur un timestamp si pas d'ID
    return Date.now().toString();
  }
}
