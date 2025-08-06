import { Injectable } from '@angular/core';
import {
  ref,
  push,
  set,
  get,
  query,
  orderByChild,
  equalTo,
  update,
} from 'firebase/database';
import { db } from './firebase.service';

import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseReservationService {
  private reservationsRef = ref(db, 'reservations');

  async addReservation(res: Reservation): Promise<void> {
    const newRef = push(this.reservationsRef);
    res.id = newRef.key || undefined;
    await set(newRef, { ...res });
  }

  async getReservationsByBien(bienId: string): Promise<Reservation[]> {
    const q = query(
      this.reservationsRef,
      orderByChild('bienId'),
      equalTo(bienId)
    );
    const snap = await get(q);
    const res: Reservation[] = [];
    snap.forEach((child) => {
      res.push({ id: child.key, ...child.val() });
    });
    return res;
  }

  async getReservationsByClientId(clientId: string): Promise<Reservation[]> {
    const q = query(
      this.reservationsRef,
      orderByChild('clientId'),
      equalTo(clientId)
    );
    const snap = await get(q);
    const res: Reservation[] = [];
    snap.forEach((child) => {
      res.push({ id: child.key, ...child.val() });
    });
    return res;
  }

  async updateReservation(reservation: Reservation): Promise<void> {
    if (!reservation.id) throw new Error('ID réservation manquant');
    const reservationRef = ref(db, `reservations/${reservation.id}`);
    return update(reservationRef, { ...reservation });
  }
}
