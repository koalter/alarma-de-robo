import { Injectable } from '@angular/core';
import { Auth, User, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Logger } from '../services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User | null = null;

  constructor(private auth: Auth,
    private logger: Logger
  ) { 
    this.auth.onAuthStateChanged(user => {
      this.user = user;
    });
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return this.user;
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
