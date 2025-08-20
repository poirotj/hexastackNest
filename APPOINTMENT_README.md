# Exemple de Gestion de Rendez-vous avec NestJS, Architecture Hexagonale et Event Sourcing

Cet exemple démontre l'implémentation d'un système de gestion de rendez-vous utilisant :

- **NestJS** comme framework
- **Architecture Hexagonale** (Clean Architecture)
- **CQRS** (Command Query Responsibility Segregation)
- **Event Sourcing** avec Prisma et MongoDB
- **Event-Driven Architecture**

## Structure du Projet

```
src/
├── domain/                    # Couche domaine (cœur métier)
│   ├── entities/
│   │   └── appointment.entity.ts
│   └── repositories/
│       └── appointment.repository.interface.ts
├── application/               # Couche application (cas d'usage)
│   ├── commands/             # Commandes CQRS
│   │   ├── create-appointment.command.ts
│   │   ├── confirm-appointment.command.ts
│   │   ├── cancel-appointment.command.ts
│   │   └── handlers/
│   └── queries/              # Requêtes CQRS
│       ├── get-appointment.query.ts
│       ├── get-appointments.query.ts
│       └── handlers/
├── infrastructure/           # Couche infrastructure
│   ├── database/
│   │   └── prisma.service.ts
│   ├── repositories/
│   │   └── appointment.repository.ts
│   └── event-handlers/
├── userInterface/           # Couche interface utilisateur
│   └── controllers/
│       └── appointment.controller.ts
└── app/
    ├── appointment.module.ts
    └── app.module.ts
```

## Fonctionnalités

### 1. Création d'un Rendez-vous
```bash
POST /appointments
{
  "title": "Consultation cardiologie",
  "description": "Contrôle annuel",
  "startDate": "2024-01-15T10:00:00Z",
  "endDate": "2024-01-15T11:00:00Z",
  "patientId": "patient123",
  "doctorId": "doctor456"
}
```

### 2. Confirmation d'un Rendez-vous
```bash
PUT /appointments/{id}/confirm
```

### 3. Annulation d'un Rendez-vous
```bash
PUT /appointments/{id}/cancel
```

### 4. Récupération d'un Rendez-vous
```bash
GET /appointments/{id}
```

### 5. Liste des Rendez-vous
```bash
GET /appointments
GET /appointments?patientId=patient123
GET /appointments?doctorId=doctor456
```

## États des Rendez-vous

- **SCHEDULED** : Rendez-vous programmé
- **CONFIRMED** : Rendez-vous confirmé
- **CANCELLED** : Rendez-vous annulé
- **COMPLETED** : Rendez-vous terminé

## Event Sourcing

Chaque action sur un rendez-vous génère un événement stocké dans la collection `event_store` :

- `AppointmentCreatedEvent`
- `AppointmentConfirmedEvent`
- `AppointmentCancelledEvent`
- `AppointmentCompletedEvent`

## Projections

Le système maintient des projections optimisées pour la lecture dans la collection `appointment_read_models`.

## Installation et Configuration

1. **Installer les dépendances**
```bash
npm install
```

2. **Configurer la base de données MongoDB**
```bash
# Modifier le fichier .env
DATABASE_URL="mongodb://localhost:27017/appointment_db"
```

3. **Générer le client Prisma**
```bash
npx prisma generate
```

4. **Démarrer l'application**
```bash
npm run start:dev
```

## Avantages de cette Architecture

### 1. Séparation des Responsabilités
- **Domain** : Logique métier pure
- **Application** : Orchestration des cas d'usage
- **Infrastructure** : Détails techniques
- **User Interface** : Contrôleurs et DTOs

### 2. Event Sourcing
- **Audit Trail** : Historique complet des changements
- **Reconstruction** : Possibilité de reconstruire l'état à n'importe quel moment
- **Évolutivité** : Facilite l'ajout de nouvelles fonctionnalités

### 3. CQRS
- **Séparation** : Commandes et requêtes séparées
- **Optimisation** : Possibilité d'optimiser les lectures et écritures indépendamment
- **Scalabilité** : Possibilité de scaler les lectures et écritures séparément

### 4. Testabilité
- **Inversion de Dépendance** : Les interfaces permettent le mock facile
- **Isolation** : Chaque couche peut être testée indépendamment
- **Event Testing** : Possibilité de tester les événements générés

## Exemples d'Utilisation

### Créer un Rendez-vous
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

### Confirmer un Rendez-vous
```bash
curl -X PUT http://localhost:3000/appointments/{appointment_id}/confirm
```

### Récupérer tous les Rendez-vous d'un Patient
```bash
curl http://localhost:3000/appointments?patientId=patient123
```

## Extensions Possibles

1. **Notifications** : Ajouter des event handlers pour envoyer des emails/SMS
2. **Validation** : Ajouter des validations métier plus complexes
3. **Saga Pattern** : Gérer des processus métier complexes
4. **Projections** : Ajouter d'autres projections pour différents cas d'usage
5. **API GraphQL** : Ajouter une interface GraphQL
6. **Webhooks** : Notifier des systèmes externes
