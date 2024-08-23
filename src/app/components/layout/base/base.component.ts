import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'z-base',
    standalone: true,
    imports: [HeaderComponent, FooterComponent, RouterOutlet],
    templateUrl: './base.component.html',
    styleUrl: './base.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseComponent {
    authService = inject(AuthService);
    userIsLogged = this.authService.isLoggedIn;
}
