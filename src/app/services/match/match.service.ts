import { inject, Injectable } from '@angular/core';
import {
    addDoc,
    collection,
    DocumentReference,
    Firestore,
    GeoPoint,
    getDocs,
    query,
    updateDoc,
    where
} from '@angular/fire/firestore';
import { catchError, from, map, Observable, switchMap, take } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User, UserService } from '../user/user.service';

export interface Match {
    id: string;
    maxTeamPlayers: number;
    place: GeoPoint;
    startingTime: Date;
    createdByRef: DocumentReference<User>;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class MatchService {
    firestore = inject(Firestore);
    authService = inject(AuthService);
    userService = inject(UserService);

    matchCollection = collection(this.firestore, 'matches');

    addMatch(match: Partial<Match>) {
        return from(addDoc(this.matchCollection, match))
            .pipe(
                take(1),
                switchMap((docRef) => {
                    // Once the document is created, update the document with its own ID
                    const updatedData = {
                        ...match,
                        id: docRef.id,
                        createdByRef: this.authService.getCurrentUserDocRef()
                    };
                    return from(updateDoc(docRef, updatedData)).pipe(
                        // After updating, return the document reference
                        map(() => docRef)
                    ); // Use updateDoc to add the ID field and created By field
                })
            )
            .subscribe();
    }

    getMatch(matchId: string): Observable<Match | null> {
        const matchesCollection = collection(this.firestore, 'matches');
        const q = query(matchesCollection, where('id', '==', matchId));
        const docsSnapshotPromise = getDocs(q);

        return from(docsSnapshotPromise).pipe(
            map((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    return { id: doc.id, ...doc.data() } as Match;
                } else {
                    return null; // No document found
                }
            }),
            catchError((error) => {
                console.error('Error fetching match:', error);
                return [null];
            })
        );
    }
}
