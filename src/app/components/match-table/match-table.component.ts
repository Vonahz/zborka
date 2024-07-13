import { Component, inject } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { MatchService } from '../../services/match/match.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-match-table',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './match-table.component.html',
  styleUrl: './match-table.component.scss'
})
export class MatchTableComponent {
  matchService = inject(MatchService);
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  $dataSource = this.matchService.getMatch();
}
