# Agrégats du Domaine

Ce dossier contient les **agrégats** du domaine, qui sont des objets complexes gérant la logique métier et l'état d'un groupe d'entités.

## 🎯 **Rôle des Agrégats**

### **Responsabilités**
- **Logique Métier** : Contient les règles et validations métier
- **Gestion d'État** : Encapsule et protège l'état des entités
- **Cohérence** : Assure la cohérence entre les entités qu'il gère
- **Événements** : Émet des événements de domaine pour les changements d'état

### **Caractéristiques**
- **Encapsulation** : État privé, accès via méthodes publiques
- **Invariants** : Maintient les règles métier (ex: "une visio doit avoir au moins 2 participants")
- **Transactions** : Chaque méthode métier est une transaction atomique
- **Event Sourcing** : Émet des événements pour chaque modification

## 📁 **Contenu du Dossier**

- `visio.aggregate.ts` - Agrégat principal gérant les visioconférences

## 🔄 **Flux de Données**

```
1. Commande reçue → Handler
2. Handler appelle l'agrégat
3. Agrégat valide et modifie l'état
4. Agrégat émet des événements
5. Événements sauvegardés dans l'Event Store
```

## 🏗️ **Architecture**

### **VisioAggregate**
- **Gère** : Visio + Participants + Configuration
- **Méthodes** : `start()`, `addParticipant()`, `end()`, etc.
- **Événements** : `VisioStartedEvent`, `ParticipantAddedEvent`, etc.
- **Invariants** : 
  - Une visio doit avoir au moins 2 participants pour démarrer
  - Le statut ne peut changer que selon des transitions valides
  - La configuration ne peut être modifiée que si la visio n'est pas active

## 🔗 **Liens**

- **Entités** : Voir `../entities/`
- **Value Objects** : Voir `../value-objects/`
- **Événements** : Voir `../events/`

