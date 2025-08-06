import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Bien } from '../models/bien.model';
import { FirebaseBienService } from '../services/firebase-bien.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-bien',
  templateUrl: './bien.component.html',
  styleUrls: ['./bien.component.css'],
})
export class BienComponent implements OnInit {
  biens: Bien[] = [];
  biensAffiches: Bien[] = [];
  texteRecherche: string = '';
  photos = 'abcdefghijklmnopqrstuv'.split('').map((l) => `/assets/${l}.png`);
  utilisateurs = [
    { id: 'u1', nom: 'Dupont', prenom: 'Jean' },
    { id: 'u2', nom: 'Martin', prenom: 'Claire' },
    { id: 'u3', nom: 'Durand', prenom: 'Lucas' },
  ];
  indexAffichage = 0;
  pas = 5;

  constructor(
    private bienService: FirebaseBienService,
    public authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    const existants = await this.bienService.getAllBiens();
    if (existants.length === 0) {
      await this.genererEtEnregistrerBiens();
      this.biens = await this.bienService.getAllBiens();
    } else {
      this.biens = existants;
    }
    this.biensAffiches = [...this.biens]; // initialisation complète
  }

  rechercherBiens() {
    const txt = this.texteRecherche.trim().toLowerCase();

    if (!txt) {
      // si recherche vide, on affiche tout
      this.biensAffiches = [...this.biens];
      return;
    }

    // Sinon on filtre
    this.biensAffiches = this.biens.filter((bien) => {
      return (
        bien.titre.toLowerCase().includes(txt) ||
        bien.ville.toLowerCase().includes(txt) ||
        bien.adresse.toLowerCase().includes(txt) ||
        bien.description.toLowerCase().includes(txt)
      );
    });
  }

  async genererEtEnregistrerBiens() {
    const villes = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse'];
    const equipementsPossibles = [
      'Wi-Fi',
      'Climatisation',
      'Piscine',
      'Parking',
      'Cuisine équipée',
    ];

    for (let i = 0; i < this.photos.length; i++) {
      const bien = new Bien({
        titre: `Super bien ${i + 1}`,
        description: `Description du bien numéro ${i + 1}`,
        prix: Math.floor(Math.random() * 200 + 50),
        capacite: Math.floor(Math.random() * 5 + 1),
        adresse: `${Math.floor(Math.random() * 100)} rue Exemple`,
        ville: villes[Math.floor(Math.random() * villes.length)],
        photos: [this.photos[i]],
        equipements: this.shuffleArray(equipementsPossibles).slice(0, 3),
        disponible: Math.random() > 0.2,
        likes: 0,
        likedBy: [],
        dateCreation: new Date(),
        proprietaireId:
          this.utilisateurs[
            Math.floor(Math.random() * this.utilisateurs.length)
          ].id,
      });

      await this.bienService.addBien(bien);
    }
  }

  afficherPlus(): void {
    const nouveaux = this.biens.slice(
      this.indexAffichage,
      this.indexAffichage + this.pas
    );
    this.biensAffiches = [...this.biensAffiches, ...nouveaux];
    this.indexAffichage += this.pas;
  }

  shuffleArray(array: any[]): any[] {
    return [...array].sort(() => 0.5 - Math.random());
  }
  goToReservation(id: string): void {
    if (this.authService.getUtilisateur()) {
      this.router.navigate(['/reservation', id]);
    } else {
      this.router.navigate(['/user']);
    }
  }
}
