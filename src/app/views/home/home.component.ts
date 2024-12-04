import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CreateMatchDialogComponent } from '../../components/match-table/create-match-dialog/create-match-dialog.component';
import { MatchTableComponent } from '../../components/match-table/match-table.component';
import { PrevMatchComponent } from '../../components/prev-match/prev-match.component';
import { StatsComponent } from '../../components/stats/stats.component';
import { DialogService } from '../../services/core/dialog.service';
import { MatchService } from '../../services/match/match.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatchTableComponent,
        MatButtonModule,
        StatsComponent,
        PrevMatchComponent
    ]
})
export class HomeComponent implements OnInit {
    matchService = inject(MatchService);
    readonly dialog = inject(DialogService);

    constructor() {}

    ngOnInit() {}

    createMatch() {
        // this.matchService.createMatch({
        //     maxTeamPlayers: 6,
        //     startingTime: new Date(),
        //     place: new GeoPoint(80, 80),
        //     name: 'random' + Math.random()
        // });
    }

    opeCreateMatchDialog(): void {
        const dialogRef = this.dialog.open(CreateMatchDialogComponent, {
            size: 'small'
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('result ', result);
            if (result?.confirmed) {
                // this.matchService.createMatch(result.matchData);
            }
        });
    }
}
