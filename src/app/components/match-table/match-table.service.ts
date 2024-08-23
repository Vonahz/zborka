import { inject, Injectable } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { map, Observable, of } from 'rxjs';
import { MatchService } from '../../services/match/match.service';
import { User, UserService } from '../../services/user/user.service';
import { MatchData } from './match-table.model';

@Injectable({
    providedIn: 'root'
})
export class MatchTableService {
    userService = inject(UserService);
    matchService = inject(MatchService);

    async buildAddedPlayerStringByUserId(
        userId: DocumentReference<User>,
        playerName: string
    ) {
        console.log(userId);
        if (!userId) return playerName;

        const addedBy = await this.userService.getUserNameByRef(userId);
        return `${playerName} ${addedBy ? `(Added by ${addedBy})` : ''}`;
    }

    getMatchPlayers(): Observable<any[]> {
        // Observable<MatchData[]> {
        return this.matchService.getPlayers().pipe(
            map((players) =>
                players.map((player, index) => {
                    return {
                        no: index + 1,
                        name: player.userRef
                            ? this.userService.getUserNameByRef(player.userRef)
                            : this.buildAddedPlayerStringByUserId(
                                  player.addedByRef,
                                  player.playerName
                              )
                    };
                })
            )
        );

        // return zip(
        //     this.matchService.getMatch(matchId),
        //     this.matchService.getPlayers()
        // ).pipe(
        //     map((x) => {
        const data: MatchData[] = [];
        // if (x[0] && x[1]) {
        //     data.push({
        //         matchTableId: x[0].id,
        //         players: x[1],
        //         place: x[0].place,
        //         time: x[0].startingTime
        //     } as MatchData);
        // }

        return of(data);
        // })
        // ,catchError(() => {
        //     return of([]);
        // })
        // );
    }
}
