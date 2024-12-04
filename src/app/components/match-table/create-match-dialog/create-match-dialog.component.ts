import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
    MatDialogActions,
    MatDialogContent,
    MatDialogRef
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
    selector: 'z-create-match-dialog',
    imports: [
        MatButtonModule,
        MatDialogActions,
        MatDialogContent,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatDatepickerModule,
        MatTimepickerModule
    ],
    templateUrl: './create-match-dialog.component.html',
    styleUrl: './create-match-dialog.component.scss',
    providers: [provideNativeDateAdapter()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateMatchDialogComponent {
    readonly dialogRef = inject(MatDialogRef<CreateMatchDialogComponent>);

    onCancel() {
        console.log('cancel');
        this.dialogRef.close({ confirmed: false });
    }
    onOk() {
        console.log('ok');
        this.dialogRef.close({ confirmed: true });
    }
}
