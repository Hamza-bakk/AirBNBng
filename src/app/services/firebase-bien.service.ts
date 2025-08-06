import { Injectable } from '@angular/core';
import { ref, push, set, get, child, update, remove } from 'firebase/database';
import { db } from './firebase.service';
import { Bien } from '../models/bien.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseBienService {
  private biensRef = ref(db, 'biens');

  async addBien(bien: Bien): Promise<void> {
    const newRef = push(this.biensRef);
    bien.id = newRef.key || undefined;
    await set(newRef, { ...bien });
  }

  async getAllBiens(): Promise<Bien[]> {
    const snapshot = await get(this.biensRef);
    const result: Bien[] = [];
    snapshot.forEach((child) => {
      const bien = child.val();
      result.push({ id: child.key, ...bien });
    });
    return result;
  }

  async getBienById(id: string): Promise<Bien | null> {
  const snapshot = await get(child(ref(db), `biens/${id}`));
  if (snapshot.exists()) {
    return { id, ...snapshot.val() } as Bien;
  }
  return null;
  }
  
  async updateBien(bien: Bien): Promise<void> {
    if (!bien.id) return;
    const bienRef = child(this.biensRef, bien.id);
    await update(bienRef, bien);
  }

  async deleteBien(bienId: string): Promise<void> {
    const bienRef = child(this.biensRef, bienId);
    await remove(bienRef);
  }

}
