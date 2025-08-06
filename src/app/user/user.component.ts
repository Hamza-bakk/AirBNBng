import { Component } from '@angular/core';
import { FirebaseUserService } from '../services/firebase-user.service';
import { AuthService } from '../services/auth.service';
import { Utilisateur } from '../models/utilisateur.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  email = '';
  password = '';
  nom = '';
  prenom = '';
  mode: 'login' | 'register' = 'login';
  message = '';

  constructor(
    private firebaseUserService: FirebaseUserService,
    public authService: AuthService,

  ) {}

  async register() {
    const utilisateur = new Utilisateur({
      email: this.email,
      password: this.password,
      nom: this.nom,
      prenom: this.prenom,
      role: 'client',
      dateInscription: new Date(),
      actif: true,
    });

    await this.firebaseUserService.addUser(utilisateur);
    this.authService.setUtilisateur(utilisateur);
    this.message = 'Inscription réussie !';
  }

  async login() {
    const user = await this.firebaseUserService.findUserByEmailAndPassword(
      this.email,
      this.password
    );
    if (user) {
      this.authService.setUtilisateur(user);
      this.message = 'Connexion réussie !';
    } else {
      this.message = 'Identifiants invalides';
    }
  }

  logout() {
    this.authService.logout();
    this.message = 'Déconnecté';
    window.location.reload();
  }
}
