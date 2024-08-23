import { inject, Injectable } from '@angular/core';
import {
    collection,
    collectionData,
    doc,
    DocumentReference,
    Firestore,
    getDoc,
    getDocs,
    query,
    setDoc,
    where
} from '@angular/fire/firestore';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

export interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    firestore = inject(Firestore);

    async addUser(creds: firebase.auth.UserCredential) {
        const credsUser = creds.user;
        if (!credsUser) return;
        const userDocRef = doc(this.firestore, 'users', credsUser.uid);
        const docSnap = await getDoc(userDocRef);

        const userData: User = {
            uid: credsUser.uid,
            email: credsUser.email,
            displayName: credsUser.displayName,
            photoURL: credsUser.photoURL
        };

        if (docSnap.exists()) {
            console.warn('User already exists with ID:', userDocRef.id);
            await setDoc(userDocRef, userData, { merge: true });
        } else {
            setDoc(userDocRef, userData);
        }

        return userDocRef;
    }

    getUsers(): Observable<User[]> {
        const userCollection = collection(this.firestore, 'users');
        return collectionData(userCollection, {
            idField: 'email'
        }) as Observable<User[]>;
    }

    getUserDocRefById(userId: string): DocumentReference {
        return doc(this.firestore, `users/${userId}`);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const usersRef = collection(this.firestore, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { ...doc.data() } as User;
        }

        return null;
    }

    async getUserNameByRef(
        userRef: DocumentReference<User>
    ): Promise<string | null> {
        try {
            let userName: string | null = null;
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                userName = docSnap.data().displayName;
            }
            return userName;
        } catch (e) {
            console.error(e);
            return '';
        }
    }

    async getUserData(userId: string) {
        const userRef = this.getUserDocRefById(userId);
        if (userRef) {
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                return docSnap.data();
            }
        }
        return null;
    }
}
