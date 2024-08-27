import { inject, Injectable } from '@angular/core';
import {
    collection,
    doc,
    DocumentReference,
    Firestore,
    getDoc,
    getDocs,
    query,
    where
} from '@angular/fire/firestore';
import { combineLatest, from, map, Observable, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Match, MatchService } from '../match/match.service';
import { UserService } from '../user/user.service';

interface BasePlayer {
    matchRef: DocumentReference;
}

export interface RegisteredPlayer extends BasePlayer {
    userRef: DocumentReference;
}

export interface UnregisteredPlayer extends BasePlayer {
    name: string;
    addedByRef: DocumentReference;
}

export type Player = RegisteredPlayer | UnregisteredPlayer;

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    firestore = inject(Firestore);
    authService = inject(AuthService);
    userService = inject(UserService);
    matchService = inject(MatchService);

    playerCollection = collection(this.firestore, 'players');

    currentUserRef = this.authService.getCurrentUserDocRef();

    getPlayers(): Observable<Player[]> {
        // Convert the getDocs promise into an observable
        return from(getDocs(this.playerCollection)).pipe(
            // Map the query snapshot to an array of document data
            map((querySnapshot) =>
                querySnapshot.docs.map((doc) => doc.data() as Player)
            )
        );
    }

    getCurrentPlayerMatches(): Observable<Match[]> {
        return this.getPlayersByUserRef().pipe(
            switchMap((matchRefs) => {
                if (matchRefs.length === 0) {
                    return from([]); // Return an empty array if no matchRefs
                }

                // Create a query for each matchRef
                const matchQueries = matchRefs.map((matchRef) =>
                    getDoc(doc(this.matchService.matchCollection, matchRef))
                );

                // Fetch all matches
                return from(Promise.all(matchQueries)).pipe(
                    map((matchSnapshots) => {
                        const allMatches = matchSnapshots
                            .filter((snapshot) => snapshot.exists()) // Filter out non-existing documents
                            .map((snapshot) => snapshot.data() as Match);

                        return allMatches;
                    })
                );
            })
        );
    }

    getMatchPlayers(matchId: string): Observable<Player[]> {
        // Convert the matchId string into a DocumentReference
        const matchRef = doc(this.firestore, `matches/${matchId}`);

        const matchQuery = query(
            this.playerCollection,
            where('matchRef', '==', matchRef)
        );

        return from(getDocs(matchQuery)).pipe(
            map((snapshot) => {
                const players = snapshot.docs.map(
                    (doc) => doc.data() as Player
                );
                return players;
            })
        );
    }

    private getPlayersByUserRef(): Observable<string[]> {
        const userRefQuery = query(
            this.playerCollection,
            where('userRef', '==', this.currentUserRef)
        );

        const addedByQuery = query(
            this.playerCollection,
            where('addedByRef', '==', this.currentUserRef)
        );

        return combineLatest([
            from(getDocs(userRefQuery)),
            from(getDocs(addedByQuery))
        ]).pipe(
            // Map the query snapshot to an array of document data
            map(([userRefSnapshot, addedBySnapshot]) => {
                // Extract data from both query snapshots and combine into one array
                const userRefDocs = userRefSnapshot.docs.map(
                    (doc) => doc.data() as Player
                );
                const addedByDocs = addedBySnapshot.docs.map(
                    (doc) => doc.data() as Player
                );

                // Extract matchRefs and ensure they are unique
                const allDocs = [...userRefDocs, ...addedByDocs];
                const matchRefs = Array.from(
                    new Set(
                        allDocs.map((doc) => {
                            const ref = doc.matchRef;

                            // If matchRef is a DocumentReference, get its ID
                            return ref instanceof DocumentReference
                                ? ref.id
                                : ref; // Extract document ID or use the path if it's a string
                        })
                    )
                );

                return matchRefs;
            })
        );
    }
}
