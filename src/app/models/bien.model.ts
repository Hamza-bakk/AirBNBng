export class Bien {
  id?: string;
  titre: string;
  description: string;
  prix: number; // Prix par nuit
  capacite: number; // Nombre de personnes max
  adresse: string;
  ville: string;
  photos: string[];
  equipements: string[];
  disponible: boolean;
  likes: number;
  likedBy: string[]; // IDs des utilisateurs qui ont liké
  dateCreation: Date;
  proprietaireId: string;

  constructor(data: Partial<Bien> = {}) {
    this.id = data.id;
    this.titre = data.titre || '';
    this.description = data.description || '';
    this.prix = data.prix || 0;
    this.capacite = data.capacite || 1;
    this.adresse = data.adresse || '';
    this.ville = data.ville || '';
    this.photos = data.photos || [];
    this.equipements = data.equipements || [];
    this.disponible = data.disponible !== undefined ? data.disponible : true;
    this.likes = data.likes || 0;
    this.likedBy = data.likedBy || [];
    this.dateCreation = data.dateCreation || new Date();
    this.proprietaireId = data.proprietaireId || '';
  }

  // Méthodes métier
  calculerPrixTotal(dateArrivee: Date, dateDepart: Date): number {
    const diffTime = Math.abs(dateDepart.getTime() - dateArrivee.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * this.prix;
  }

  peutAccueillir(nombrePersonnes: number): boolean {
    return this.capacite >= nombrePersonnes;
  }

  ajouterLike(userId: string): void {
    if (!this.likedBy.includes(userId)) {
      this.likedBy.push(userId);
      this.likes++;
    }
  }

  retirerLike(userId: string): void {
    const index = this.likedBy.indexOf(userId);
    if (index > -1) {
      this.likedBy.splice(index, 1);
      this.likes--;
    }
  }

  estLikePar(userId: string): boolean {
    return this.likedBy.includes(userId);
  }
}
