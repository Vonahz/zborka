import { inject, Injectable } from '@angular/core';
import {
    collection,
    collectionData,
    doc,
    DocumentReference,
    Firestore,
    GeoPoint,
    getDoc,
    getDocs,
    query,
    setDoc,
    Timestamp,
    where
} from '@angular/fire/firestore';
import {
    catchError,
    combineLatest,
    from,
    map,
    Observable,
    of,
    switchMap
} from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User, UserService } from '../user/user.service';

interface Match {
    id: string;
    maxPlayers: number;
    place: GeoPoint;
    startingTime: Timestamp;
}

export interface Player {
    matchRef: DocumentReference<Match>;
    playerName: string;
    userRef: DocumentReference<User>;
    addedByRef: DocumentReference<User>;
}

@Injectable({
    providedIn: 'root'
})
export class MatchService {
    firestore = inject(Firestore);
    authService = inject(AuthService);
    userService = inject(UserService);

    async addmatch(match: Match): Promise<void> {
        const matchCollection = collection(this.firestore, 'matches');

        const id = doc(matchCollection).id;
        const matchDoc = doc(this.firestore, `matches/${id}`);
        return setDoc(matchDoc, { ...match, id });
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

    getPlayers(): Observable<Player[]> {
        try {
            const playerCollection = collection(this.firestore, 'matchPlayers');
            return collectionData(playerCollection, {
                idField: 'matchId'
            }) as Observable<Player[]>;
        } catch (e) {
            console.error(e);
            return of([]);
        }
    }

    async getMatchDataByMatchRef(
        matchRef: DocumentReference<Match>
    ): Promise<Match | null> {
        try {
            let matchData: Match | null = null;
            const docSnap = await getDoc(matchRef);
            if (docSnap.exists()) {
                matchData = docSnap.data();
            }
            return matchData;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    getPlayersByCurrentUserRef(): Observable<Player[]> {
        const userRef = this.userService.getUserDocRefById(
            this.authService.userData()!.uid
        );
        // Create a reference to the 'players' collection
        const playersRef = collection(this.firestore, 'matchPlayers');

        // Create a query against the collection
        const playerQuery = query(playersRef, where('userRef', '==', userRef));

        // Execute the query and map the results to an observable
        return collectionData(playerQuery, { idField: 'id' }) as Observable<
            Player[]
        >;
    }

    getMatchesByRefs(matchRefs: DocumentReference[]): Observable<Match[]> {
        const matchDocs$ = matchRefs.map((ref) =>
            from(getDoc(ref)).pipe(
                map(
                    (docSnapshot) =>
                        ({
                            id: docSnapshot.id,
                            ...docSnapshot.data()
                        } as Match)
                )
            )
        );

        // Combine all observables into one observable
        return combineLatest(matchDocs$);
    }

    getPlayersAndMatchesByUserRef(): Observable<Match[]> {
        return this.getPlayersByCurrentUserRef().pipe(
            switchMap((players) => {
                // Extract matchRefs from the players
                const matchRefs: DocumentReference[] = players.map(
                    (player) => player.matchRef
                );

                // Get the corresponding match documents
                return this.getMatchesByRefs(matchRefs);
            })
        );
    }
}
