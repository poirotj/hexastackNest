# 🚀 Intégration Kafka pour la Communication Inter-Bounded Contexts

## Vue d'ensemble

Cette intégration Kafka permet à notre service de rendez-vous de communiquer avec d'autres Bounded Contexts (BC) de manière asynchrone et découplée, respectant parfaitement les principes de l'architecture hexagonale.

## 🏗️ Architecture

```
┌─────────────────┐    Kafka    ┌─────────────────┐
│   BC Patient    │ ──────────→ │ BC Appointment  │
│                 │             │                 │
└─────────────────┘             └─────────────────┘
         │                               │
         │                               │
         ▼                               ▼
┌─────────────────┐             ┌─────────────────┐
│   BC Doctor     │ ──────────→ │   Event Store   │
│                 │             │   (MongoDB)     │
└─────────────────┘             └─────────────────┘
         │
         ▼
┌─────────────────┐
│  BC Calendar    │
│                 │
└─────────────────┘
```

## 🔧 Composants

### 1. Configuration Kafka (`kafka.config.ts`)
- Configuration des brokers, consumer groups, et topics
- Définition des topics pour chaque type d'événement

### 2. Producteur d'événements (`kafka-event-publisher.service.ts`)
- Implémente `IEventPublisher` du domaine
- Publie les domain events sur les topics Kafka appropriés
- Gestion des erreurs et retry policies

### 3. Consommateur d'événements (`kafka-event-consumer.service.ts`)
- Écoute les événements des autres BCs
- Déclenche des processus métier en réponse
- Traitement asynchrone des événements inter-BCs

### 4. Module Kafka (`kafka.module.ts`)
- Configure et fournit tous les services Kafka
- Intègre avec le système de DI de NestJS

## 📡 Topics Kafka

### Événements publiés (Outbound)
- `appointment.created` - Nouveau rendez-vous créé
- `appointment.confirmed` - Rendez-vous confirmé
- `appointment.cancelled` - Rendez-vous annulé
- `appointment.completed` - Rendez-vous terminé

### Événements reçus (Inbound)
- `patient.registered` - Nouveau patient enregistré
- `doctor.available` - Médecin disponible
- `calendar.slot.freed` - Créneau libéré

## 🎯 Cas d'usage

### 1. Création d'un rendez-vous
```
1. Patient crée un rendez-vous
2. Domain event "AppointmentCreated" généré
3. Événement publié sur Kafka topic "appointment.created"
4. Autres BCs (Notification, Calendar) écoutent et réagissent
```

### 2. Réception d'un événement externe
```
1. BC Patient publie "patient.registered"
2. Notre service écoute ce topic
3. Traitement métier déclenché (vérification, notifications, etc.)
4. Mise à jour des projections si nécessaire
```

## 🚀 Démarrage

### 1. Démarrer l'infrastructure
```bash
./start-app-with-kafka.sh
```

### 2. Tester la communication
```bash
./test-kafka-events.sh
```

## 🔍 Monitoring

### Kafka UI
- **URL**: http://localhost:8080
- **Fonctionnalités**:
  - Visualisation des topics
  - Monitoring des messages
  - Gestion des consumer groups

### Logs de l'application
```bash
# Voir les événements publiés
docker-compose logs -f hexagonal-app | grep "Événement publié"

# Voir les événements reçus
docker-compose logs -f hexagonal-app | grep "Événement reçu"
```

## 🛡️ Gestion des erreurs

### Producteur
- Retry automatique en cas d'échec
- Logging détaillé des erreurs
- Fallback vers un système de retry

### Consommateur
- Gestion des erreurs par événement
- Logging des échecs
- Possibilité de dead letter queue

## 🔄 Patterns implémentés

### 1. Event-Driven Architecture
- Communication asynchrone entre BCs
- Découplage des services
- Scalabilité horizontale

### 2. Saga Pattern
- Orchestration des processus métier complexes
- Gestion des compensations
- Cohérence transactionnelle

### 3. Outbox Pattern (à implémenter)
- Publication fiable des événements
- Cohérence entre base de données et Kafka
- Gestion des échecs de publication

## 🚧 Prochaines étapes

1. **Outbox Pattern** pour la fiabilité
2. **Schema Registry** pour la validation des événements
3. **Dead Letter Queue** pour la gestion des échecs
4. **Monitoring avancé** avec métriques et alertes
5. **Tests d'intégration** avec des BCs réels

## 📚 Ressources

- [KafkaJS Documentation](https://kafka.js.org/)
- [NestJS Microservices](https://docs.nestjs.com/microservices/kafka)
- [Event Sourcing Patterns](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Saga Pattern](https://microservices.io/patterns/data/saga.html)
