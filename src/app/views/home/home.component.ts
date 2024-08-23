import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatchTableComponent } from '../../components/match-table/match-table.component';
import { MatButtonModule } from '@angular/material/button';
import { StatsComponent } from '../../components/stats/stats.component';
import { PrevMatchComponent } from '../../components/prev-match/prev-match.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchTableComponent, MatButtonModule, StatsComponent, PrevMatchComponent],
  standalone: true
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
