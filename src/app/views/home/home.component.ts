import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CreateMatchDialogComponent } from '../../components/match-table/create-match-dialog/create-match-dialog.component';
import { MatchTableComponent } from '../../components/match-table/match-table.component';
import { DialogService } from '../../services/core/dialog.service';
import { MatchService } from '../../services/match/match.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatchTableComponent, MatButtonModule]
})
export class HomeComponent implements OnInit {
    matchService = inject(MatchService);
    readonly dialog = inject(DialogService);

    constructor() {}

    ngOnInit() {}

    opeCreateMatchDialog(): void {
        const dialogRef = this.dialog.open(CreateMatchDialogComponent, {
            size: 'small'
        });
    }
}
