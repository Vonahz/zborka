import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { catchError, forkJoin, map, mergeMap, of, switchMap } from 'rxjs';
import { MatchService } from '../../services/match/match.service';
import {
    Player,
    PlayerService,
    RegisteredPlayer,
    UnregisteredPlayer
} from '../../services/player/player.service';
import { UserService } from '../../services/user/user.service';
import { MatchPlayer } from './match-table.model';

@Component({
    selector: 'z-match-table',
    standalone: true,
    imports: [
        MatTableModule,
        CommonModule,
        MatExpansionModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule
    ],
    templateUrl: './match-table.component.html',
    styleUrl: './match-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideNativeDateAdapter()]
})
export class MatchTableComponent {
    matchService = inject(MatchService);
    playerService = inject(PlayerService);
    userService = inject(UserService);

    displayedColumns: string[] = ['no', 'name', 'action'];

    matchData$ = this.playerService.getCurrentPlayerMatches().pipe(
        mergeMap((matches) => {
            const matchObservables = matches.map((match) =>
                //
                forkJoin({
                    players: this.playerService.getMatchPlayers(match.id).pipe(
                        switchMap((players) => this.transFormPlayers(players)),
                        catchError(() => of([]))
                    )
                }).pipe(
                    map(({ players }) => ({
                        match: match,
                        players: players
                    }))
                )
            );
            // Use forkJoin to combine all the observables into a single observable
            return forkJoin(matchObservables);
        })
    );

    async transFormPlayers(players: Player[]) {
        console.log(players);
        // Use Promise.all to handle asynchronous mapping
        const matchPlayers = await Promise.all(
            players.map(async (player, index) => {
                const name = (player as RegisteredPlayer).userRef
                    ? await this.userService.getUserNameByRef(
                          (player as RegisteredPlayer).userRef
                      )
                    : await this.buildAddedPlayerStringByUserId(
                          (player as UnregisteredPlayer).addedByRef,
                          (player as UnregisteredPlayer).name
                      );
                return {
                    no: index + 1,
                    name: name,
                    userRef:
                        (player as RegisteredPlayer).userRef ||
                        (player as UnregisteredPlayer).addedByRef
                } as MatchPlayer;
            })
        );

        return matchPlayers;
    }

    async buildAddedPlayerStringByUserId(
        userRef: DocumentReference,
        playerName: string
    ) {
        if (!userRef) return playerName;

        const addedBy = await this.userService.getUserNameByRef(userRef);
        return `${playerName} ${addedBy ? `(Added by ${addedBy})` : ''}`;
    }
}
