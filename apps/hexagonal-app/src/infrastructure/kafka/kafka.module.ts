import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { kafkaConfig } from './kafka.config';
import { KafkaEventPublisherService } from './kafka-event-publisher.service';
import { KafkaEventConsumerService } from './kafka-event-consumer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        ...kafkaConfig,
      },
    ]),
  ],
  providers: [
    KafkaEventPublisherService,
    KafkaEventConsumerService,
  ],
  exports: [
    KafkaEventPublisherService,
    KafkaEventConsumerService,
  ],
})
export class KafkaModule {}
