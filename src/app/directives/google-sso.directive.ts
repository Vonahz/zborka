import { Directive, HostListener, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@firebase/auth';
import { AuthService } from '../services/auth/auth.service';

@Directive({
    selector: '[googleSso]',
    standalone: true
})
export class GoogleSsoDirective {
    angularFireAuth = inject(AngularFireAuth);
    authService = inject(AuthService);

    @HostListener('click')
    async onClick() {
        const creds = await this.angularFireAuth.signInWithPopup(
            new GoogleAuthProvider()
        );
        this.authService.login(creds);
    }
}
