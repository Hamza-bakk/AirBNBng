import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '../models/reservation.model';
import { FirebaseReservationService } from '../services/firebase-reservation.service';
import { AuthService } from '../services/auth.service';
import { FirebaseBienService } from '../services/firebase-bien.service';
import { Bien } from '../models/bien.model';

interface ReservationAvecBien extends Reservation {
  bien?: Bien | null;
}

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
})
export class ReservationComponent implements OnInit {
  bienId = '';
  bien: Bien | null = null;
  dateArrivee = '';
  dateDepart = '';
  nombrePersonnes = 1;
  commentaire = '';
  prixTotal = 0;
  message = '';

  modeMesReservations = false;
  mesReservations: ReservationAvecBien[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private reservationService: FirebaseReservationService,
    private bienService: FirebaseBienService
  ) {}

  ngOnInit(): void {
    const path = this.route.snapshot.routeConfig?.path;
    this.modeMesReservations = path === 'mes_reservations';

    if (this.modeMesReservations) {
      this.chargerMesReservations();
    } else {
      this.bienId = this.route.snapshot.paramMap.get('id') || '';
      this.bienService
        .getBienById(this.bienId)
        .then((bien) => (this.bien = bien));
    }
  }

  async chargerMesReservations(): Promise<void> {
    const user = this.authService.getUtilisateur();
    if (!user) {
      this.router.navigate(['/user']);
      return;
    }

    const reservations =
      await this.reservationService.getReservationsByClientId(user.id!);

    this.mesReservations = await Promise.all(
      reservations.map(async (reservationData) => {
        const bien = await this.bienService.getBienById(reservationData.bienId);
        const reservation = new Reservation(reservationData);
        return Object.assign(reservation, { bien });
      })
    );
  }

  calculerPrixTotal(): void {
    if (this.dateArrivee && this.dateDepart && this.bien) {
      const debut = new Date(this.dateArrivee);
      const fin = new Date(this.dateDepart);
      const duree =
        Math.ceil((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24)) ||
        0;
      this.prixTotal = duree * this.bien.prix;
    }
  }

  async reserver(): Promise<void> {
    const user = this.authService.getUtilisateur();
    if (!user) {
      this.router.navigate(['/user']);
      return;
    }

    const reservation = new Reservation({
      bienId: this.bienId,
      clientId: user.id!,
      dateArrivee: new Date(this.dateArrivee),
      dateDepart: new Date(this.dateDepart),
      nombrePersonnes: this.nombrePersonnes,
      prixTotal: this.prixTotal,
      commentaire: this.commentaire,
      statut: 'en_attente',
      dateReservation: new Date(),
    });

    await this.reservationService.addReservation(reservation);
    this.message = 'Réservation enregistrée avec succès.';
  }

  async annulerReservation(reservation: ReservationAvecBien): Promise<void> {
  if (reservation.statut === 'en_attente') {
    reservation.statut = 'annulee';
    try {
      await this.reservationService.updateReservation(reservation);
      // Mise à jour locale
      this.mesReservations = this.mesReservations.map(r =>
        r.id === reservation.id ? reservation : r
      );
    } catch (error) {
      console.error('Erreur lors de l\'annulation :', error);
    }
  } else {
    console.log('La réservation ne peut être annulée car elle n\'est pas en attente.');
  }
}

  
}
