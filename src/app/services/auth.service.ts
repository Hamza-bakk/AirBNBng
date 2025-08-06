import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Utilisateur } from '../models/utilisateur.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private utilisateurSubject = new BehaviorSubject<Utilisateur | null>(null);
  utilisateur$ = this.utilisateurSubject.asObservable();

  setUtilisateur(user: Utilisateur | null) {
    this.utilisateurSubject.next(user);
  }

  getUtilisateur(): Utilisateur | null {
    return this.utilisateurSubject.getValue();
  }

  isAuthenticated(): boolean {
    return !!this.utilisateurSubject.getValue();
  }

  async waitForUtilisateur(): Promise<Utilisateur | null> {
    return new Promise((resolve) => {
      const sub = this.utilisateur$.subscribe((user) => {
        if (user !== null) {
          resolve(user);
          sub.unsubscribe();
        }
      });
    });
  }

  logout() {
    this.setUtilisateur(null);
  }
}
