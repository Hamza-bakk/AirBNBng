export class Utilisateur {
  id?: string;
  email: string;
  password: string;

  nom: string;
  prenom: string;
  telephone: string | null = null;
  role: 'client' | 'admin' | 'proprietaire';
  dateInscription: Date;
  avatar: string | null = null;
  actif: boolean;

  constructor(data: Partial<Utilisateur> = {}) {
    this.id = data.id;
    this.email = data.email || '';
    this.password = data.password || '';
    this.nom = data.nom || '';
    this.prenom = data.prenom || '';
    this.telephone = data.telephone || 'null';
    this.role = data.role || 'client';
    this.dateInscription = data.dateInscription || new Date();
    this.avatar = data.avatar || 'null';
    this.actif = data.actif !== undefined ? data.actif : true;
  }

  // Méthodes métier
  getNomComplet(): string {
    return `${this.prenom} ${this.nom}`;
  }

  estAdmin(): boolean {
    return this.role === 'admin';
  }

  estProprietaire(): boolean {
    return this.role === 'proprietaire';
  }

  estClient(): boolean {
    return this.role === 'client';
  }

  peutGererBiens(): boolean {
    return this.role === 'admin' || this.role === 'proprietaire';
  }
}
