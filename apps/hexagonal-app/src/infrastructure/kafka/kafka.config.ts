import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: ['localhost:9092'],
      clientId: 'appointment-service',
    },
    consumer: {
      groupId: 'appointment-consumer-group',
      allowAutoTopicCreation: true,
    },
    producer: {
      allowAutoTopicCreation: true,
    },
  },
};

export const KAFKA_TOPICS = {
  APPOINTMENT_CREATED: 'appointment.created',
  APPOINTMENT_CONFIRMED: 'appointment.confirmed',
  APPOINTMENT_CANCELLED: 'appointment.cancelled',
  APPOINTMENT_COMPLETED: 'appointment.completed',
  // Topics pour écouter les événements d'autres BCs
  PATIENT_REGISTERED: 'patient.registered',
  DOCTOR_AVAILABLE: 'doctor.available',
  CALENDAR_SLOT_FREED: 'calendar.slot.freed',
} as const;

export type KafkaTopic = typeof KAFKA_TOPICS[keyof typeof KAFKA_TOPICS];
