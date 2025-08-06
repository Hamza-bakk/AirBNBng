# 🏡 Plateforme de Réservation de Biens Immobiliers - Angular + Firebase

> Application développée avec Angular 16 et Firebase Realtime Database. Elle permet de gérer des biens immobiliers et de réserver en ligne selon deux rôles : administrateur et client.

---

## 📌 Présentation

Cette application simule une plateforme de location de biens immobiliers. Elle offre deux expériences utilisateur distinctes :

- 👩‍💼 **Administrateur** : gère les biens immobiliers.
- 🧑‍💻 **Client** : peut réserver, consulter ou annuler ses réservations.

La base de données en temps réel de **Firebase** permet une synchronisation instantanée des données sur tous les clients connectés.

---

## 👥 Gestion des rôles

### 🔐 Authentification

Chaque utilisateur est identifié et possède un rôle stocké en base :

- `admin` : accès à la gestion complète des biens.
- `client` : accès à la réservation et consultation.

---

## 🛠️ Fonctionnalités par rôle

### 🧑‍💼 Client

- 📅 **Réserver un bien** :
  - Saisie des dates d’arrivée / départ
  - Nombre de personnes
  - Prix total calculé automatiquement
  - Commentaire facultatif

- 📋 **Consulter ses réservations** :
  - Vue détaillée
  - Photos, statut, dates, prix

- ❌ **Annuler une réservation** :
  - Possible uniquement si la réservation est encore en attente (`en_attente`)

### 👨‍💼 Administrateur

- ➕ **Ajouter un bien**
- ✏️ **Modifier un bien**
- 🗑️ **Supprimer un bien**
- 🔍 **Consulter tous les biens disponibles**

---

## 🧱 Architecture

### Technologies
- **Frontend** : Angular 16
- **Backend** : Firebase Realtime Database
- **Styles** : Bootstrap 5

### Dossiers principaux
- `models/` : contient les classes `Bien` et `Reservation`
- `services/` :
  - `firebase-bien.service.ts`
  - `firebase-reservation.service.ts`
  - `auth.service.ts`

---

## 💡 Modèle de données

### Reservation
```ts
export class Reservation {
  id?: string;
  bienId: string;
  clientId: string;
  dateArrivee: Date;
  dateDepart: Date;
  nombrePersonnes: number;
  prixTotal: number;
  statut: 'en_attente' | 'confirmee' | 'annulee';
  dateReservation: Date;
  commentaire?: string;

  calculerDuree(): number { ... }
  estActive(): boolean { ... }
  peutEtreAnnulee(): boolean { ... }
  chevauche(dateDebut: Date, dateFin: Date): boolean { ... }
}
