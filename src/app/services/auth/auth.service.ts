import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    router = inject(Router);
    fireAuth = inject(AngularFireAuth);
    document = inject(DOCUMENT);

    userData = signal<firebase.User | null>(null);
    isLoggedIn = computed(() => !!this.userData());

    constructor() {
        this.fireAuth.onAuthStateChanged((user) => {
            if (user) {
                this.userData.set(user);
            } else {
                this.userData.set(null);
            }
        });

        const localStorage = this.document.defaultView?.localStorage;
        if (localStorage) {
            if (localStorage.getItem('user') && !this.userData()) {
                const user = JSON.parse(localStorage.getItem('user') || '');
                this.userData.set(user);
            }

            effect(() => {
                localStorage.setItem('user', JSON.stringify(this.userData()));
            });
        }
    }

    login(creds: firebase.auth.UserCredential) {
        this.userData.set(creds.user);
        this.router.navigate(['/']);
    }

    logout() {
        this.router.navigate(['/login']);
        this.fireAuth.signOut();
    }
}
