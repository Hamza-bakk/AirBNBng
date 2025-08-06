import { Component, OnInit } from '@angular/core';
import { Reservation } from '../models/reservation.model';
import { Bien } from '../models/bien.model';
import { FirebaseReservationService } from '../services/firebase-reservation.service';
import { FirebaseBienService } from '../services/firebase-bien.service';

@Component({
  selector: 'app-decision',
  templateUrl: './decision.component.html',
})
export class DecisionComponent implements OnInit {
  reservationsEnAttente: (Reservation & { bien?: Bien })[] = [];
  autresReservations: (Reservation & { bien?: Bien })[] = [];

  constructor(
    private reservationService: FirebaseReservationService,
    private bienService: FirebaseBienService
  ) {}

  async ngOnInit(): Promise<void> {
    const toutesReservations =
      await this.reservationService.getAllReservations();

    // Charger les biens associés et séparer par statut
    const reservationsAvecBiens = await Promise.all(
      toutesReservations.map(async (r) => {
        const bien = await this.bienService.getBienById(r.bienId);
        return Object.assign(new Reservation(r), { bien: bien || undefined });
      })
    );

    this.reservationsEnAttente = reservationsAvecBiens.filter(
      (r) => r.statut === 'en_attente'
    );
    this.autresReservations = reservationsAvecBiens.filter(
      (r) => r.statut !== 'en_attente'
    );
  }

  async valider(reservation: Reservation) {
    reservation.statut = 'confirmee';
    await this.reservationService.updateReservation(reservation);
    this.reservationsEnAttente = this.reservationsEnAttente.filter(
      (r) => r.id !== reservation.id
    );
  }

  async refuser(reservation: Reservation) {
    reservation.statut = 'annulee';
    await this.reservationService.updateReservation(reservation);
    this.reservationsEnAttente = this.reservationsEnAttente.filter(
      (r) => r.id !== reservation.id
    );
  }
}
