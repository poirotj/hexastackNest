# Architecture Hexagonale 100% Pure 

## 🎯 **Problème Résolu**

L'application layer utilisait des dépendances infrastructure :
- ❌ `@nestjs/cqrs` (infrastructure)
- ❌ `EventBus` (infrastructure) 
- ❌ `@CommandHandler` (décorateur infrastructure)

## ✅ **Solution : Interfaces Pures dans le Domaine**

### **1. Interfaces d'Application Pures**

```typescript
// apps/hexagonal-app/src/domain/application/command-handler.interface.ts
export interface ICommand {
  // Marqueur pour les commandes
}

export interface ICommandHandler<TCommand extends ICommand> {
  execute(command: TCommand): Promise<void>;
}

export interface IQuery {
  // Marqueur pour les requêtes  
}

export interface IQueryHandler<TQuery extends IQuery, TResult = any> {
  execute(query: TQuery): Promise<TResult>;
}

export interface IEventPublisher {
  publish(event: any): Promise<void>;
  publishAll(events: any[]): Promise<void>;
}
```

### **2. Application Layer 100% Pure**

```typescript
// ✅ Application Layer - Aucune dépendance infrastructure
import { ICommandHandler, IEventPublisher } from '../../../domain/application/command-handler.interface';
import { CreateAppointmentCommand } from '../create-appointment.command';
import { IAppointmentWriteRepository } from '../../../domain/repositories/appointment-write.repository.interface';

export class CreateAppointmentHandler implements ICommandHandler<CreateAppointmentCommand> {
  constructor(
    private readonly appointmentWriteRepository: IAppointmentWriteRepository,
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(command: CreateAppointmentCommand): Promise<void> {
    // Logique métier pure
    const appointment = Appointment.create(command);
    await this.appointmentWriteRepository.save(appointment);
    
    const events = appointment.getUncommittedEvents();
    await this.eventPublisher.publishAll(events);
    appointment.commit();
  }
}
```

## 🏗️ **Architecture Finale**

```
┌─────────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER (100% PUR)                   │
├─────────────────────────────────────────────────────────────────┤
│  • Entities (Appointment, AggregateRoot)                       │
│  • Events (AppointmentCreatedEvent, etc.)                      │
│  • Interfaces (ICommandHandler, IEventPublisher)               │
│  • Repository Interfaces (IAppointmentWriteRepository)         │
│  ❌ AUCUNE dépendance externe                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER (100% PUR)                 │
├─────────────────────────────────────────────────────────────────┤
│  • Commands (CreateAppointmentCommand)                         │
│  • Queries (GetAppointmentQuery)                               │
│  • Handlers (CreateAppointmentHandler)                         │
│  • Sagas (AppointmentSaga)                                     │
│  ❌ AUCUNE dépendance infrastructure                           │
│  ✅ Dépend uniquement du DOMAIN                                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  • NestJS Adapters (@CommandHandler, EventBus)                 │
│  • Prisma Repositories                                         │
│  • Event Publishers                                            │
│  • Mock Services                                               │
│  ✅ Implémente les interfaces du DOMAIN                        │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 **Avantages de cette Architecture**

### **1. Indépendance Totale**
```typescript
// ✅ Application peut être testée sans infrastructure
const mockRepository = { save: jest.fn(), findById: jest.fn() };
const mockPublisher = { publishAll: jest.fn() };

const handler = new CreateAppointmentHandler(mockRepository, mockPublisher);
```

### **2. Flexibilité Maximum**
```typescript
// ✅ Changer d'infrastructure sans toucher à l'application
// De NestJS CQRS vers MediatR, ou autre framework
{
  provide: EVENT_PUBLISHER,
  useClass: KafkaEventPublisher, // ou RabbitMQEventPublisher
}
```

### **3. Testabilité Parfaite**
```typescript
// ✅ Tests unitaires purs
describe('CreateAppointmentHandler', () => {
  it('should create appointment', async () => {
    // Aucune dépendance infrastructure à mocker
    const handler = new CreateAppointmentHandler(mockRepo, mockPublisher);
    await handler.execute(command);
    expect(mockRepo.save).toHaveBeenCalled();
  });
});
```

## 🔄 **Flux de Données**

### **1. Commande (Write Side)**
```
Controller (Infrastructure)
    ↓
Command (Application - Pure)
    ↓
CommandHandler (Application - Pure)
    ↓
Aggregate (Domain - Pure)
    ↓
Repository Interface (Domain - Pure)
    ↓
Repository Implementation (Infrastructure)
```

### **2. Événement (Event-Driven)**
```
Aggregate.commit() (Domain - Pure)
    ↓
EventPublisher Interface (Domain - Pure)  
    ↓
EventPublisher Implementation (Infrastructure)
    ↓
Event Handlers (Infrastructure)
    ↓
Saga (Application - Pure)
```

## ✅ **Checklist Architecture Hexagonale**

- ✅ **Domain** ne dépend de rien
- ✅ **Application** dépend uniquement du Domain
- ✅ **Infrastructure** implémente les interfaces du Domain
- ✅ **Inversion de dépendance** respectée partout
- ✅ **Aucun import** d'infrastructure dans Domain/Application
- ✅ **Testabilité** maximale avec mocks simples
- ✅ **Flexibilité** pour changer d'infrastructure

Cette architecture respecte maintenant **parfaitement** les principes de l'architecture hexagonale ! 🎉
