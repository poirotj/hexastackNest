# Architecture CQRS (Command Query Responsibility Segregation)

## 🎯 Distinction CQS vs CQRS

### CQS (Command Query Separation)
- **Séparation conceptuelle** : Les commandes modifient l'état, les requêtes le consultent
- **Même modèle de données** : Utilise le même repository pour les deux
- **Même base de données** : Lecture et écriture sur les mêmes tables

### CQRS (Command Query Responsibility Segregation)
- **Séparation physique** : Modèles de données différents pour lecture et écriture
- **Repositories séparés** : Un pour les commandes, un pour les requêtes
- **Bases de données séparées** : Possibilité d'avoir des bases différentes (ou projections)

## 🏗️ Architecture Implémentée

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                          │
├─────────────────────────────────────────────────────────────────┤
│  Controllers REST                                               │
│  ├── POST /appointments (Command)                              │
│  ├── PUT /appointments/:id/confirm (Command)                   │
│  ├── GET /appointments (Query)                                 │
│  └── GET /appointments/:id (Query)                             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  COMMANDS (Write Side)                    QUERIES (Read Side)   │
│  ├── CreateAppointmentCommand             ├── GetAppointmentQuery │
│  ├── ConfirmAppointmentCommand            ├── GetAppointmentsQuery │
│  ├── CancelAppointmentCommand             └── Handlers           │
│  └── Handlers                             │
│      │                                    │
│      ▼                                    ▼
│  ┌─────────────────┐              ┌─────────────────┐
│  │ Write Repository│              │ Read Repository │
│  │ Interface       │              │ Interface       │
│  └─────────────────┘              └─────────────────┘
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  WRITE SIDE (Event Sourcing)           READ SIDE (Projections) │
│  ┌─────────────────────────────────┐   ┌─────────────────────┐ │
│  │ AppointmentWriteRepository      │   │ AppointmentReadRepo │ │
│  │ ├── save() → Event Store        │   │ ├── findById()      │ │
│  │ └── findById() → Rebuild Agg.   │   │ ├── findByPatient() │ │
│  └─────────────────────────────────┘   │ └── findAll()       │ │
│                                        └─────────────────────┘ │
│  ┌─────────────────────────────────┐                           │
│  │ Event Handlers                  │                           │
│  │ ├── AppointmentCreatedHandler   │                           │
│  │ ├── AppointmentConfirmedHandler │                           │
│  │ └── AppointmentCancelledHandler │                           │
│  └─────────────────────────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  EVENT STORE (Write)                    READ MODELS (Read)     │
│  ┌─────────────────────────────────┐   ┌─────────────────────┐ │
│  │ event_store collection          │   │ appointment_read_   │ │
│  │ ├── aggregateId                 │   │ models collection   │ │
│  │ ├── eventType                   │   │ ├── appointmentId   │ │
│  │ ├── eventData                   │   │ ├── title           │ │
│  │ └── version                     │   │ ├── status          │ │
│  └─────────────────────────────────┘   │ └── ...              │ │
│                                        └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Flux de Données

### 1. Commande (Write Side)
```
1. Controller → Command → CommandHandler
2. CommandHandler → WriteRepository.save()
3. WriteRepository → Event Store
4. Event → EventHandler → ProjectionService
5. ProjectionService → Read Model Update
```

### 2. Requête (Read Side)
```
1. Controller → Query → QueryHandler
2. QueryHandler → ReadRepository
3. ReadRepository → Read Model (Projection)
4. Return ReadModel
```

## 📊 Avantages de cette Architecture

### 1. **Séparation des Responsabilités**
- **Write Side** : Optimisé pour la cohérence et l'intégrité
- **Read Side** : Optimisé pour les performances de lecture

### 2. **Scalabilité**
- Possibilité de scaler les lectures et écritures indépendamment
- Possibilité d'utiliser des bases de données différentes

### 3. **Flexibilité**
- Modèles de données optimisés pour chaque cas d'usage
- Possibilité d'ajouter facilement de nouvelles projections

### 4. **Performance**
- Lectures rapides sur des projections optimisées
- Écritures optimisées pour l'event sourcing

## 🔧 Implémentation Technique

### Write Repository
```typescript
export interface IAppointmentWriteRepository {
  save(appointment: Appointment): Promise<void>;
  findById(id: string): Promise<Appointment | null>;
}
```

### Read Repository
```typescript
export interface IAppointmentReadRepository {
  findById(id: string): Promise<AppointmentReadModel | null>;
  findByPatientId(patientId: string): Promise<AppointmentReadModel[]>;
  findByDoctorId(doctorId: string): Promise<AppointmentReadModel[]>;
  findAll(): Promise<AppointmentReadModel[]>;
}
```

### Projection Service
```typescript
export class AppointmentProjectionService {
  async updateReadModel(appointment: Appointment): Promise<void> {
    // Met à jour les projections de lecture
    // quand les événements sont publiés
  }
}
```

## 🚀 Évolutions Futures

### 1. **Bases de Données Séparées**
```typescript
// Write Database (Event Store)
DATABASE_URL_WRITE="mongodb://write-db:27017/event_store"

// Read Database (Projections)
DATABASE_URL_READ="mongodb://read-db:27017/projections"
```

### 2. **Caching**
```typescript
// Redis pour les projections
@Injectable()
export class CachedAppointmentReadRepository implements IAppointmentReadRepository {
  constructor(
    private readonly redis: RedisService,
    private readonly readRepository: AppointmentReadRepository,
  ) {}
}
```

### 3. **Event Streaming**
```typescript
// Kafka pour la communication entre Write et Read
@EventsHandler(AppointmentCreatedEvent)
export class AppointmentCreatedHandler {
  async handle(event: AppointmentCreatedEvent) {
    await this.kafkaProducer.send('appointment-events', event);
  }
}
```

## 📈 Métriques et Monitoring

### Write Side
- Nombre d'événements par seconde
- Latence des commandes
- Taille de l'event store

### Read Side
- Latence des requêtes
- Hit rate du cache
- Performance des projections

Cette architecture CQRS permet une vraie séparation entre les modèles de lecture et d'écriture, offrant flexibilité et performance pour des applications complexes.
