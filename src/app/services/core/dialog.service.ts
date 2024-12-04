import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    readonly dialogOptions = {
        size: {
            small: {
                width: '200px'
            },
            medium: {
                width: '400px'
            },
            large: {
                width: '600px'
            }
        }
    };

    readonly dialog = inject(MatDialog);

    open(component: any, options?: { size: 'small' | 'medium' | 'large' }) {
        return this.dialog.open(component, {
            width: options?.size
                ? this.dialogOptions.size[options.size].width
                : this.dialogOptions.size.medium.width
        });
    }
}
