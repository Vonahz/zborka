import { GeoPoint, Timestamp } from '@angular/fire/firestore';
import { Player } from '../../services/match/match.service';
export interface MatchData {
    players: Player[];
    matchTableId: string;
    place: GeoPoint;
    time: Timestamp;
    matchParticipantCount: number;
}
