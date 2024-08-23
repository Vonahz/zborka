import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, RouterOutlet } from '@angular/router';
import { LoadingService } from '../../../services/loading/loading.service';
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
    loadingService = inject(LoadingService);
    afAuth = inject(AngularFireAuth);
    router = inject(Router);

    isLoading = this.loadingService.isLoading;

    ngOnInit(): void {
        this.afAuth.authState.subscribe((user) => {
            if (!user) {
                this.router.navigate(['/login']);
            }
        });
    }
}
