import { Component, OnInit } from '@angular/core';
import { Bien } from '../models/bien.model';
import { FirebaseBienService } from '../services/firebase-bien.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  biens: Bien[] = [];
  bienForm: Partial<Bien> = {};
  editerBienId?: string;

  constructor(private bienService: FirebaseBienService) {}

  ngOnInit(): void {
    this.chargerBiens();
  }

  async chargerBiens() {
    this.biens = (await this.bienService.getAllBiens()).filter(
      (b) => b.disponible
    );
  }

  async enregistrerBien() {
    const photosAEnvoyer = this.selectedFileBase64
      ? [this.selectedFileBase64] // nouvelle photo sélectionnée
      : this.bienForm.photos || []; // sinon garder photos actuelles

    const bien = new Bien({
      id: this.editerBienId || undefined,
      titre: this.bienForm.titre!,
      description: this.bienForm.description!,
      adresse: this.bienForm.adresse!,
      ville: this.bienForm.ville!,
      capacite: this.bienForm.capacite!,
      prix: this.bienForm.prix!,
      dateCreation: new Date(),
      disponible: true,
      likes: 0,
      likedBy: [],
      photos: photosAEnvoyer,
      equipements: this.bienForm.equipements || [],
    });

    if (this.editerBienId) {
      await this.bienService.updateBien(bien);
    } else {
      await this.bienService.addBien(bien);
    }

    this.bienForm = {};
    this.selectedFileBase64 = null;
    this.editerBienId = undefined;
    await this.chargerBiens();
  }

  editerBien(bien: Bien) {
    this.bienForm = { ...bien };
    this.editerBienId = bien.id;
  }

  async supprimerBien(id: string) {
    if (confirm('Supprimer ce bien ?')) {
      await this.bienService.deleteBien(id);
      await this.chargerBiens();
    }
  }

  annulerEdition() {
    this.bienForm = {};
    this.editerBienId = undefined;
  }

  selectedFileBase64: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileBase64 = reader.result as string;
      };
      reader.readAsDataURL(file); // convert to base64
    }
  }
}
