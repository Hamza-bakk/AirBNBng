import { Injectable } from '@angular/core';
import {
  ref,
  push,
  set,
  get,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database';
import { Utilisateur } from '../models/utilisateur.model';
import { db } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseUserService {
  private usersRef = ref(db, 'users');

  // Créer un utilisateur (inscription)
  async addUser(user: Utilisateur): Promise<void> {
    const newUserRef = push(this.usersRef);
    user.id = newUserRef.key || undefined;
    await set(newUserRef, { ...user });
  }

  // Chercher un utilisateur par email et mot de passe (connexion simplifiée)
  async findUserByEmailAndPassword(
    email: string,
    password: string
  ): Promise<Utilisateur | null> {
    const usersQuery = query(
      this.usersRef,
      orderByChild('email'),
      equalTo(email)
    );
    const snapshot = await get(usersQuery);
    let found: Utilisateur | null = null;
    snapshot.forEach((child) => {
      const data = child.val();
      // Ici tu dois comparer le mot de passe (en clair ou hashé selon ton choix)
      if (data.password === password) {
        found = { id: child.key, ...data };
      }
    });
    return found;
  }
}
