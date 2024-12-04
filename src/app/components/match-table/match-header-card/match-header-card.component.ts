import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FirestoreDatePipe } from '../../../pipes/firestore-date.pipe';
import { AuthService } from '../../../services/auth/auth.service';
import { Match } from '../../../services/match/match.service';
import { GoogleMapComponent } from '../../google-map/google-map.component';

@Component({
    selector: 'z-match-header-card',
    imports: [
        MatCardModule,
        MatButtonModule,
        DatePipe,
        FirestoreDatePipe,
        GoogleMapComponent,
        GoogleMapComponent
    ],
    templateUrl: './match-header-card.component.html',
    styleUrl: './match-header-card.component.scss'
})
export class MatchHeaderCardComponent {
    authService = inject(AuthService);
    match = input.required<Match>();

    currentUserRefId = this.authService.getCurrentUserDocRef().id;

    toDate(timestamp: Timestamp) {
        return timestamp.toDate();
    }
}
