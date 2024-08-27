import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit
} from '@angular/core';
import { GeoPoint } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatchTableComponent } from '../../components/match-table/match-table.component';
import { PrevMatchComponent } from '../../components/prev-match/prev-match.component';
import { StatsComponent } from '../../components/stats/stats.component';
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
    ],
    standalone: true
})
export class HomeComponent implements OnInit {
    matchService = inject(MatchService);

    constructor() {}

    ngOnInit() {}

    createMatch() {
        this.matchService.addMatch({
            maxTeamPlayers: 6,
            startingTime: new Date(),
            place: new GeoPoint(80, 80),
            name: 'random' + Math.random()
        });
    }
}
