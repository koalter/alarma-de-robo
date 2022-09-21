import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private auth: Auth,
    private firestore: Firestore) { }

  async cerrarSesion(): Promise<void> {
    await signOut(this.auth);
  }

  async crearUsuario(mail: string, clave: string): Promise<any> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, mail, clave);
      await addDoc(collection(this.firestore, 'logUsuarios'), { usuario: mail, fechaInicio: new Date(Date.now()), app: 'tabla-didactica' });
      return result.user;

    } catch (err: any) {
      await addDoc(collection(this.firestore, 'logErrores'), { error: err.message, fecha: new Date(Date.now()), app: 'tabla-didactica' });
      throw err;
    }
  }

  async iniciarSesion(mail: string, clave: string): Promise<any> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, mail, clave);
      await addDoc(collection(this.firestore, 'logUsuarios'), { usuario: mail, fechaInicio: new Date(Date.now()), app: 'tabla-didactica' });
      return result.user;

    } catch (err: any) {
      await addDoc(collection(this.firestore, 'logErrores'), { error: err.message, fecha: new Date(Date.now()), app: 'tabla-didactica' });
      throw err;
    }
  }

  async getUsuario(): Promise<any> {
    return await this.auth.currentUser;
  }
}
