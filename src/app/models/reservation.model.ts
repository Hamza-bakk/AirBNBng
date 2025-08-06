export class Reservation {
  id?: string;
  bienId: string;
  clientId: string;
  dateArrivee: Date;
  dateDepart: Date;
  nombrePersonnes: number;
  prixTotal: number;
  statut: 'en_attente' | 'confirmee' | 'annulee';
  dateReservation: Date;
  commentaire?: string;

  constructor(data: Partial<Reservation> = {}) {
    this.id = data.id;
    this.bienId = data.bienId || '';
    this.clientId = data.clientId || '';
    this.dateArrivee = data.dateArrivee || new Date();
    this.dateDepart = data.dateDepart || new Date();
    this.nombrePersonnes = data.nombrePersonnes || 1;
    this.prixTotal = data.prixTotal || 0;
    this.statut = data.statut || 'en_attente';
    this.dateReservation = data.dateReservation || new Date();
    this.commentaire = data.commentaire;
  }

  // Méthodes métier
  calculerDuree(): number {
    const diffTime = Math.abs(this.dateDepart.getTime() - this.dateArrivee.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  estActive(): boolean {
    return this.statut === 'confirmee' && this.dateDepart >= new Date();
  }

  peutEtreAnnulee(): boolean {
    const maintenant = new Date();
    const unJourAvant = new Date(this.dateArrivee);
    unJourAvant.setDate(unJourAvant.getDate() - 1);
    
    return this.statut === 'confirmee' && maintenant < unJourAvant;
  }

  chevauche(dateDebut: Date, dateFin: Date): boolean {
    return this.dateArrivee < dateFin && this.dateDepart > dateDebut;
  }
}