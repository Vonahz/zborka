import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PlayerService } from '../../../services/player/player.service';

@Component({
    selector: 'z-add-player-dialog',
    standalone: true,
    imports: [
        MatButtonModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogTitle,
        MatDialogContent,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './add-player-dialog.component.html',
    styleUrl: './add-player-dialog.component.scss'
})
export class AddPlayerDialogComponent {
    readonly dialogRef = inject(MatDialogRef<AddPlayerDialogComponent>);
    playerService = inject(PlayerService);

    playerName = '';

    onOk() {
        this.dialogRef.close({ confirmed: true, name: this.playerName });
    }

    onCancel() {
        this.dialogRef.close({ confirmed: false });
    }
}
