import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {
    catchError,
    forkJoin,
    map,
    mergeMap,
    of,
    startWith,
    Subject,
    switchMap
} from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { MatchService } from '../../services/match/match.service';
import {
    PlayerDocData,
    PlayerService,
    RegisteredPlayer,
    UnregisteredPlayer
} from '../../services/player/player.service';
import { UserService } from '../../services/user/user.service';
import { AddPlayerDialogComponent } from './add-player-dialog/add-player-dialog.component';
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
        MatDatepickerModule,
        AddPlayerDialogComponent
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
    authService = inject(AuthService);

    readonly dialog = inject(MatDialog);

    displayedColumns: string[] = ['no', 'name', 'action'];

    currrentUserId = this.authService.getCurrentUserDocRef().id;

    refresh$ = new Subject<void>();
    matchData$ = this.refresh$.asObservable().pipe(
        startWith(undefined), // Trigger the initial fetch
        switchMap(() => this.fetchMatchData())
    );

    async transFormPlayers(playersData: PlayerDocData[], maxPlayers: number) {
        // Use Promise.all to handle asynchronous mapping
        const matchPlayers = await Promise.all(
            playersData.map(async (playerData, index) => {
                const player = playerData.data;
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
                    userRef: (player as RegisteredPlayer).userRef,
                    addedByRef: (player as UnregisteredPlayer).addedByRef,
                    id: playerData.id
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

    removePlayer(playerId: string) {
        this.playerService
            .removePlayer(playerId)
            .then(() => this.refreshMatchData());
    }

    joinMatch(matchId: string) {
        console.log('join match', matchId);
    }

    userAlreadyJoined(players: MatchPlayer[]) {
        return players.filter((player) => player.id === this.currrentUserId);
    }

    openAddPlayerDialog(matchId: string): void {
        const dialogRef = this.dialog.open(AddPlayerDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result.confirmed) {
                this.playerService.addPlayer(matchId, result.name).then(() => {
                    this.refreshMatchData();
                });
            }
        });
    }

    private refreshMatchData() {
        this.refresh$.next();
    }

    private fetchMatchData() {
        return this.playerService.getCurrentPlayerMatches().pipe(
            mergeMap((matches) => {
                const matchObservables = matches.map((match) =>
                    forkJoin({
                        players: this.playerService
                            .getMatchPlayers(match.id)
                            .pipe(
                                switchMap((playersData) =>
                                    this.transFormPlayers(
                                        playersData,
                                        match.maxTeamPlayers * 2
                                    )
                                ),
                                catchError(() => of([]))
                            )
                    }).pipe(
                        map(({ players }) => ({
                            match: match,
                            players: players
                        })),
                        catchError(() => of({ match, players: [] }))
                    )
                );
                // Use forkJoin to combine all the observables into a single observable
                return forkJoin(matchObservables).pipe(
                    catchError(() => of([])) // Handle errors for the whole forkJoin
                );
            })
        );
    }
}
