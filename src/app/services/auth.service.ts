import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Logger } from '../services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth,
    private logger: Logger) { }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch(e: any) {
      this.logger.logError(e);
      return null;
    }
  }

  async logout() {
    try {
      await this.auth.signOut();
      return true;
    } catch(e: any) {
      this.logger.logError(e);
      return false;
    }
  }
}
