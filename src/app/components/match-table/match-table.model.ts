import { DocumentReference } from '@angular/fire/firestore';
import { Match } from '../../services/match/match.service';
export interface MatchData {
    players: MatchPlayer[];
    match: Match | null;
}

export interface MatchPlayer {
    id: string;
    no: number;
    name: string;
    userRef: DocumentReference | null;
    addedByRef: DocumentReference | null;
    added: boolean;
}
