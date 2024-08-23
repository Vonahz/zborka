import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { GoogleSsoDirective } from '../../directives/google-sso.directive';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'z-signin',
    standalone: true,
    imports: [MatButtonModule, GoogleSsoDirective],
    templateUrl: './signin.component.html',
    styleUrl: './signin.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninComponent {
    afAuth = inject(AngularFireAuth);
    auth = inject(AuthService);
    router = inject(Router);

    constructor() {
        this.afAuth.authState.subscribe((user) => {
            console.log('user', user);
            if (user) {
                this.router.navigate(['/']);
            }
        });
    }
}
