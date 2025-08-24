# Entités du Domaine

Ce dossier contient les **entités simples** du domaine, distinctes des **agrégats**.

## 🎯 **Différence entre Entités et Agrégats**

### **Entités (Entities)**
- **Responsabilité** : Représentation d'un objet métier simple
- **État** : Peut être modifié directement
- **Vie** : Peut exister indépendamment
- **Exemple** : `Participant`, `User`, `Configuration`

### **Agrégats (Aggregates)**
- **Responsabilité** : Gestion d'un groupe d'entités avec logique métier
- **État** : Encapsulé, modifié via méthodes métier
- **Vie** : Gère le cycle de vie de ses entités
- **Exemple** : `VisioAggregate` (gère Visio + Participants + Événements)

## 📁 **Contenu du Dossier**

- `participant.entity.ts` - Entité simple pour un participant
- `visio.entity.ts` - Entité de lecture pour les projections

## 🔗 **Liens**

- **Agrégats** : Voir `../aggregates/`
- **Value Objects** : Voir `../value-objects/`
- **Événements** : Voir `../events/`

