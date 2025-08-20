# NestJS Hexagonal Architecture POC avec Event Sourcing

Ce projet démontre l'implémentation d'une architecture hexagonale (Clean Architecture) avec NestJS, CQRS, Event Sourcing et MongoDB.

## 🏗️ Architecture

Le projet suit les principes de l'architecture hexagonale avec une vraie séparation CQRS :

```
src/
├── domain/                    # Cœur métier (règles métier)
│   ├── entities/             # Agrégats avec logique métier
│   └── repositories/         # Interfaces des repositories
├── application/               # Cas d'usage (commandes/requêtes)
│   ├── commands/             # Commandes CQRS (Write Side)
│   └── queries/              # Requêtes CQRS (Read Side)
├── infrastructure/           # Détails techniques
│   ├── repositories/         # Implémentations séparées Write/Read
│   ├── services/             # Services de projection
│   └── event-handlers/       # Gestionnaires d'événements
└── userInterface/           # Interface utilisateur (API REST)
```

## 🎯 Exemple : Gestion de Rendez-vous

L'exemple implémenté est un système de gestion de rendez-vous médicaux avec :

- **Event Sourcing** : Chaque action génère un événement stocké
- **CQRS** : Vraie séparation des modèles de lecture et d'écriture
- **Projections** : Modèles de lecture optimisés avec repositories séparés
- **Validation métier** : Règles de gestion dans le domaine

### Fonctionnalités

- ✅ Création de rendez-vous
- ✅ Confirmation de rendez-vous
- ✅ Annulation de rendez-vous
- ✅ Consultation des rendez-vous
- ✅ Filtrage par patient/médecin

## 🚀 Démarrage Rapide

### Prérequis

- Node.js (v18+)
- Docker et Docker Compose
- npm ou yarn

### Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd nestjs-hexagonal-poc
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer l'application (MongoDB + NestJS)**
```bash
./start-app.sh
```

### Alternative : Démarrage Manuel

1. **Démarrer MongoDB**
```bash
docker-compose up -d
```

2. **Générer le client Prisma**
```bash
npx prisma generate
```

3. **Démarrer l'application**
```bash
npm run start:dev
```

## 🧪 Tests

### Tester l'API

```bash
./test-appointment.sh
```

### Exemples de Requêtes

#### Créer un rendez-vous
```bash
curl -X POST http://localhost:3000/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Consultation cardiologie",
    "description": "Contrôle annuel",
    "startDate": "2024-01-15T10:00:00Z",
    "endDate": "2024-01-15T11:00:00Z",
    "patientId": "patient123",
    "doctorId": "doctor456"
  }'
```

#### Confirmer un rendez-vous
```bash
curl -X PUT http://localhost:3000/appointments/{id}/confirm
```

#### Récupérer les rendez-vous d'un patient
```bash
curl http://localhost:3000/appointments?patientId=patient123
```

## 📊 Base de Données

### Collections MongoDB

- **event_store** : Stockage des événements (Event Sourcing)
- **appointments** : Modèle principal des rendez-vous
- **appointment_read_models** : Projections optimisées pour la lecture

### Accès à MongoDB

- **MongoDB** : `mongodb://admin:password@localhost:27017/appointment_db`
- **Mongo Express** : http://localhost:8081 (admin/password)

## 🏛️ Structure du Code

### Domain Layer (Cœur métier)

```typescript
// Entité avec logique métier
export class Appointment extends AggregateRoot {
  confirm(): void { /* logique métier */ }
  cancel(): void { /* logique métier */ }
}

// Interface du repository
export interface IAppointmentRepository {
  save(appointment: Appointment): Promise<void>;
  findById(id: string): Promise<Appointment | null>;
}
```

### Application Layer (Cas d'usage)

```typescript
// Commande CQRS
export class CreateAppointmentCommand implements ICommand {
  constructor(
    public readonly title: string,
    public readonly patientId: string,
    // ...
  ) {}
}

// Handler de commande
@CommandHandler(CreateAppointmentCommand)
export class CreateAppointmentHandler implements ICommandHandler<CreateAppointmentCommand> {
  async execute(command: CreateAppointmentCommand): Promise<void> {
    // Logique d'orchestration
  }
}
```

### Infrastructure Layer (Détails techniques)

```typescript
// Implémentation du repository avec Prisma
@Injectable()
export class AppointmentRepository implements IAppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}
  
  async save(appointment: Appointment): Promise<void> {
    // Sauvegarde avec event sourcing
  }
}
```

### User Interface Layer (API)

```typescript
@Controller('appointments')
export class AppointmentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createAppointment(@Body() dto: CreateAppointmentDto) {
    const command = new CreateAppointmentCommand(/* ... */);
    await this.commandBus.execute(command);
  }
}
```

## 🔄 Event Sourcing

### Événements de Domaine

- `AppointmentCreatedEvent`
- `AppointmentConfirmedEvent`
- `AppointmentCancelledEvent`
- `AppointmentCompletedEvent`

### Avantages

- **Audit Trail** : Historique complet des changements
- **Reconstruction** : Possibilité de reconstruire l'état à n'importe quel moment
- **Évolutivité** : Facilite l'ajout de nouvelles fonctionnalités

## 📈 CQRS (Command Query Responsibility Segregation)

### Séparation des Responsabilités

- **Commandes** : Modifient l'état (écriture)
- **Requêtes** : Récupèrent des données (lecture)

### Avantages

- **Optimisation** : Possibilité d'optimiser les lectures et écritures indépendamment
- **Scalabilité** : Possibilité de scaler les lectures et écritures séparément
- **Flexibilité** : Différents modèles pour la lecture et l'écriture

## 🧪 Testabilité

### Inversion de Dépendance

```typescript
// Injection de dépendance avec token
{
  provide: APPOINTMENT_REPOSITORY,
  useClass: AppointmentRepository,
}
```

### Tests Unitaires

Chaque couche peut être testée indépendamment grâce à l'inversion de dépendance.

## 🚀 Extensions Possibles

1. **Notifications** : Event handlers pour emails/SMS
2. **Saga Pattern** : Gestion de processus métier complexes
3. **API GraphQL** : Interface GraphQL
4. **Webhooks** : Notifications vers systèmes externes
5. **Caching** : Redis pour les projections
6. **Monitoring** : Métriques et observabilité

## 📚 Ressources

- [NestJS Documentation](https://docs.nestjs.com/)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Prisma Documentation](https://www.prisma.io/docs/)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
