import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
    name: 'firestoreDate',
    standalone: true
})
export class FirestoreDatePipe implements PipeTransform {
    transform(value: Timestamp): Date | null {
        return value ? value.toDate() : null;
    }
}
