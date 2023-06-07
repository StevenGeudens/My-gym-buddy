import { Injectable } from '@angular/core';
import { Auth, signInWithCredential, signOut } from '@angular/fire/auth';
import { GoogleAuthProvider, GithubAuthProvider, EmailAuthProvider , User } from 'firebase/auth';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser: BehaviorSubject<null | User> = new BehaviorSubject<null | User>(null);

  constructor(public auth: Auth, public router: Router) {
    this.auth.onAuthStateChanged(user => this.setCurrentUser(user as User));
  }

  isLoggedIn(): boolean {
    return this.currentUser.value !== null && this.currentUser.value !== undefined;
  }

  getUserUID(): string | undefined {
    return this.isLoggedIn() ? this.currentUser.value.uid : undefined;
  }

  async signOut(): Promise<void> {
    // Sign out on the native layer
    await FirebaseAuthentication.signOut();

    // Sign out on the web layer
    if (Capacitor.isNativePlatform()){
      await signOut(this.auth);
    }

    await this.router.navigate(['/welcome']);
  }

  async createUserWithEmailAndPassword(email: string, password: string): Promise<void> {
    await FirebaseAuthentication.createUserWithEmailAndPassword({email, password}).then(() => {
      // Sign in on the web layer
      if (Capacitor.isNativePlatform()) {
        const credential = EmailAuthProvider.credential(email, password);
        signInWithCredential(this.auth, credential);
      }
    });
  }

  async signInUserWithEmailAndPassword(email: string, password: string): Promise<void> {
    // Sign in on the native layer
    await FirebaseAuthentication.signInWithEmailAndPassword({email, password});

    // Sign in on the web layer
    if (Capacitor.isNativePlatform()) {
      const credential = EmailAuthProvider.credential(email, password);
      await signInWithCredential(this.auth, credential);
    }
  }

  async signInWithGoogle(): Promise<void> {
    // Sign in on the native layer
    const {credential: {idToken}} = await FirebaseAuthentication.signInWithGoogle();

    // Sign in on the web layer
    if (Capacitor.isNativePlatform()){
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(this.auth, credential);
    }
  }

  async signInWithGithub(): Promise<void> {
    // Sign in on the native layer
    const {credential: {accessToken}} = await FirebaseAuthentication.signInWithGithub();

    // Sign in on the web layer
    if (Capacitor.isNativePlatform()){
      const credential = GithubAuthProvider.credential(accessToken);
      await signInWithCredential(this.auth, credential);
    }
  }

  convertAuthErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-disabled': {
        return 'Sorry your user is disabled';
      }
      case 'auth/email-already-in-use': {
        return 'The provided email is already in use by an existing user';
      }
      case 'auth/account-exists-with-different-credential': {
        return 'This account already exists from another provider';
      }
      case 'auth/user-not-found': {
        return 'No user found';
      }
      case 'auth/wrong-password': {
        return 'Password is incorrect';
      }
      case 'auth/too-many-requests': {
        return 'Access to this account has been temporarily disabled due to many failed login attempts';
      }
      default: {
        return 'Whoops, something whet wrong';
      }
    }
  }

  private async setCurrentUser(user: User): Promise<void> {
    this.currentUser.next(user);
    if (this.currentUser) {
      await this.router.navigate(['/']);
    } else {
      await this.router.navigate(['/welcome']);
    }
  }

}
