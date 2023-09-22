import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Logger {
  constructor(private firestore: Firestore) {}

  async logError(error: FirebaseError) {
    if (!environment.production) {
      console.error(error);
    }

    try {
      await addDoc(collection(this.firestore, 'errores'), {
        codigo: error.code,
        mensaje: error.message,
        nombre: error.name,
        stack: error.stack,
        fecha: new Date()
      });
    } catch (e) {
      console.error(e);
    }
  }
}
