import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Utilisateur } from '../models/utilisateur.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  utilisateur: Utilisateur | null = null;
  estAdmin = false;
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }

  async ngOnInit() {
    this.utilisateur = await this.authService.waitForUtilisateur();
    this.estAdmin = this.utilisateur?.role === 'admin';
  }
}
