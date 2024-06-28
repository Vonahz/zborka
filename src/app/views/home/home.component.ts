import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MatchTableComponent } from '../../components/match-table/match-table.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchTableComponent],
  standalone: true
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
