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

  getRole(): string | undefined {
    return this.utilisateurSubject.value?.role;
  }
  logout() {
    this.setUtilisateur(null);
  }
}
