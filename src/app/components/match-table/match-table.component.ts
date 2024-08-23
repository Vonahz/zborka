import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { map } from 'rxjs';
import { MatchService } from '../../services/match/match.service';
import { MatchTableService } from './match-table.service';

@Component({
    selector: 'z-match-table',
    standalone: true,
    imports: [MatTableModule, CommonModule],
    templateUrl: './match-table.component.html',
    styleUrl: './match-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchTableComponent implements OnInit {
    matchService = inject(MatchService);
    matchTableService = inject(MatchTableService);

    displayedColumns: string[] = ['no', 'name', 'action'];

    matchPlayers$ = this.matchTableService.getMatchPlayers();
    matchData$ = this.matchService
        .getPlayersAndMatchesByUserRef()
        .pipe(map((matches) => matches[0]));

    ngOnInit() {}
}
