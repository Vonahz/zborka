import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Resolve } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthResolver implements Resolve<any> {
    constructor(private afAuth: AngularFireAuth) {}

    resolve() {
        return firstValueFrom(this.afAuth.authState);
    }
}
