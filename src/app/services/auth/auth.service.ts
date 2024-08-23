import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { doc, DocumentReference, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { UserService } from '../user/user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    firestore = inject(Firestore);
    router = inject(Router);
    fireAuth = inject(AngularFireAuth);
    document = inject(DOCUMENT);
    userService = inject(UserService);

    public userData = signal<firebase.User | null>(null);
    public isLoggedIn = computed(() => !!this.userData());

    constructor() {
        this.fireAuth.onAuthStateChanged((user) => {
            if (user) {
                this.userData.set(user);
            } else {
                this.userData.set(null);
            }
        });
    }

    login(creds: firebase.auth.UserCredential) {
        this.userService.addUser(creds);
        this.router.navigate(['']);
    }

    logout() {
        this.router.navigate(['/login']);
        this.fireAuth.signOut();
    }

    getCurrentUserDocRef(): DocumentReference {
        return doc(this.firestore, `users/${this.userData()?.uid}`);
    }
}
